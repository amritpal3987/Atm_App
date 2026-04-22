from db import get_connection
from security import hash_pin, check_pin

#  Create user (for testing)
def create_user_service(name, pin):
    conn = get_connection()
    cur = conn.cursor()

    hashed = hash_pin(pin).decode()

    cur.execute(
        "INSERT INTO users (name, pin_hash) VALUES (%s, %s) RETURNING user_id",
        (name, hashed)
    )
    user_id = cur.fetchone()[0]

    cur.execute(
        "INSERT INTO accounts (user_id, balance) VALUES (%s, %s)",
        (user_id, 0)
    )

    conn.commit()
    cur.close()
    conn.close()
    return user_id
    # print(f"User created with ID: {user_id}")


#  Login
def login(user_id, pin):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT pin_hash FROM users WHERE user_id = %s", (user_id,))
    result = cur.fetchone()

    cur.close()
    conn.close()

    if result and check_pin(pin, result[0]):
        return True
    return False


#  Get Account ID
def get_account_id(user_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT account_id FROM accounts WHERE user_id = %s", (user_id,))
    account_id = cur.fetchone()[0]

    cur.close()
    conn.close()

    return account_id


#  Check Balance
def get_balance(account_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT balance FROM accounts WHERE account_id = %s", (account_id,))
    balance = cur.fetchone()[0]

    cur.close()
    conn.close()

    return balance


# 🔹 Deposit
def deposit(account_id, amount):
    conn = get_connection()
    cur = conn.cursor()

    try:
        conn.autocommit = False

        cur.execute(
            "UPDATE accounts SET balance = balance + %s WHERE account_id = %s",
            (amount, account_id)
        )

        cur.execute(
            "INSERT INTO transactions (account_id, txn_type, amount) VALUES (%s, %s, %s)",
            (account_id, "deposit", amount)
        )

        conn.commit()
        return {"message": "Deposit successful"} 

    except Exception as e:
        conn.rollback()
        print("Error:", e)

    finally:
        cur.close()
        conn.close()


#  Withdraw
def withdraw(account_id, amount):
    conn = get_connection()
    cur = conn.cursor()

    # 🔹 Get balance
    cur.execute("SELECT balance FROM accounts WHERE account_id = %s", (account_id,))
    balance = cur.fetchone()[0]

    # ❌ Check insufficient balance
    if amount > balance:
        conn.close()
        return {"error": "Insufficient balance"}

    # ✅ Update balance
    new_balance = balance - amount

    cur.execute(
        "UPDATE accounts SET balance = %s WHERE account_id = %s",
        (new_balance, account_id)
    )

    # 🔥 ADD THIS (VERY IMPORTANT)
    cur.execute(
        "INSERT INTO transactions (account_id,txn_type, amount) VALUES (%s, %s, %s)",
        (account_id, "withdraw", amount)
    )

    conn.commit()
    conn.close()

    return {"message": "Withdrawal successful"}


# 🔹 Transaction History
def get_transactions(account_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT txn_type, amount, created_at FROM transactions WHERE account_id = %s ORDER BY created_at DESC",
        (account_id,)
    )

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows
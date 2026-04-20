from services import *

def main():
    print("=== ATM SYSTEM ===")

    while True:
        print("\n1. Create User")
        print("2. Login")
        print("3. Exit")

        choice = input("Choose: ")

        if choice == "1":
            name = input("Enter name: ")
            pin = input("Set PIN: ")
            create_user(name, pin)

        elif choice == "2":
            try:
                user_id = int(input("Enter User ID: "))
            except ValueError:
                print("Invalid User ID (must be number)")
                continue
            pin = input("Enter PIN: ")

            if not login(user_id, pin):
                print("Invalid credentials")
                continue
            account_id = get_account_id(user_id)

            while True:
                print("\n1. Check Balance")
                print("2. Deposit")
                print("3. Withdraw")
                print("4. Transactions")
                print("5. Logout")

                opt = input("Select: ")

                if opt == "1":
                    print("Balance:", get_balance(account_id))

                elif opt == "2":
                    amt = float(input("Amount: "))
                    deposit(account_id, amt)

                elif opt == "3":
                    amt = float(input("Amount: "))
                    withdraw(account_id, amt)

                elif opt == "4":
                    txns = get_transactions(account_id)
                    for t in txns:
                        print(t)

                elif opt == "5":
                    break

        elif choice == "3":
            print("Thank You Visit Again")
            break


if __name__ == "__main__":
    main()
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services import *

app = FastAPI()

#  Request Models
class UserCreate(BaseModel):
    name: str
    pin: str

class LoginRequest(BaseModel):
    user_id: int
    pin: str

class TransactionRequest(BaseModel):
    account_id: int
    amount: int


class CreateUserRequest(BaseModel):
    name: str
    pin: str

#  Create User
@app.post("/create_user")
def create_user(data: CreateUserRequest):
    user_id = create_user_service(data.name, data.pin)
    return {"account_id": user_id}

#  Login
@app.post("/login")
def login_api(data: LoginRequest):
    if not login(data.user_id, data.pin):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    account_id = get_account_id(data.user_id)
    return {"message": "Login successful", "account_id": account_id}


# 💰 Balance
@app.get("/balance/{account_id}")
def balance_api(account_id: int):
    balance = get_balance(account_id)
    return {"balance": float(balance)}


#  Deposit
@app.post("/deposit")
def deposit_api(data: TransactionRequest):
    deposit(data.account_id, data.amount)
    return {"message": "Deposit successful"}


#  Withdraw
@app.post("/withdraw")
def withdraw_money(data: TransactionRequest):
    result = withdraw(data.account_id, data.amount)

    if result.get("error"):
        return {"error": result["error"]}

    return {"message": "Withdrawal successful"}

#  Transactions
@app.get("/transactions/{account_id}")
def get_transactions(account_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT txn_type, amount, created_at FROM transactions WHERE account_id = %s ORDER BY created_at DESC",
        (account_id,)
    )

    data = cur.fetchall()
    conn.close()

    return {
    "transactions": [
        {
            "type": row[0],
            "amount": row[1],
            "time": row[2].strftime("%Y-%m-%d %H:%M:%S")
        }
        for row in data
    ]
}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
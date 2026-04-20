CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    pin_hash TEXT NOT NULL
);

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    balance NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE transactions (
    txn_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(account_id),
    txn_type VARCHAR(20),
    amount NUMERIC(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
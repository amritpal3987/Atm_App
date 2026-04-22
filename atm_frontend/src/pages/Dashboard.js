// State → Top
//Functions → Middle
//UI → Return (Bottom)


import { useEffect, useState } from "react";
import { useCallback } from "react";
import { getBalance, depositMoney, withdrawMoney, getTransactions } from "../services/api";


function Dashboard({ accountId, setAccountId }) {
    console.log("DASHBOARD LOADED");
    //  STATE (store data)
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(0);
    const [transactions, setTransactions] = useState([]);
    // loading and error 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // for depositing and withdrawal success message display
    const [success, setSuccess] = useState("");
    // fetching the balance
    const fetchBalance = useCallback(async () => {
        if (!accountId) return;

        const data = await getBalance(accountId);
        setBalance(data.balance);
    }, [accountId]);
    // fetching the transactions
    const fetchTransactions = useCallback(async () => {
        if (!accountId) return;

        try {
            const data = await getTransactions(accountId);
            setTransactions(data.transactions || []);
        } catch (e) {
            console.error(e);
            setTransactions([]);
        }
    }, [accountId]);

    //  LOAD DATA WHEN PAGE OPENS
    useEffect(() => {
        fetchBalance();
        fetchTransactions();
    }, [fetchBalance, fetchTransactions]);

    // 🔹 DEPOSIT BUTTON FUNCTION
    const handleDeposit = async () => {
        //  VALIDATION
        if (!amount || amount <= 0) {
            setError("Enter valid amount");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const res = await depositMoney(accountId, amount);
            setSuccess(res.message || "Deposits Successful");
            setTimeout(() => {
                setSuccess("");
            }, 2000); // shows for 2 seconds
            setTimeout(async () => {
                await fetchBalance();
                await fetchTransactions();
            }, 500);

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    //  WITHDRAW BUTTON FUNCTION
    const handleWithdraw = async () => {
        //  VALIDATION
        if (!amount || amount <= 0) {
            setError("Enter valid amount");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const res = await withdrawMoney(accountId, amount);
            setSuccess(res.message || "withdrawal successful");
            setTimeout(() => {
                setSuccess("");
            }, 2000); // shows for 2 seconds
            setTimeout(async () => {
                await fetchBalance();
                await fetchTransactions();
            }, 500);

        } catch (e) {
            setError(e.message || "Withdrawal failed 🫠");  // shows "Insufficient balance"
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{
            background: "#0f172a",
            minHeight: "100vh",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>

            <div style={{
                background: "#1e293b",
                padding: "25px",
                borderRadius: "15px",
                width: "350px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)"
            }}>

                <h2 style={{ textAlign: "center" }}>🏧 ATM Dashboard</h2>
                {/*  ADD ERROR HERE */}
                {error && (
                    <p style={{ color: "red", textAlign: "center" }}>
                        {error}
                    </p>
                )}

                {success && (
                    <p style={{ color: "lightgreen", textAlign: "center" }}>
                        {success}
                    </p>
                )}

                <h3 style={{ textAlign: "center", color: "#38bdf8" }}>
                    ₹{balance}
                </h3>

                {/* INPUT */}
                <input
                    type="number"
                    placeholder="Enter amount"
                    onChange={(e) => {
                        setAmount(Number(e.target.value));
                        setError("");
                        // setSuccess(""); //on typing it clear the message shown of success
                    }}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "8px",
                        border: "none"
                    }}
                />
                {/*  LOADING MESSAGE */}
                {loading && (
                    <p style={{ textAlign: "center" }}>
                        Processing...
                    </p>
                )}

                {/* BUTTONS */}
                <div style={{ display: "flex", marginTop: "10px" }}>
                    <button
                        onClick={handleDeposit}
                        style={{
                            flex: 1,
                            marginRight: "5px",
                            padding: "10px",
                            background: "#22c55e",
                            border: "none",
                            borderRadius: "8px",
                            color: "white"
                        }}
                        disabled={loading}//add this for loading
                    >
                        Deposit
                    </button>

                    <button
                        onClick={handleWithdraw}
                        style={{
                            flex: 1,
                            padding: "10px",
                            background: "#ef4444",
                            border: "none",
                            borderRadius: "8px",
                            color: "white"
                        }}
                        disabled={loading} //add this for loading
                    >
                        Withdraw
                    </button>
                </div>

                {/* TRANSACTIONS */}
                <h3 style={{ marginTop: "20px" }}>Transactions</h3>

                <div style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    fontSize: "14px"
                }}>
                    {transactions.map((t, i) => (
                        <li key={i}>
                            {t.type === "deposit" ? "Deposit" : " Withdraw"} - ₹{t.amount}
                            <br />
                            <small>
                                {new Date(t.time).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short"
                                })}
                            </small>
                        </li>
                    ))}
                </div>

                {/* LOGOUT */}
                <button
                    onClick={() => setAccountId(null)}
                    style={{
                        width: "100%",
                        marginTop: "15px",
                        padding: "10px",
                        background: "#f59e0b",
                        border: "none",
                        borderRadius: "8px",
                        color: "white"
                    }}
                >
                    Logout
                </button>

            </div>
        </div>
    );
}
export default Dashboard;
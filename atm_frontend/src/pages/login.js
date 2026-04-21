import { useState } from "react";
import { loginUser, createUser } from "../services/api";

function Login({ setAccountId }) {
    const [accountId, setAccountIdInput] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!accountId || !pin) {
            setError("Enter all details");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await loginUser(accountId, pin);

            setAccountId(res.account_id);

        } catch (e) {
            setError("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        try {
            const name = prompt("Enter your name");
            const pinInput = prompt("Enter PIN");

            if (!name || !pinInput) {
                alert("All fields required");
                return;
            }

            const res = await createUser(name, pinInput);

            alert(`Account created! Your ID is: ${res.account_id}`);

        } catch (e) {
            alert("Error creating account");
        }
    };

    return (
        <div style={{
            background: "#0f172a",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Arial"
        }}>

            <div style={{
                background: "#1e293b",
                padding: "30px",
                borderRadius: "15px",
                width: "350px",
                boxShadow: "0 0 25px rgba(0,0,0,0.6)",
                color: "white"
            }}>

                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    🏧 ATM Login
                </h2>

                {error && (
                    <p style={{ color: "#ef4444", textAlign: "center" }}>
                        {error}
                    </p>
                )}

                <input
                    type="number"
                    placeholder="Enter Account ID"
                    value={accountId}
                    onChange={(e) => setAccountIdInput(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        border: "none"
                    }}
                />

                <input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "none"
                    }}
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: "#22c55e",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <button
                    onClick={handleCreateUser}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "10px",
                        background: "#3b82f6",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        cursor: "pointer"
                    }}
                >
                    Create New Account
                </button>

            </div>
        </div>
    );
}

export default Login;
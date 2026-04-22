const BASE_URL = process.env.REACT_APP_BASE_URL;

// LOGIN
export const loginUser = async (user_id, pin) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, pin })
  });
  return res.json();
};

// BALANCE
export const getBalance = async (account_id) => {
  const res = await fetch(`${BASE_URL}/balance/${account_id}`);
  return res.json();
};

// DEPOSIT
export const depositMoney = async (account_id, amount) => {
  const res = await fetch(`${BASE_URL}/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_id, amount })
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Deposit failed");
  }

  return data;
};


//  ADD THIS (Withdraw)
export const withdrawMoney = async (account_id, amount) => {
  const res = await fetch(`${BASE_URL}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_id, amount })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail);  // important
  }

  return data;
};

//  ADD THIS (Transactions)
export const getTransactions = async (account_id) => {
  const res = await fetch(`${BASE_URL}/transactions/${account_id}`);
  return res.json();
};
// for creating new user 
export const createUser = async (name, pin) => {
  const res = await fetch(`${BASE_URL}/create_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      pin: pin,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create user");
  }

  return res.json();
};
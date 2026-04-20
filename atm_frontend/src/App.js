import { useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard.js";

function App() {
  const [accountId, setAccountId] = useState(null);

  return (
    <div>
      {!accountId ? (
        <Login setAccountId={setAccountId} />
      ) : (
        <Dashboard accountId={accountId}
                   setAccountId={setAccountId} />
      )}
    </div>
  );
}

export default App;
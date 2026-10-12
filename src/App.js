
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const token = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (!token || !savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return null;
    }
  });

  function handleLoginSuccess(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
    setLoggedInUser(user);
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setLoggedInUser(null);
    setPage("login");
  }

  if (loggedInUser) {
    return (
      <Dashboard
        user={loggedInUser}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onShowLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Login
      onShowRegister={() => setPage("register")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default App;
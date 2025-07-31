import React, { useState } from "react";
import "./App.css";
import LoginPage from "./LoginPage";
import MainApp from "./MainApp";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={(user) => setUser(user)} />;
  }

  return <MainApp user={user} />;
}

export default App;

import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/admin`, {
        username,
        password
      });

      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/admin";

    } catch {
      alert("Login gagal");
    }
  };

  return (
    <div style={{padding:50}}>
      <h2>Login Admin</h2>
      <form onSubmit={login}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />
        <br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <br/>
        <button>Login</button>
      </form>
    </div>
  );
}
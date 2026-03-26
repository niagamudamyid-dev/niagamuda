import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "../styles/login-admin.css";

export default function Login() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [showPass, setShowPass] = useState(false);
const [error, setError] = useState("");

const login = async (e) => {
e.preventDefault();

if (loading) return;

setLoading(true);
setError("");

try {

const res = await axios.post(`${API_URL}/api/admin`, {
username,
password
});

localStorage.setItem("adminToken", res.data.token);
window.location.href = "/cms-portal-2026";

} catch {

setError("Username atau password salah");

}

setLoading(false);
};

return (

<div className="loginX-page">

<div className="loginX-card">

<h2>Admin Login</h2>
<p className="loginX-sub">Masuk ke dashboard admin</p>

{error && <div className="loginX-error">{error}</div>}

<form onSubmit={login} className="loginX-form">

<input
className="loginX-input"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
required
/>

<div className="loginX-password">

<input
type={showPass ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<span
onClick={()=>setShowPass(!showPass)}
className="loginX-eye"
>
{showPass ? "🙈" : "👁️"}
</span>

</div>

<button
className={`loginX-btn ${loading ? "loading" : ""}`}
disabled={loading}
>
{loading ? "Loading..." : "Login"}
</button>

</form>

</div>

</div>

);

}
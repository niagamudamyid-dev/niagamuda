import { useState } from "react";
import Admin from "../pages/Admin";

export default function AdminGuard() {

  const [authorized, setAuthorized] = useState(
    localStorage.getItem("admin-auth") === "true"
  );

  if (!authorized) {
    const key = prompt("Enter Admin Key:");

    if (key === import.meta.env.VITE_ADMIN_KEY) {
      localStorage.setItem("admin-auth", "true");
      setAuthorized(true);
    } else {
      return <h2 style={{padding:"50px"}}>Unauthorized</h2>;
    }
  }

  return <Admin />;
}
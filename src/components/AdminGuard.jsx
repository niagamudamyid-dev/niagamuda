import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setValid(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${API_URL}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setValid(true);
      } catch {
        localStorage.removeItem("adminToken");
        setValid(false);
      }

      setLoading(false);
    };

    verify();
  }, []);

  if (loading) return null;

  if (!valid) return <Navigate to="/login" />;

  return children;
}
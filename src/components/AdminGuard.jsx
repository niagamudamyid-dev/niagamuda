import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function AdminGuard({ children }) {

  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await axios.get(`${API_URL}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIsValid(true);
      } catch {
        localStorage.removeItem("adminToken");
        setIsValid(false);
      }

      setLoading(false);
    };

    verifyToken();
  }, []);

  if (loading) return null;

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
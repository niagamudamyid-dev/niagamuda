import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminGuard from "./components/AdminGuard";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>

      <nav className="navbar">
        <Link to="/" className="logo">Niagamuda</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ADMIN PAGE */}
        <Route
          path="/cms-portal-2026"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}
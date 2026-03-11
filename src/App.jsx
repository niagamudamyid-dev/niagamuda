import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminGuard from "./components/AdminGuard";

export default function App() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BrowserRouter>

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="nav-container">

          <Link to="/" className="logo">
            Niagamuda
          </Link>

          <div className={`nav-links ${menuOpen ? "active" : ""}`}>

            <Link to="/">Home</Link>
            <Link to="/books">Buku</Link>
            <Link to="/kategori">Kategori</Link>
            <Link to="/terbaru">Terbaru</Link>
            <Link to="/tentang">Tentang</Link>

            <Link to="/login" className="login-btn">
              Login
            </Link>

          </div>

          <div
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>

        </div>

      </nav>


      {/* ROUTES */}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

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
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminGuard from "./components/AdminGuard";

export default function App() {

  const [open,setOpen] = useState(false);

  return (
    <BrowserRouter>

      <nav className="navbar">

        <div className="nav-container">

          {/* LEFT */}
          <div className="nav-left">

            <div
              className="hamburger"
              onClick={()=>setOpen(!open)}
            >
              ☰
            </div>

            <Link to="/" className="logo">
              Niagamuda
            </Link>

            <Link to="/kategori" className="kategori-btn">
              Kategori
            </Link>

          </div>


          {/* SEARCH */}
          <div className="search-box">

            <input
              type="text"
              placeholder="Cari ebook..."
            />

          </div>


          {/* RIGHT */}
          <div className="nav-right">

            <Link to="/">Home</Link>
            <Link to="/books">Buku</Link>
            <Link to="/terbaru">Terbaru</Link>
            <Link to="/tentang">Tentang</Link>

            <Link to="/login" className="login-btn">
              Login
            </Link>

          </div>

        </div>

      </nav>


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
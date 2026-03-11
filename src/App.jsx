import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminGuard from "./components/AdminGuard";

export default function App() {

  const [menu,setMenu] = useState(false);

  return (
    <BrowserRouter>

      <nav className="navbar">

        <div className="nav-inner">

          {/* LEFT */}
          <div className="nav-left">

            <button
              className="hamburger"
              onClick={()=>setMenu(!menu)}
            >
              ☰
            </button>

            <Link to="/" className="logo">
              Niagamuda
            </Link>

            <Link to="/kategori" className="kategori">
              Kategori
            </Link>

          </div>


          {/* SEARCH */}
          <div className="nav-search">

            <input
              type="text"
              placeholder="Cari ebook..."
            />

          </div>


          {/* RIGHT */}
          <div className={`nav-right ${menu ? "show" : ""}`}>

            <Link to="/">Home</Link>
            <Link to="/books">Buku</Link>
            <Link to="/terbaru">Terbaru</Link>
            <Link to="/tentang">Tentang</Link>

            <Link to="/login" className="login">
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
              <Admin/>
            </AdminGuard>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}
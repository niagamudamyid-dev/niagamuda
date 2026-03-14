import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminGuard from "./components/AdminGuard";
import Footer from "./components/Footer";
import "./App.css";
import Category from "./pages/Category"


export default function App() {
  return (
    <BrowserRouter>

      <nav className="navbar">

        <div className="nav-left">
          <Link to="/" className="logo">Niagamuda</Link>

          <Link to="/kategori" className="kategori">
            Kategori
          </Link>
        </div>

        <div className="nav-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Cari ebook..." />
        </div>

        <div className="nav-right">
          <Link to="/">Home</Link>
          <Link to="/books">Buku</Link>
          <Link to="/terbaru">Terbaru</Link>
          <Link to="/tentang">Tentang</Link>

          <Link to="/login" className="login">
            Login
          </Link>
        </div>

      </nav>

      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/books" element={<AdminBooks />} />
        <Route path="/admin/add-book" element={<AdminAddBook />} />

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/kategori/:name" element={<Category/>}/>

        <Route
          path="/cms-portal-2026"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}
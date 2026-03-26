import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Category from "./pages/Category";

import Admin from "./pages/Admin";
import AdminBooks from "./pages/AdminBooks";
import AdminAddBook from "./pages/AdminAddBook";

import AdminGuard from "./components/AdminGuard";
import Footer from "./components/Footer";
import AdminCategory from "./pages/AdminCategory"

import BookDetail from "./pages/BookDetail"
import "./App.css";

import { useState } from "react";

function Layout(){

const location = useLocation()
const [search,setSearch] = useState("")

/* DETEKSI ADMIN PAGE */

const isAdmin =
location.pathname.startsWith("/admin") ||
location.pathname.startsWith("/cms-portal-2026")

/* 🔥 HANDLE SEARCH */
const handleSearch = (e)=>{
if(e.key === "Enter"){
if(!search.trim()) return
window.location.href = `/kategori/${search.toLowerCase()}`
}
}


return(

<>

{/* NAVBAR HANYA WEBSITE */}

{!isAdmin && (

<nav className="navbar">

<div className="nav-left">

<Link to="/" className="logo">
Niagamuda
</Link>

</div>

{/* 🔥 SEARCH UPGRADE */}
<div className="nav-search">
<span className="search-icon">🔍</span>
<input
placeholder="Cari ebook..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
onKeyDown={handleSearch}
/>
</div>

<div className="nav-right">

<Link to="/">Home</Link>
<Link to="/books">Buku</Link>
<Link to="/terbaru">Terbaru</Link>
<Link to="/tentang">Tentang</Link>

</div>

</nav>

)}

<Routes>

{/* WEBSITE */}

<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/kategori/:name" element={<Category />} />
<Route path="/book/:id" element={<BookDetail />} />
{/* ADMIN */}

<Route
path="/cms-portal-2026"
element={
<AdminGuard>
<Admin/>
</AdminGuard>
}
/>

<Route
path="/admin/books"
element={
<AdminGuard>
<AdminBooks/>
</AdminGuard>
}
/>

<Route
path="/admin/add-book"
element={
<AdminGuard>
<AdminAddBook/>
</AdminGuard>
}
/>
<Route path="/admin/category" element={<AdminCategory />} />
</Routes>

{/* FOOTER HANYA WEBSITE */}

{!isAdmin && <Footer/>}

</>

)

}

export default function App(){

return(

<BrowserRouter>
<Layout/>
</BrowserRouter>

)

}

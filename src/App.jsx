import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Category from "./pages/Category";
import Admin from "./pages/Admin";
import AdminBooks from "./pages/AdminBooks";
import AdminAddBook from "./pages/AdminAddBook";
import AdminGuard from "./components/AdminGuard";
import Footer from "./components/Footer";
import AdminCategory from "./pages/AdminCategory";
import BookDetail from "./pages/BookDetail";
import Tentang from "./pages/Tentang";

import "./App.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config";

function Layout(){

const [search,setSearch] = useState("")
const [books,setBooks] = useState([])
const [categories,setCategories] = useState([])

/* 🔥 FIX location */
const location = window.location

const isAdmin =
location.pathname.startsWith("/admin") ||
location.pathname.startsWith("/cms-portal-2026")

useEffect(()=>{
axios.get(`${API_URL}/api/books`)
.then(res=>setBooks(res.data))

axios.get(`${API_URL}/api/categories`)
.then(res=>setCategories(res.data))
},[])

/* 🔥 SEARCH IMPROVED */
const handleSearch = (e)=>{
if(e.key === "Enter"){

const keyword = search.toLowerCase()

const results = books.filter(
b =>
b.title.toLowerCase().includes(keyword) ||
b.author?.toLowerCase().includes(keyword)
)

if(results.length > 0){
window.location.href = `/book/${results[0]._id}`
}else{
alert("Buku tidak ditemukan")
}
}
}

const parentCategories = categories.filter(c=>!c.parent)

const latestBooks = [...books]
.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
.slice(0,8)

return(
<>

{!isAdmin && (

<nav className="navbar">

<div className="nav-left">
<Link to="/" className="logo">Niagamuda</Link>
</div>

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

<div className="nav-dropdown">
<span>Buku ▾</span>
<div className="dropdown-menu">
{parentCategories.map(cat=>(
<Link key={cat.slug} to={`/kategori/${cat.slug}`}>
{cat.name}
</Link>
))}
</div>
</div>

<div className="nav-dropdown">
<span>Terbaru ▾</span>
<div className="dropdown-menu">
{latestBooks.map(book=>(
<Link key={book._id} to={`/book/${book._id}`}>
{book.title}
</Link>
))}
</div>
</div>

<Link to="/tentang">Tentang</Link>

</div>

</nav>

)}

<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/kategori/:name" element={<Category />} />
<Route path="/book/:slug" element={<BookDetail />} />
<Route path="/tentang" element={<Tentang/>} />

<Route path="/cms-portal-2026" element={<AdminGuard><Admin/></AdminGuard>} />
<Route path="/admin/books" element={<AdminGuard><AdminBooks/></AdminGuard>} />
<Route path="/admin/add-book" element={<AdminGuard><AdminAddBook/></AdminGuard>} />
<Route path="/admin/category" element={<AdminCategory />} />
</Routes>

{!isAdmin && <Footer/>}

</>
)
}

export default function App(){
return(
<HelmetProvider>
<BrowserRouter>
<Layout/>
</BrowserRouter>
</HelmetProvider>
)
}
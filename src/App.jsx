import { BrowserRouter, Routes, Route, Link} from "react-router-dom";

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

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config";
import Tentang from "./pages/Tentang";


function Layout(){

const [search,setSearch] = useState("")
const [books,setBooks] = useState([])
const [categories,setCategories] = useState([])

/* DETEKSI ADMIN PAGE */

const isAdmin =
location.pathname.startsWith("/admin") ||
location.pathname.startsWith("/cms-portal-2026")

/* FETCH DATA */
useEffect(()=>{
axios.get(`${API_URL}/api/books`)
.then(res=>setBooks(res.data))

axios.get(`${API_URL}/api/categories`)
.then(res=>setCategories(res.data))
},[])

/* 🔥 SEARCH REAL */
const handleSearch = (e)=>{
if(e.key === "Enter"){

const keyword = search.toLowerCase()

const found = books.find(
b =>
b.title.toLowerCase().includes(keyword) ||
b.author?.toLowerCase().includes(keyword)
)

if(found){
window.location.href = `/book/${found._id}`
}else{
alert("Buku tidak ditemukan")
}
}
}

/* 🔥 CATEGORY */
const parentCategories = categories.filter(c=>!c.parent)

/* 🔥 BUKU TERBARU */
const latestBooks = [...books]
.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
.slice(0,8)


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
{/* 🔥 DROPDOWN BUKU */}
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

{/* 🔥 DROPDOWN TERBARU */}
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

{/* WEBSITE */}

<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/kategori/:name" element={<Category />} />
<Route path="/book/:id" element={<BookDetail />} />
<Route path="/tentang" element={<Tentang/>} />
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

import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { API_URL } from "../config";
import "./home.css";

export default function Home() {

  const [books,setBooks]=useState([])

  const categories=[
    "Novel",
    "Bisnis",
    "Self Improvement",
    "Teknologi",
    "Komik"
  ]

  useEffect(()=>{

    axios.get(`${API_URL}/api/books`)
    .then(res=>setBooks(res.data))

  },[])

  return(

<div className="home">

<section className="hero">

<div className="hero-left">

<p className="hero-sub">
SELAMAT DATANG DI NIAGAMUDA
</p>

<h1>
Diskon <span>50%</span>
<br/>
Semua Ebook
</h1>

<p className="hero-desc">
Temukan berbagai ebook murah dan terpercaya.
</p>

<a href="#books" className="hero-btn">
Lihat Ebook
</a>

</div>

<div className="hero-right">

<img
src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
/>

</div>

</section>


{categories.map(cat=>{

const filtered=books
.filter(b=>b.category===cat)
.slice(0,10)

if(filtered.length===0)return null

return(

<section className="category-section" key={cat}>

<div className="category-header">

<h2>{cat}</h2>

<a href={`/kategori/${cat}`}>
Lihat Semua
</a>

</div>

<div className="scroll-books">

{filtered.map(book=>(
<BookCard key={book._id} book={book}/>
))}

</div>

</section>

)

})}

</div>

)

}

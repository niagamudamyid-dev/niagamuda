import { useParams } from "react-router-dom"
import { useEffect,useState } from "react"
import axios from "axios"
import { Helmet } from "react-helmet-async"
import { API_URL } from "../config"
import "../styles/book-detail.css"

export default function BookDetail(){

const {slug} = useParams()

// 🔥 AMBIL ID DARI AKHIR URL
const id = slug.split("-").pop()

const [book,setBook] = useState(null)

useEffect(()=>{
axios.get(`${API_URL}/api/books?id=${id}`)
.then(res=>setBook(res.data))
},[id])

if(!book) return <div className="bookDetail-loading">Loading...</div>

return(

<div className="bookDetail-page">

<Helmet>
<title>{book.title} | Niagamuda</title>

<meta name="description" content={book.description?.slice(0,150)} />

<meta property="og:title" content={book.title} />
<meta property="og:description" content={book.description} />
<meta property="og:image" content={book.image} />

<meta name="twitter:card" content="summary_large_image" />
</Helmet>

{/* 🔥 STRUCTURED DATA */}
<script type="application/ld+json">
{JSON.stringify({
"@context":"https://schema.org",
"@type":"Book",
"name": book.title,
"author": book.author,
"description": book.description,
"image": book.image,
"offers": {
"@type":"Offer",
"price": book.price,
"priceCurrency":"IDR"
}
})}
</script>

<div className="bookDetail-container">

<div className="bookDetail-left">
<img
src={book.image}
alt={book.title}
className="bookDetail-image"
loading="lazy"
/>
</div>

<div className="bookDetail-right">

<div className="bookDetail-badge">
{book.category}
</div>

<h1 className="bookDetail-title">
{book.title}
</h1>

<p className="bookDetail-author">
oleh {book.author || "-"}
</p>

<div className="bookDetail-price">
Rp {Number(book.price).toLocaleString()}
</div>

<div className="bookDetail-stock">
Stok tersedia: <b>{book.stock || 0}</b>
</div>

<a
href={book.shopeeLink}
target="_blank"
rel="noreferrer"
className="bookDetail-buy"
>
Beli di Shopee
</a>

</div>

</div>

<div className="bookDetail-descBox">
<h2>Deskripsi Buku</h2>
<p>{book.description || "Tidak ada deskripsi"}</p>
</div>

<div className="bookDetail-specs">

<div className="spec-item">
<span>Penulis</span>
<p>{book.author}</p>
</div>

<div className="spec-item">
<span>ISBN</span>
<p>{book.isbn}</p>
</div>

<div className="spec-item">
<span>Penerbit</span>
<p>{book.publisher}</p>
</div>

<div className="spec-item">
<span>Tanggal Terbit</span>
<p>{book.publishDate}</p>
</div>

<div className="spec-item">
<span>Jumlah Halaman</span>
<p>{book.pages}</p>
</div>

<div className="spec-item">
<span>Berat</span>
<p>{book.weight}</p>
</div>

<div className="spec-item">
<span>Jenis Cover</span>
<p>{book.coverType}</p>
</div>

<div className="spec-item">
<span>Dimensi</span>
<p>{book.dimension}</p>
</div>

<div className="spec-item">
<span>Bahasa</span>
<p>{book.language}</p>
</div>

<div className="spec-item">
<span>Bonus</span>
<p>{book.bonus}</p>
</div>

</div>

</div>

)

}
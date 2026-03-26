import { useParams } from "react-router-dom"
import { useEffect,useState } from "react"
import axios from "axios"
import { API_URL } from "../config"

export default function BookDetail(){

const {id}=useParams()
const [book,setBook]=useState(null)

useEffect(()=>{
axios.get(`${API_URL}/api/books`)
.then(res=>{
const found=res.data.find(b=>b._id===id)
setBook(found)
})
},[id])

if(!book) return <p>Loading...</p>

return(
<div className="book-detail">

<img src={book.image}/>

<h1>{book.title}</h1>
<p>{book.description}</p>

<ul>
<li>Penulis: {book.author}</li>
<li>ISBN: {book.isbn}</li>
<li>Penerbit: {book.publisher}</li>
<li>Tanggal: {book.publishDate}</li>
<li>Halaman: {book.pages}</li>
<li>Berat: {book.weight}</li>
<li>Cover: {book.coverType}</li>
<li>Dimensi: {book.dimension}</li>
<li>Bahasa: {book.language}</li>
<li>Stok: {book.stock}</li>
</ul>

<a href={book.shopeeLink} target="_blank">
<button>Beli di Shopee</button>
</a>

</div>
)
}
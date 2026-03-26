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
setBook(res.data.find(b=>b._id===id))
})
},[id])

if(!book) return <p>Loading...</p>

return(
<div style={{padding:30}}>

<img src={book.image} style={{width:200}}/>

<h1>{book.title}</h1>

<p>{book.description}</p>

<hr/>

<p><b>Penulis:</b> {book.author}</p>
<p><b>ISBN:</b> {book.isbn}</p>
<p><b>Penerbit:</b> {book.publisher}</p>
<p><b>Halaman:</b> {book.pages}</p>
<p><b>Bahasa:</b> {book.language}</p>
<p><b>Stok:</b> {book.stock}</p>

<br/>

<a href={book.shopeeLink} target="_blank">
<button style={{
padding:12,
background:"#ee4d2d",
color:"white",
border:"none",
borderRadius:8
}}>
Beli di Shopee
</button>
</a>

</div>
)
}
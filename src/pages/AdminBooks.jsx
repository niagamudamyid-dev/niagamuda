import { useEffect,useState } from "react"
import axios from "axios"
import { API_URL } from "../config"
import AdminLayout from "../components/AdminLayout"

export default function AdminBooks(){

const [books,setBooks] = useState([])

const adminConfig={
headers:{
Authorization:`Bearer ${localStorage.getItem("adminToken")}`
}
}

const fetchBooks = async()=>{

const res = await axios.get(`${API_URL}/api/books`)
setBooks(res.data)

}

useEffect(()=>{
// eslint-disable-next-line react-hooks/set-state-in-effect
fetchBooks()
},[])

const deleteBook = async(id)=>{

await axios.delete(
`${API_URL}/api/books?id=${id}`,
adminConfig
)

fetchBooks()

}

return(

<AdminLayout>

<div className="card">

<h2>Daftar Buku</h2>

<div className="table">

{books.map(book=>(

<div key={book._id} className="row">

<img src={book.image}/>

<div>

<div className="book-title">
{book.title}
</div>

<div className="book-price">
Rp {Number(book.price).toLocaleString()}
</div>

</div>

<div className="actions">

<button>Edit</button>

<button
className="danger"
onClick={()=>deleteBook(book._id)}
>
Delete
</button>

</div>

</div>

))}

</div>

</div>

</AdminLayout>

)

}

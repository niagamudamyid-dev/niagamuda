import { useEffect,useState,useCallback } from "react"
import axios from "axios"
import { API_URL } from "../config"
import "./admin.css"


export default function Admin(){

const [books,setBooks]=useState([])
const [categories,setCategories]=useState([])

const [title,setTitle]=useState("")
const [price,setPrice]=useState("")
const [category,setCategory]=useState("")
const [subcategory,setSubcategory]=useState("")

const [image,setImage]=useState(null)
const [preview,setPreview]=useState(null)

const [loading,setLoading]=useState(false)

const adminConfig={
headers:{
Authorization:`Bearer ${localStorage.getItem("adminToken")}`
}
}

/* FETCH BOOKS */



const fetchBooks = useCallback(async () => {
  const res = await axios.get(`${API_URL}/api/books`)
  setBooks(res.data)
}, [])


/* FETCH CATEGORY */


// eslint-disable-next-line no-unused-vars
const fetchCategories = async () => {
  const res = await axios.get(`${API_URL}/api/categories`)
  setCategories(res.data)
}


useEffect(() => {

const loadData = async () => {

const booksRes = await axios.get(`${API_URL}/api/books`)
setBooks(booksRes.data)

const catRes = await axios.get(`${API_URL}/api/categories`)
setCategories(catRes.data)

}

loadData()

}, [])




/* SUBMIT BOOK */

const submitBook=async(e)=>{

e.preventDefault()

if(loading) return

setLoading(true)

try{

const formData=new FormData()

formData.append("title",title)
formData.append("price",price)
formData.append("category",category)
formData.append("subcategory",subcategory)

if(image){
formData.append("image",image)
}

await axios.post(
`${API_URL}/api/books`,
formData,
adminConfig
)

setTitle("")
setPrice("")
setImage(null)
setPreview(null)

fetchBooks()

}catch(err){
console.log(err)
}

setLoading(false)

}

/* DELETE */

const deleteBook=async(id)=>{

await axios.delete(
`${API_URL}/api/books?id=${id}`,
adminConfig
)

fetchBooks()

}

return(

<div className="admin">

<aside className="sidebar">
<h2>Niagamuda</h2>

<button className="active">Dashboard</button>
<button>Kelola Buku</button>

</aside>

<main className="main">

<header className="topbar">

<h3>Admin Dashboard</h3>

<button
className="danger"
onClick={()=>{
localStorage.removeItem("adminToken")
window.location.href="/login"
}}
>
Logout
</button>

</header>

{/* STATS */}

<section className="stats">

<div className="stat-card">
<p>Total Buku</p>
<h2>{books.length}</h2>
</div>

<div className="stat-card">
<p>Status</p>
<h2>Online</h2>
</div>

</section>

{/* GRID */}

<div className="dashboard-grid">

{/* FORM */}

<div className="card">

<h2>Tambah Buku</h2>

<form
onSubmit={submitBook}
className="form-grid"
>

<label>Judul Buku</label>
<input
value={title}
onChange={e=>setTitle(e.target.value)}
required
/>

<label>Harga</label>
<input
type="number"
value={price}
onChange={e=>setPrice(e.target.value)}
required
/>

<label>Kategori</label>
<select
value={category}
onChange={e=>setCategory(e.target.value)}
>
<option value="">Pilih kategori</option>

{categories
.filter(c=>!c.parent)
.map(cat=>(
<option
key={cat.slug}
value={cat.slug}
>
{cat.name}
</option>
))}

</select>

<label>Subkategori</label>

<select
value={subcategory}
onChange={e=>setSubcategory(e.target.value)}
>

<option value="">Tidak ada</option>

{categories
.filter(c=>c.parent===category)
.map(cat=>(
<option
key={cat.slug}
value={cat.slug}
>
{cat.name}
</option>
))}

</select>

<label>Upload Cover</label>

<input
type="file"
onChange={e=>{
const file=e.target.files[0]
setImage(file)

if(file){
setPreview(URL.createObjectURL(file))
}
}}
/>

{preview && (
<img
src={preview}
className="preview"
/>
)}

<button
className="primary"
disabled={loading}
>
{loading ? "Uploading..." : "Tambah Buku"}
</button>

</form>

</div>

{/* BOOK LIST */}

<div className="card">

<h2>Daftar Buku</h2>

<div className="table">

{books.map(book=>(

<div
key={book._id}
className="row"
>

<img
src={book.image}
/>

<div>

<div className="book-title">
{book.title}
</div>

<div className="book-price">
Rp {Number(book.price).toLocaleString()}
</div>

<div>
{book.category}
</div>

</div>

<div className="actions">

<button>
Edit
</button>

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

</div>

</main>

</div>

)

}

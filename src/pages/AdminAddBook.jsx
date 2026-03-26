import { useState,useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"
import AdminLayout from "../components/AdminLayout"
import "../styles/admin-addbook.css"

export default function AdminAddBook(){

const [form,setForm] = useState({})
const [categories,setCategories] = useState([])
const [image,setImage] = useState(null)
const [preview,setPreview] = useState(null)
const [loading,setLoading] = useState(false)
const [toast,setToast] = useState("")

const adminConfig={
headers:{Authorization:`Bearer ${localStorage.getItem("adminToken")}`}
}

const showToast=(msg)=>{
setToast(msg)
setTimeout(()=>setToast(""),2500)
}

useEffect(()=>{
axios.get(`${API_URL}/api/categories`)
.then(res=>setCategories(res.data))
},[])

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const submitBook=async(e)=>{
e.preventDefault()
if(loading) return

setLoading(true)

try{
const formData=new FormData()

Object.keys(form).forEach(key=>{
formData.append(key,form[key])
})

if(image) formData.append("image",image)

await axios.post(`${API_URL}/api/books`,formData,adminConfig)

setForm({})
setImage(null)
setPreview(null)

showToast("Buku berhasil ditambahkan")

// eslint-disable-next-line no-unused-vars
}catch(err){
showToast("Gagal menambahkan buku")
}

setLoading(false)
}

return(
<AdminLayout>

<div className="adminAddBook-page">

{toast && <div className="admin-toast">{toast}</div>}

<div className="adminAddBook-card">

<h2>Tambah Buku</h2>

<form onSubmit={submitBook} className="adminAddBook-form">

<input name="title" placeholder="Judul" onChange={handleChange}/>
<input name="author" placeholder="Penulis" onChange={handleChange}/>
<input name="isbn" placeholder="ISBN" onChange={handleChange}/>
<input name="publisher" placeholder="Penerbit" onChange={handleChange}/>
<input name="publishDate" placeholder="Tanggal Terbit" onChange={handleChange}/>
<input name="pages" placeholder="Jumlah Halaman" onChange={handleChange}/>
<input name="weight" placeholder="Berat" onChange={handleChange}/>
<input name="coverType" placeholder="Jenis Cover" onChange={handleChange}/>
<input name="dimension" placeholder="Dimensi" onChange={handleChange}/>
<input name="bonus" placeholder="Bonus" onChange={handleChange}/>
<input name="language" placeholder="Bahasa" onChange={handleChange}/>
<input name="stock" type="number" placeholder="Stok" onChange={handleChange}/>
<input name="price" type="number" placeholder="Harga" onChange={handleChange}/>
<input name="shopeeLink" placeholder="Link Shopee" onChange={handleChange}/>

<textarea name="description" placeholder="Deskripsi" onChange={handleChange}/>

<select name="category" onChange={handleChange}>
<option value="">Kategori</option>
{categories.filter(c=>!c.parent).map(cat=>(
<option key={cat.slug} value={cat.slug}>{cat.name}</option>
))}
</select>

<select name="subcategory" onChange={handleChange}>
<option value="">Subkategori</option>
{categories.filter(c=>c.parent===form.category).map(cat=>(
<option key={cat.slug} value={cat.slug}>{cat.name}</option>
))}
</select>

<input type="file" onChange={(e)=>{
const file=e.target.files[0]
setImage(file)
if(file) setPreview(URL.createObjectURL(file))
}}/>

{preview && <img src={preview} className="adminAddBook-preview"/>}

<button disabled={loading}>
{loading ? "Uploading..." : "Tambah Buku"}
</button>

</form>

</div>
</div>

</AdminLayout>
)
}
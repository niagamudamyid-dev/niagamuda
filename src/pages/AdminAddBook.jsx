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

const [newCategory,setNewCategory]=useState("")
const [newSubCategory,setNewSubCategory]=useState("")

const adminConfig={
headers:{Authorization:`Bearer ${localStorage.getItem("adminToken")}`}
}

const showToast=(msg)=>{
setToast(msg)
setTimeout(()=>setToast(""),2500)
}

const loadCategories=()=>{
axios.get(`${API_URL}/api/categories`)
.then(res=>setCategories(res.data))
}

useEffect(()=>{
loadCategories()
},[])

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const createCategory=async()=>{
if(!newCategory) return

await axios.post(`${API_URL}/api/categories`,{
name:newCategory
},adminConfig)

setNewCategory("")
loadCategories()
showToast("Kategori ditambahkan")
}

const createSubCategory=async()=>{
if(!form.category) return showToast("Pilih kategori dulu")

await axios.post(`${API_URL}/api/categories`,{
name:newSubCategory,
parent:form.category
},adminConfig)

setNewSubCategory("")
loadCategories()
showToast("Subkategori ditambahkan")
}

const deleteCategory=async(slug)=>{
const cat=categories.find(c=>c.slug===slug)
if(!cat) return

if(confirm("Hapus kategori ini?")){
await axios.delete(`${API_URL}/api/categories?id=${cat._id}`,adminConfig)
loadCategories()
showToast("Kategori dihapus")
}
}

const submitBook=async(e)=>{
e.preventDefault()
if(loading) return

setLoading(true)

try{
const formData=new FormData()

for(let key in form){
if(form[key]){
formData.append(key,form[key])
}
}

if(image) formData.append("image",image)

await axios.post(`${API_URL}/api/books`,formData,adminConfig)

// 🔥 RESET FIX
setForm({})
setImage(null)
setPreview(null)

showToast("Buku berhasil ditambahkan")

}catch{
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

<input name="title" value={form.title||""} placeholder="Judul" onChange={handleChange}/>
<input name="author" value={form.author||""} placeholder="Penulis" onChange={handleChange}/>
<input name="isbn" value={form.isbn||""} placeholder="ISBN" onChange={handleChange}/>
<input name="publisher" value={form.publisher||""} placeholder="Penerbit" onChange={handleChange}/>
<input name="publishDate" value={form.publishDate||""} placeholder="Tanggal Terbit" onChange={handleChange}/>
<input name="pages" value={form.pages||""} placeholder="Jumlah Halaman" onChange={handleChange}/>
<input name="weight" value={form.weight||""} placeholder="Berat" onChange={handleChange}/>
<input name="coverType" value={form.coverType||""} placeholder="Jenis Cover" onChange={handleChange}/>
<input name="dimension" value={form.dimension||""} placeholder="Dimensi" onChange={handleChange}/>
<input name="bonus" value={form.bonus||""} placeholder="Bonus" onChange={handleChange}/>
<input name="language" value={form.language||""} placeholder="Bahasa" onChange={handleChange}/>
<input name="stock" type="number" value={form.stock||""} placeholder="Stok" onChange={handleChange}/>
<input name="price" type="number" value={form.price||""} placeholder="Harga" onChange={handleChange}/>
<input name="shopeeLink" value={form.shopeeLink||""} placeholder="Link Shopee" onChange={handleChange}/>

<textarea name="description" value={form.description||""} placeholder="Deskripsi" onChange={handleChange}/>

{/* CATEGORY */}
<select name="category" value={form.category||""} onChange={handleChange}>
<option value="">Kategori</option>
{categories.filter(c=>!c.parent).map(cat=>(
<option key={cat.slug} value={cat.slug}>{cat.name}</option>
))}
</select>

<div className="adminAddBook-catBox">
<input value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder="Kategori baru"/>
<button type="button" onClick={createCategory}>+</button>
<button type="button" onClick={()=>deleteCategory(form.category)}>🗑</button>
</div>

{/* SUB */}
<select name="subcategory" value={form.subcategory||""} onChange={handleChange}>
<option value="">Subkategori</option>
{categories.filter(c=>c.parent===form.category).map(cat=>(
<option key={cat.slug} value={cat.slug}>{cat.name}</option>
))}
</select>

<div className="adminAddBook-catBox">
<input value={newSubCategory} onChange={e=>setNewSubCategory(e.target.value)} placeholder="Subkategori baru"/>
<button type="button" onClick={createSubCategory}>+</button>
<button type="button" onClick={()=>deleteCategory(form.subcategory)}>🗑</button>
</div>

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
import { useState,useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"
import AdminLayout from "../components/AdminLayout"

export default function AdminAddBook(){

const [title,setTitle] = useState("")
const [price,setPrice] = useState("")
const [category,setCategory] = useState("")
const [subcategory,setSubcategory] = useState("")
const [categories,setCategories] = useState([])

const [image,setImage] = useState(null)
const [preview,setPreview] = useState(null)

const [loading,setLoading] = useState(false)

const [newCategory,setNewCategory] = useState("")
const [newSubCategory,setNewSubCategory] = useState("")

const adminConfig = {
headers:{
Authorization:`Bearer ${localStorage.getItem("adminToken")}`
}
}

const loadCategories = ()=>{

axios.get(`${API_URL}/api/categories`)
.then(res=>{
setCategories(res.data)
})

}

useEffect(()=>{

loadCategories()

},[])

/* ======================
CREATE CATEGORY
====================== */

const createCategory = async()=>{

try{

await axios.post(`${API_URL}/api/categories`,{
name:newCategory
},adminConfig)

alert("Kategori dibuat")

setNewCategory("")

loadCategories()

}catch(err){

console.log(err)

}

}

/* ======================
CREATE SUB CATEGORY
====================== */

const createSubCategory = async()=>{

if(!category){
alert("Pilih kategori utama dulu")
return
}

try{

await axios.post(`${API_URL}/api/categories`,{
name:newSubCategory,
parent:category
},adminConfig)

alert("Sub kategori dibuat")

setNewSubCategory("")

loadCategories()

}catch(err){

console.log(err)

}

}

const submitBook = async(e)=>{

e.preventDefault()

if(loading) return

setLoading(true)

try{

const formData = new FormData()

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

alert("Buku berhasil ditambahkan")

}catch(err){

console.log(err)

}

setLoading(false)

}

return(

<AdminLayout>

<div className="card">

<h2>Tambah Buku</h2>

<form onSubmit={submitBook} className="form-grid">

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
<option key={cat.slug} value={cat.slug}>
{cat.name}
</option>
))}

</select>

{/* ===== BUAT KATEGORI BARU ===== */}

<label>Buat Kategori Baru</label>

<div className="category-box">

<input
placeholder="Kategori baru"
value={newCategory}
onChange={(e)=>setNewCategory(e.target.value)}
/>

<button type="button" onClick={createCategory}>
Tambah
</button>

</div>

<label>Subkategori</label>

<select
value={subcategory}
onChange={e=>setSubcategory(e.target.value)}
>

<option value="">Tidak ada</option>

{categories
.filter(c=>c.parent===category)
.map(cat=>(
<option key={cat.slug} value={cat.slug}>
{cat.name}
</option>
))}

</select>

{/* ===== BUAT SUB KATEGORI ===== */}

<label>Buat Subkategori Baru</label>

<div className="category-box">

<input
placeholder="Subkategori baru"
value={newSubCategory}
onChange={(e)=>setNewSubCategory(e.target.value)}
/>

<button type="button" onClick={createSubCategory}>
Tambah
</button>

</div>

<label>Upload Cover</label>

<input
type="file"
onChange={(e)=>{

const file = e.target.files[0]

setImage(file)

if(file){
setPreview(URL.createObjectURL(file))
}

}}
/>

{preview && (
<img src={preview} className="preview"/>
)}

<button
className="primary"
disabled={loading}
>
{loading ? "Uploading..." : "Tambah Buku"}
</button>

</form>

</div>

</AdminLayout>

)

}

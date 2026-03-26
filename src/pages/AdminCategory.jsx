import { useEffect,useState } from "react"
import axios from "axios"
import { API_URL } from "../config"
import AdminLayout from "../components/AdminLayout"

export default function AdminCategory(){

const [categories,setCategories]=useState([])
const [name,setName]=useState("")
const [parent,setParent]=useState("")

const adminConfig={
headers:{
Authorization:`Bearer ${localStorage.getItem("adminToken")}`
}
}

const load=()=>{
axios.get(`${API_URL}/api/categories`)
.then(res=>setCategories(res.data))
}

useEffect(()=>{load()},[])

const create=async()=>{
await axios.post(`${API_URL}/api/categories`,{
name,
parent
},adminConfig)

setName("")
setParent("")
load()
}

const del=async(id)=>{
if(!confirm("Hapus kategori?")) return

await axios.delete(`${API_URL}/api/categories?id=${id}`,adminConfig)
load()
}

return(
<AdminLayout>

<div style={{padding:20}}>

<h2>Kelola Kategori</h2>

<input
placeholder="Nama kategori"
value={name}
onChange={e=>setName(e.target.value)}
/>

<select onChange={e=>setParent(e.target.value)}>
<option value="">Kategori utama</option>
{categories.filter(c=>!c.parent).map(cat=>(
<option key={cat.slug} value={cat.slug}>
{cat.name}
</option>
))}
</select>

<button onClick={create}>Tambah</button>

<hr/>

{categories.map(cat=>(
<div key={cat._id} style={{marginBottom:10}}>

{cat.name}

<button onClick={()=>del(cat._id)}>
Delete
</button>

</div>
))}

</div>

</AdminLayout>
)
}
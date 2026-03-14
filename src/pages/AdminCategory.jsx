import { useState } from "react"
import axios from "axios"
import { API_URL } from "../config"
import AdminLayout from "../components/AdminLayout"

export default function AdminCategory(){

const [name,setName] = useState("")
const [parent,setParent] = useState("")

const submit = async(e)=>{

e.preventDefault()

await axios.post(`${API_URL}/api/categories`,{
name,
parent
})

alert("Kategori ditambahkan")

setName("")
setParent("")

}

return(

<AdminLayout>

<div className="card">

<h2>Tambah Kategori</h2>

<form onSubmit={submit}>

<input
placeholder="Nama kategori"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<select
value={parent}
onChange={(e)=>setParent(e.target.value)}
>

<option value="">Kategori Utama</option>


</select>

<button className="primary">
Tambah
</button>

</form>

</div>

</AdminLayout>

)

}

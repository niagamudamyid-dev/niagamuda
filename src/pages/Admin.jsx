import { useEffect,useState } from "react"
import axios from "axios"
import { API_URL } from "../config"
import AdminLayout from "../components/AdminLayout"

export default function Admin(){

const [books,setBooks] = useState([])

useEffect(()=>{

axios.get(`${API_URL}/api/books`)
.then(res=>{
setBooks(res.data)
})

},[])

return(

<AdminLayout>

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

</AdminLayout>

)

}

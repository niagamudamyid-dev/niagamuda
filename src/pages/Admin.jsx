import { useEffect,useState } from "react"
import axios from "axios"
import { API_URL } from "../config"
import AdminLayout from "../components/AdminLayout"

export default function Admin(){

const [books,setBooks] = useState([])
const [categories,setCategories] = useState([])

useEffect(()=>{

const load = async()=>{

const booksRes = await axios.get(`${API_URL}/api/books`)
setBooks(booksRes.data)

const catRes = await axios.get(`${API_URL}/api/categories`)
setCategories(catRes.data)

}

load()

},[])

return(

<AdminLayout>

<div className="dashboard">

<div className="stat">

<h3>Total Buku</h3>
<h1>{books.length}</h1>

</div>

<div className="stat">

<h3>Total Kategori</h3>
<h1>{categories.length}</h1>

</div>

</div>

</AdminLayout>

)

}

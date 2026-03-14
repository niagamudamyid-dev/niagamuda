import {useParams} from "react-router-dom"
import {useEffect,useState} from "react"
import axios from "axios"
import {API_URL} from "../config"
import BookCard from "../components/BookCard"

export default function Category(){

const {name}=useParams()

const [books,setBooks]=useState([])

useEffect(()=>{

axios
.get(`${API_URL}/api/books?category=${name}`)
.then(res=>setBooks(res.data))

},[name])

return(

<div className="container">

<h1>{name}</h1>

<div className="books-grid">

{books.map(book=>(
<BookCard key={book._id} book={book}/>
))}

</div>

</div>

)

}

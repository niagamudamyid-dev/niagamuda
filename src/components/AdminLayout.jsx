import { useNavigate } from "react-router-dom"
import "../pages/admin.css"

export default function AdminLayout({children}){

const navigate = useNavigate()

return(

<div className="admin">

<aside className="sidebar">

<h2>Niagamuda</h2>

<button onClick={()=>navigate("/admin")}>
Dashboard
</button>

<button onClick={()=>navigate("/admin/books")}>
Daftar Buku
</button>

<button onClick={()=>navigate("/admin/add-book")}>
Tambah Buku
</button>

</aside>

<main className="main">

<header className="topbar">

<h3>Admin Panel</h3>

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

{children}

</main>

</div>

)

}

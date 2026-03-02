import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./admin.css";

export default function Admin() {

  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================
  // FETCH BOOKS
  // =====================
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/books`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

 useEffect(() => {
  const loadData = async () => {
    await fetchBooks();
  };

  loadData();
}, []);

  // =====================
  // SUBMIT
  // =====================
  const submitBook = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.put(`${API_URL}/api/books?id=${editId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/books`, formData);
      }

      setTitle("");
      setPrice("");
      setImage(null);
      setPreview(null);
      setEditId(null);

      fetchBooks();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Terjadi kesalahan");
    }

    setLoading(false);
  };

  // =====================
  // DELETE
  // =====================
  const deleteBook = async (id) => {
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;
    await axios.delete(`${API_URL}/api/books?id=${id}`);
    fetchBooks();
  };

  const editBook = (book) => {
    setTitle(book.title);
    setPrice(book.price);
    setEditId(book._id);
    setPreview(book.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Niagamuda</h2>
        <button className="menu-btn">Dashboard</button>
        <button className="menu-btn active">Kelola Buku</button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h3>Admin Dashboard</h3>
        </div>

        {/* FORM CARD */}
        <div className="card">
          <h2>{editId ? "Update Buku" : "Tambah Buku"}</h2>

          <form onSubmit={submitBook} className="form-grid">

            <div>
              <label>Judul Buku</label>
              <input
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                required
              />

              <label>Harga</label>
              <input
                type="number"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                required
              />

              <label>Upload Cover</label>
              <input
                type="file"
                onChange={(e)=>{
                  const file = e.target.files[0];
                  setImage(file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />

              {preview && (
                <img className="preview-img" src={preview} />
              )}
            </div>

            <div>
              <label>Sinopsis</label>
              <textarea rows="8" placeholder="Deskripsi buku..." />
            </div>

            <button className="primary-btn" disabled={loading}>
              {loading ? "Memproses..." : editId ? "Update Buku" : "Tambah Buku"}
            </button>

          </form>
        </div>

        {/* LIST CARD */}
        <div className="card">
          <h2>Daftar Buku</h2>

          {books.map(book => (
            <div key={book._id} className="book-row">
              <div className="book-info">
                <img src={book.image} />
                <div>
                  <b>{book.title}</b>
                  <p>Rp {Number(book.price).toLocaleString()}</p>
                </div>
              </div>

              <div className="book-actions">
                <button onClick={()=>editBook(book)}>Edit</button>
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
  );
}
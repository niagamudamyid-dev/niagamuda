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
  const submitBook = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    if (image) formData.append("image", image);

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
  };

  const editBook = (book) => {
    setTitle(book.title);
    setPrice(book.price);
    setEditId(book._id);
    setPreview(book.image);
  };

  const deleteBook = async (id) => {
    await axios.delete(`${API_URL}/api/books?id=${id}`);
    fetchBooks();
  };

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Niagamuda</h2>

        <div className="menu">
          <button className="active">Tambah Buku</button>
          <button>Daftar Buku</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-content">

        <div className="card">

          <h2>{editId ? "Update Buku" : "Tambah Buku"}</h2>

          <form onSubmit={submitBook} className="grid-form">

            {/* LEFT */}
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
                <div className="preview">
                  <img src={preview} alt="preview" />
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div>
              <label>Sinopsis</label>
              <textarea rows="8" placeholder="Deskripsi buku..." />
            </div>

            <button className="submit-btn">
              {editId ? "Update Buku" : "Tambah Buku"}
            </button>

          </form>

        </div>

        {/* LIST */}
        <div className="card">
          <h2>Daftar Buku</h2>

          {books.map(book => (
            <div key={book._id} className="book-item">
              <div>
                <img src={book.image} />
                <div>
                  <b>{book.title}</b>
                  <p>Rp {Number(book.price).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <button onClick={()=>editBook(book)}>Edit</button>
                <button className="danger"
                        onClick={()=>deleteBook(book._id)}>
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
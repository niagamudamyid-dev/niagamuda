import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./admin.css";

export default function Admin() {

  const adminConfig = {
    headers: {
      "x-admin-key": import.meta.env.VITE_ADMIN_KEY
    }
  };

  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // ================= FETCH =================
  const fetchBooks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/books`);
      setBooks(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      setToast("Gagal mengambil data");
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // ================= SUBMIT =================
  const submitBook = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      if (image) formData.append("image", image);

      if (editId) {
        await axios.put(
          `${API_URL}/api/books/${editId}`,
          formData,
          adminConfig
        );
        setToast("Buku berhasil diupdate");
      } else {
        await axios.post(
          `${API_URL}/api/books`,
          formData,
          adminConfig
        );
        setToast("Buku berhasil ditambahkan");
      }

      setTitle("");
      setPrice("");
      setImage(null);
      setPreview(null);
      setEditId(null);

      fetchBooks();

    } catch (error) {
      console.error("Submit error:", error);
      setToast("Akses ditolak / Error");
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  // ================= DELETE =================
  const deleteBook = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/books/${id}`,
        adminConfig
      );

      setToast("Buku berhasil dihapus");
      fetchBooks();

    } catch (error) {
      console.error("Delete error:", error);
      setToast("Akses ditolak / Gagal hapus");
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const editBook = (book) => {
    setTitle(book.title);
    setPrice(book.price);
    setEditId(book._id);
    setPreview(book.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin">

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Niagamuda</h2>
        <nav>
          <button className="active">Dashboard</button>
          <button>Kelola Buku</button>
        </nav>
      </aside>

      <main className="main">

        <header className="topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h3>Admin Dashboard</h3>
        </header>

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

        <section className="card">
          <h2>{editId ? "Update Buku" : "Tambah Buku"}</h2>

          <form onSubmit={submitBook} className="form-grid">

            <div>
              <label>Judul Buku</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Harga</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <label>Upload Cover</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />

              {preview && <img src={preview} className="preview" />}
            </div>

            <div>
              <label>Deskripsi</label>
              <textarea rows="8" placeholder="Deskripsi buku..." />
            </div>

            <button className="primary">
              {editId ? "Update Buku" : "Tambah Buku"}
            </button>

          </form>
        </section>

        <section className="card">
          <h2>Daftar Buku</h2>

          <div className="table">
            {books.map(book => (
              <div key={book._id} className="row">
                <div className="info">
                  <img src={book.image} alt={book.title} />
                  <div>
                    <b>{book.title}</b>
                    <p>Rp {Number(book.price).toLocaleString()}</p>
                  </div>
                </div>

                <div className="actions">
                  <button onClick={() => editBook(book)}>Edit</button>
                  <button
                    className="danger"
                    onClick={() => deleteBook(book._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>

      </main>

      {toast && <div className="toast">{toast}</div>}

    </div>
  );
}
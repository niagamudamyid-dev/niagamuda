import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./admin.css";
import useAutoLogout from "../components/useAutoLogout";

export default function Admin() {
  useAutoLogout(10 * 60 * 1000);

  const adminConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  };

  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [editId, setEditId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // ===== CATEGORY STATE =====

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [parentCategory, setParentCategory] = useState("");

  // ================= FETCH BOOKS =================

  const fetchBooks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/books`);
      setBooks(res.data);
    } catch (error) {
      console.error(error);
      setToast("Gagal mengambil data buku");
    }
  }, []);

  // ================= FETCH CATEGORIES =================

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // ================= SUBMIT BOOK =================

  const submitBook = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subcategory", subcategory);

      if (image) formData.append("image", image);

      if (editId) {
        await axios.put(
          `${API_URL}/api/books?id=${editId}`,
          formData,
          adminConfig
        );

        setToast("Buku berhasil diupdate");
      } else {
        await axios.post(`${API_URL}/api/books`, formData, adminConfig);

        setToast("Buku berhasil ditambahkan");
      }

      setTitle("");
      setPrice("");
      setCategory("");
      setSubcategory("");
      setImage(null);
      setPreview(null);
      setEditId(null);

      fetchBooks();
    } catch (error) {
      console.error(error);
      setToast("Error saat menyimpan buku");
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  // ================= DELETE =================

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/books?id=${id}`, adminConfig);

      setToast("Buku berhasil dihapus");

      fetchBooks();
    } catch (error) {
      console.error(error);
      setToast("Gagal menghapus buku");
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  // ================= EDIT =================

  const editBook = (book) => {
    setTitle(book.title);
    setPrice(book.price);
    setCategory(book.category || "");
    setSubcategory(book.subcategory || "");

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

        {sidebarOpen && (
          <div className="overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <header className="topbar">

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

          <h3>Admin Dashboard</h3>

          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>

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

        {/* ================= CREATE CATEGORY ================= */}

        <section className="card">

          <h2>Buat Kategori</h2>

          <input
            placeholder="Nama kategori"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />

          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">Kategori Utama</option>

            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={async () => {
              await axios.post(
                `${API_URL}/api/categories`,
                {
                  name: newCategory,
                  parent: parentCategory,
                },
                adminConfig
              );

              setNewCategory("");
              setParentCategory("");

              fetchCategories();
            }}
          >
            Tambah Kategori
          </button>

        </section>

        {/* ================= FORM BOOK ================= */}

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

              <label>Kategori</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >

                <option value="">Pilih kategori</option>

                {categories
                  .filter((c) => !c.parent)
                  .map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}

              </select>

              <label>Sub Kategori</label>

              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              >

                <option value="">Tidak ada</option>

                {categories
                  .filter((c) => c.parent === category)
                  .map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}

              </select>

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

            <button className="primary">
              {editId ? "Update Buku" : "Tambah Buku"}
            </button>

          </form>

        </section>

        {/* ================= LIST BOOK ================= */}

        <section className="card">

          <h2>Daftar Buku</h2>

          <div className="table">

            {books.map((book) => (

              <div key={book._id} className="row">

                <div className="info">

                  <img src={book.image} alt={book.title} />

                  <div>

                    <b>{book.title}</b>

                    <p>Rp {Number(book.price).toLocaleString()}</p>

                    <small>{book.category}</small>

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

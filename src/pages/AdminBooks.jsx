import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin-books.css";

export default function AdminBooks() {

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editBook, setEditBook] = useState(null);

  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState("");

  // 🔥 STATE UNTUK CATEGORY DINAMIS
  const [selectedCategory, setSelectedCategory] = useState("");

  const adminConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const fetchBooks = async () => {
    const res = await axios.get(`${API_URL}/api/books`);
    setBooks(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/api/categories`);
    setCategories(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBooks();
    fetchCategories();
  }, []);

  const deleteBook = async (id) => {
    if (loadingId) return;
    if (!confirm("Hapus buku ini?")) return;

    setLoadingId(id);

    try {
      await axios.delete(`${API_URL}/api/books?id=${id}`, adminConfig);
      showToast("Buku berhasil dihapus");
      fetchBooks();
    } catch {
      showToast("Gagal menghapus buku");
    }

    setLoadingId(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (loadingId) return;

    setLoadingId("edit");

    const formData = new FormData(e.target);

    try {
      await axios.put(
        `${API_URL}/api/books?id=${editBook._id}`,
        formData,
        adminConfig
      );

      showToast("Buku berhasil diupdate");
      setEditBook(null);
      fetchBooks();
    } catch {
      showToast("Gagal update buku");
    }

    setLoadingId(null);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  return (
    <AdminLayout>
      <div className="adminBooks-page">

        {toast && <div className="admin-toast">{toast}</div>}

        {/* HEADER */}
        <div className="adminBooks-topbar">
          <h2>📚 Daftar Buku</h2>

          <div className="topbar-right">
            <input
              type="text"
              placeholder="Cari buku..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="adminBooks-header">
          <span>{filteredBooks.length} buku ditemukan</span>
        </div>

        {/* LIST */}
        <div className="adminBooks-container">

          {filteredBooks.map((book) => (
            <div key={book._id} className="adminBooks-card">

              <img src={book.image} />

              <div className="adminBooks-info">
                <div className="title">{book.title}</div>
                <div className="price">
                  Rp {Number(book.price).toLocaleString()}
                </div>
              </div>

              <div className="adminBooks-actions">
                <button
                  className="btn-edit"
                  onClick={() => {
                    setEditBook(book);
                    setSelectedCategory(book.category || "");
                  }}
                >
                  Edit
                </button>

                <button
                  className={`btn-delete ${
                    loadingId === book._id ? "btn-loading" : ""
                  }`}
                  disabled={loadingId === book._id}
                  onClick={() => deleteBook(book._id)}
                >
                  {loadingId === book._id ? "..." : "Delete"}
                </button>
              </div>

            </div>
          ))}

        </div>

        {/* MODAL EDIT */}
        {editBook && (
  <div className="adminModal">
    <div className="adminModal-box">

      <h3>Edit Buku Lengkap</h3>

      <form onSubmit={handleUpdate} className="adminForm">

        {/* ===== GRID FORM ===== */}
        <div className="adminForm-grid">

          <input name="title" defaultValue={editBook.title} placeholder="Judul" />
          <input name="author" defaultValue={editBook.author} placeholder="Penulis" />

          <input name="isbn" defaultValue={editBook.isbn} placeholder="ISBN" />
          <input name="publisher" defaultValue={editBook.publisher} placeholder="Penerbit" />

          <input name="publishDate" defaultValue={editBook.publishDate} placeholder="Tanggal Terbit" />
          <input name="pages" defaultValue={editBook.pages} placeholder="Jumlah Halaman" />

          <input name="weight" defaultValue={editBook.weight} placeholder="Berat" />
          <input name="coverType" defaultValue={editBook.coverType} placeholder="Jenis Cover" />

          <input name="dimension" defaultValue={editBook.dimension} placeholder="Dimensi" />
          <input name="bonus" defaultValue={editBook.bonus} placeholder="Bonus" />

          <input name="language" defaultValue={editBook.language} placeholder="Bahasa" />
          <input name="stock" type="number" defaultValue={editBook.stock} placeholder="Stok" />

          <input name="price" type="number" defaultValue={editBook.price} placeholder="Harga" />
          <input name="shopeeLink" defaultValue={editBook.shopeeLink} placeholder="Link Shopee" />

        </div>

        {/* ===== DESKRIPSI ===== */}
        <textarea
          name="description"
          defaultValue={editBook.description}
          placeholder="Deskripsi"
          className="adminForm-textarea"
        />

        {/* ===== CATEGORY ===== */}
        <div className="adminForm-grid">

          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Pilih kategori</option>
            {categories.filter(c => !c.parent).map(cat => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            name="subcategory"
            defaultValue={editBook.subcategory}
          >
            <option value="">Tidak ada</option>
            {categories
              .filter(c => c.parent === selectedCategory)
              .map(cat => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
          </select>

        </div>

        {/* ===== IMAGE ===== */}
        <input type="file" name="image" />

        {editBook.image && (
          <img src={editBook.image} className="preview-img" />
        )}

        {/* ===== BUTTON ===== */}
        <div className="modal-actions">

          <button
            className={`btn-primary ${loadingId === "edit" ? "btn-loading" : ""}`}
            disabled={loadingId === "edit"}
          >
            {loadingId === "edit" ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            type="button"
            className="btn-cancel"
            onClick={() => setEditBook(null)}
          >
            Batal
          </button>

        </div>

      </form>

    </div>
  </div>
)}

      </div>
    </AdminLayout>
  );
}
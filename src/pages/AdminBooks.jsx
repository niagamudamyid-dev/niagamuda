import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin-books.css";

export default function AdminBooks() {

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editBook, setEditBook] = useState(null);

  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState("");

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

  return (
    <AdminLayout>
      <div className="adminBooks-page">

        {/* TOAST */}
        {toast && <div className="admin-toast">{toast}</div>}

        <div className="adminBooks-header">
          <h2>📚 Daftar Buku</h2>
          <span>{books.length} buku</span>
        </div>

        <div className="adminBooks-container">

          {books.map((book) => (
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
                  onClick={() => setEditBook(book)}
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

        {/* MODAL */}
        {editBook && (
          <div className="adminModal">

            <div className="adminModal-box">

              <h3>Edit Buku</h3>

              <form onSubmit={handleUpdate} className="adminForm">

                <input
                  name="title"
                  defaultValue={editBook.title}
                  required
                />

                <input
                  name="price"
                  type="number"
                  defaultValue={editBook.price}
                  required
                />

                <select name="category" defaultValue={editBook.category}>
                  <option value="">Kategori</option>
                  {categories
                    .filter(c => !c.parent)
                    .map(cat => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                </select>

                <select name="subcategory" defaultValue={editBook.subcategory}>
                  <option value="">Subkategori</option>
                  {categories
                    .filter(c => c.parent === editBook.category)
                    .map(cat => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                </select>

                <input type="file" name="image" />

                <img src={editBook.image} className="preview-img" />

                <div className="modal-actions">
                  <button
                    className={`btn-primary ${
                      loadingId === "edit" ? "btn-loading" : ""
                    }`}
                    disabled={loadingId === "edit"}
                  >
                    {loadingId === "edit" ? "..." : "Simpan"}
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
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin-books.css";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);

  const adminConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  };

  const fetchBooks = async () => {
    const res = await axios.get(`${API_URL}/api/books`);
    setBooks(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBooks();
  }, []);

  const deleteBook = async (id) => {
    if (!confirm("Hapus buku ini?")) return;

    await axios.delete(`${API_URL}/api/books?id=${id}`, adminConfig);
    fetchBooks();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // 🔥 FIX: WAJIB KIRIM CATEGORY
    formData.append("category", editBook.category || "");
    formData.append("subcategory", editBook.subcategory || "");

    await axios.put(
      `${API_URL}/api/books?id=${editBook._id}`,
      formData,
      adminConfig
    );

    setEditBook(null);
    fetchBooks();
  };

  return (
    <AdminLayout>
      <div className="adminBooks-page">

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
                  className="btn-delete"
                  onClick={() => deleteBook(book._id)}
                >
                  Delete
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
                  placeholder="Judul"
                  required
                />

                <input
                  name="price"
                  type="number"
                  defaultValue={editBook.price}
                  placeholder="Harga"
                  required
                />

                <input
                  type="file"
                  name="image"
                />

                <img
                  src={editBook.image}
                  className="preview-img"
                />

                <div className="modal-actions">
                  <button className="btn-primary">Simpan</button>

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
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

        <h2>📚 Daftar Buku</h2>

        <div className="adminBooks-container">

          {books.map((book) => (
            <div key={book._id} className="adminBooks-card">

              <img src={book.image} />

              <div className="adminBooks-info">
                <div>{book.title}</div>
                <div>Rp {Number(book.price).toLocaleString()}</div>
              </div>

              <div className="adminBooks-actions">
                <button onClick={() => setEditBook(book)}>Edit</button>

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

        {/* MODAL EDIT */}
        {editBook && (
          <div className="adminBooks-modal">

            <div className="adminBooks-modal-content">

              <h3>Edit Buku</h3>

              <form onSubmit={handleUpdate}>

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

                <input type="file" name="image" />

                <div className="modal-actions">
                  <button type="submit">Simpan</button>
                  <button
                    type="button"
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
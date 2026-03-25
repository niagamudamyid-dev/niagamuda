import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin-books.css";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);

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
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;

    await axios.delete(`${API_URL}/api/books?id=${id}`, adminConfig);
    fetchBooks();
  };

  return (
    <AdminLayout>
      <div className="adminBooks-page">

        <div className="adminBooks-header">
          <h2>📚 Daftar Buku</h2>
          <span>Total: {books.length}</span>
        </div>

        <div className="adminBooks-container">

          {books.map((book) => (
            <div key={book._id} className="adminBooks-card">

              <img src={book.image} alt={book.title} />

              <div className="adminBooks-info">
                <div className="adminBooks-title">{book.title}</div>
                <div className="adminBooks-price">
                  Rp {Number(book.price).toLocaleString()}
                </div>
              </div>

              <div className="adminBooks-actions">
                <button className="edit-btn">Edit</button>

                <button
                  className="delete-btn"
                  onClick={() => deleteBook(book._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>
    </AdminLayout>
  );
}
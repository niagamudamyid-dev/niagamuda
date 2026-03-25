import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import BookCard from "../components/BookCard";
import "../styles/category.css"; // ⬅️ CSS KHUSUS

export default function Category() {
  const { name } = useParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    axios
      .get(`${API_URL}/api/books?category=${name}`)
      .then((res) => setBooks(res.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [name]);

  return (
    <div className="category-page">

      {/* HEADER */}
      <div className="category-header">
        <h1>{name}</h1>
        <p>Kumpulan buku dalam kategori {name}</p>
      </div>

      {/* CONTENT */}
      <div className="category-content">

        {loading ? (
          <div className="category-loading">
            Loading data...
          </div>
        ) : books.length === 0 ? (
          <div className="category-empty">
            Tidak ada buku di kategori ini
          </div>
        ) : (
          <div className="category-grid">
            {books.map((book) => (
              <div className="category-item" key={book._id}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
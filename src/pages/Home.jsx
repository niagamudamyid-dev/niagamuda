import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { API_URL } from "../config";
import "./home.css";

export default function Home() {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/books`)
      .then(res => {
        console.log(res.data);
        setBooks(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">

        <div className="hero-left">

          <p className="hero-sub">
            SELAMAT DATANG DI NIAGAMUDA
          </p>

          <h1>
            Diskon <span>50%</span>
            <br />
            Semua Ebook
          </h1>

          <p className="hero-desc">
            Temukan berbagai ebook murah dan terpercaya.
          </p>

          <a href="#books" className="hero-btn">
            Lihat Ebook
          </a>

        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
            alt="books"
          />
        </div>

      </section>


      {/* BOOK SECTION */}
      <section className="books-section" id="books">

        <h2 className="section-title">
          Buku Favorit
        </h2>

        <div className="books-grid">

          {books.length === 0 ? (
            <p>Loading buku...</p>
          ) : (
            books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))
          )}

        </div>

      </section>

    </div>
  );
}
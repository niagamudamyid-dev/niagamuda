import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

export default function Home() {

  const [books, setBooks] = useState([]);

  // ambil data dari backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then(res => {
        setBooks(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container">
      <h1>Toko Buku 📚</h1>

      <div className="grid">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
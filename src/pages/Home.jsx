import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { API_URL } from "../config";

export default function Home() {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/books`)
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="books-container">
      <h1>Toko Buku 📚</h1>

      <div className="grid">
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}
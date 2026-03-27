import { useNavigate } from "react-router-dom";

export default function BookCard({ book }) {

  const navigate = useNavigate();

  // 🔥 WAJIB: hanya slug
  const handleClick = () => {
    if (!book.slug) {
      alert("Slug belum tersedia, silakan update data buku");
      return;
    }

    navigate(`/book/${book.slug}`);
  };

  return (

    <div 
      className="card" 
      onClick={handleClick} 
      style={{ cursor: "pointer" }}
    >

      <div className="card-cover">
        <img
          src={book.image || "https://via.placeholder.com/300x450"}
          alt={book.title}
          loading="lazy"
        />
      </div>

      <div className="card-sub">
        {book.subcategory || book.category}
      </div>

      <div className="card-title">
        {book.title}
      </div>

      <div className="card-price">
        Rp {Number(book.price).toLocaleString()}
      </div>

    </div>

  );
}
import { useNavigate } from "react-router-dom";

export default function BookCard({ book }) {

  const navigate = useNavigate();

  // ✅ SEO slug dari title
  const slug = book.title
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const handleClick = () => {
    navigate(`/book/${slug}-${book._id}`);
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
export default function BookCard({ book }) {
  return (
    <div className="card">
      <img
  src={book.image || "https://via.placeholder.com/300x400"}
  alt={book.title}
/>

      <h3>{book.title}</h3>

      <p className="price">
        Rp {book.price.toLocaleString()}
      </p>

      <button>Add to Cart</button>
    </div>
  );
}
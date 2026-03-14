export default function BookCard({ book }) {

return (

<div className="home-card">

<div className="home-card-cover">

<img
src={book.image || "https://via.placeholder.com/300x450"}
alt={book.title}
/>

</div>

<div className="home-card-sub">
{book.subcategory || book.category}
</div>

<div className="home-card-title">
{book.title}
</div>

<div className="home-card-price">
Rp {Number(book.price).toLocaleString()}
</div>

</div>

)

}

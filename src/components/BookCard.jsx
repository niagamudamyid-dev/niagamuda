export default function BookCard({ book }) {

return (

<div className="card">

<img
src={book.image || "https://via.placeholder.com/300x400"}
alt={book.title}
/>

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

)

}

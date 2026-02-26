import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {

  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ====================
  // FETCH BOOKS
  // ====================
  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:5000/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ====================
  // ADD / UPDATE BOOK
  // ====================
  const submitBook = async (e) => {
    e.preventDefault();

    setLoading(true); // ✅ mulai loading

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);

      if (image) {
        formData.append("image", image);
      }

      if (editId) {
        await axios.put(
          `http://localhost:5000/books/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/books",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      // reset form
      setTitle("");
      setPrice("");
      setImage(null);
      setPreview(null);
      setEditId(null);

      fetchBooks();

    } catch (err) {
      console.error(err);
      alert("Upload gagal");
    } finally {
      setLoading(false); // ✅ selesai loading
    }
  };

  // ====================
  // DELETE
  // ====================
  const deleteBook = async (id) => {
    await axios.delete(`http://localhost:5000/books/${id}`);
    fetchBooks();
  };

  // ====================
  // EDIT MODE
  // ====================
  const editBook = (book) => {
    setTitle(book.title);
    setPrice(book.price);
    setEditId(book._id);
    setPreview(book.image);
  };

  return (
    <div className="container">
      <h1>Admin Buku 📚</h1>

      <form onSubmit={submitBook} className="admin-form">

        <input
          placeholder="Judul Buku"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          required
        />

        {/* UPLOAD GAMBAR */}
        <input
          type="file"
          accept="image/*"
          onChange={(e)=>{
            const file = e.target.files[0];
            setImage(file);

            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

        {/* PREVIEW */}
        {preview && (
          <div style={{ marginTop: "15px" }}>
            <p>Preview Cover:</p>
            <img
              src={preview}
              alt="preview"
              style={{
                width: "150px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,.1)"
              }}
            />
          </div>
        )}

        {/* BUTTON WITH SPINNER */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            editId ? "Update Buku" : "Tambah Buku"
          )}
        </button>

      </form>

      <hr />

      <h2>Daftar Buku</h2>

      {books.map(book => (
        <div key={book.id} className="admin-item">

          <div>
            {book.image && (
              <img
                src={book.image}
                width="60"
                style={{borderRadius:"8px"}}
              />
            )}

            <b>{book.title}</b>
            <p>Rp {book.price}</p>
          </div>

          <div>
            <button onClick={()=>editBook(book)}>Edit</button>
            <button onClick={()=>deleteBook(book._id)}>
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>Niagamuda</h2>
          <p>
            Temukan berbagai ebook murah dan terpercaya
            untuk meningkatkan pengetahuan dan skill kamu.
          </p>
        </div>

        {/* PRODUK */}
        <div className="footer-links">
          <h4>Produk</h4>
          <a href="#">Ebook</a>
          <a href="#">Kategori</a>
          <a href="#">Terbaru</a>
        </div>

        {/* BANTUAN */}
        <div className="footer-links">
          <h4>Bantuan</h4>
          <a href="#">FAQ</a>
          <a href="#">Panduan</a>
          <a href="#">Support</a>
        </div>

        {/* KONTAK */}
        <div className="footer-links">
          <h4>Kontak</h4>
          <a href="#">Email</a>
          <a href="#">Instagram</a>
          <a href="#">WhatsApp</a>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Niagamuda. All rights reserved.
      </div>

    </footer>
  );
}
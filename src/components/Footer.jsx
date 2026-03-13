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

          {/* SOCIAL MEDIA */}
          <div className="footer-social">

            <a href="#">
              <svg viewBox="0 0 24 24">
                <path d="M22 12.1C22 6.6 17.5 2 12 2S2 6.6 2 12.1c0 5 3.7 9.1 8.4 9.9v-7H7.9v-2.9h2.5V9.4c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6v2h2.9l-.5 2.9h-2.4v7C18.3 21.2 22 17.1 22 12.1z"/>
              </svg>
            </a>

            <a href="#">
              <svg viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.5.5.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.2.5.4 1.3.5 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.5-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.5.2-1.3.4-2.5.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.5-.5-.6-.2-1.1-.5-1.6-1-.5-.5-.8-1-1-1.6-.2-.5-.4-1.3-.5-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-2 .5-2.5.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .5-.2 1.3-.4 2.5-.5C8.4 2.2 8.8 2.2 12 2.2z"/>
              </svg>
            </a>

            <a href="#">
              <svg viewBox="0 0 24 24">
                <path d="M22 5.8c-.8.4-1.6.6-2.4.8.9-.6 1.5-1.4 1.8-2.4-.8.5-1.7.9-2.7 1.1C17.9 4.4 16.8 4 15.6 4c-2.3 0-4.1 1.9-4.1 4.2 0 .3 0 .6.1.9-3.4-.2-6.5-1.9-8.5-4.5-.4.6-.6 1.4-.6 2.2 0 1.5.7 2.9 1.9 3.6-.7 0-1.3-.2-1.9-.5v.1c0 2.1 1.4 3.8 3.3 4.2-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.7-5.1 1.7H2c1.8 1.2 3.9 1.9 6.2 1.9 7.4 0 11.5-6.2 11.5-11.6v-.5c.8-.6 1.5-1.4 2.1-2.3z"/>
              </svg>
            </a>

          </div>

        </div>

        {/* MENU */}
        <div className="footer-links">
          <h4>Produk</h4>
          <a href="#">Ebook</a>
          <a href="#">Kategori</a>
          <a href="#">Terbaru</a>
        </div>

        <div className="footer-links">
          <h4>Bantuan</h4>
          <a href="#">FAQ</a>
          <a href="#">Panduan</a>
          <a href="#">Support</a>
        </div>

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

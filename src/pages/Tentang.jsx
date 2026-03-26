import "../styles/tentang.css"

export default function Tentang(){

return(

<div className="about-page">

{/* HERO */}
<section className="about-hero">

<h1>Niagamuda</h1>

<p>
Platform ebook modern untuk kamu yang ingin belajar, berkembang,
dan mendapatkan pengetahuan dengan harga terjangkau.
</p>

</section>

{/* DESKRIPSI */}
<section className="about-section">

<h2>Tentang Kami</h2>

<p>
Niagamuda adalah platform digital yang menyediakan berbagai ebook
berkualitas dengan harga yang terjangkau. Kami hadir untuk membantu
pelajar, mahasiswa, dan masyarakat umum dalam mengakses ilmu pengetahuan
secara mudah dan cepat.
</p>

<p>
Kami percaya bahwa ilmu harus dapat diakses oleh semua orang tanpa
batasan, sehingga kami terus menghadirkan koleksi ebook terbaik
dari berbagai kategori.
</p>

</section>

{/* KEUNGGULAN */}
<section className="about-features">

<div className="feature">
<h3>📚 Koleksi Lengkap</h3>
<p>Berbagai kategori ebook tersedia dari edukasi hingga hiburan</p>
</div>

<div className="feature">
<h3>💸 Harga Terjangkau</h3>
<p>Dapatkan ebook berkualitas dengan harga ramah di kantong</p>
</div>

<div className="feature">
<h3>⚡ Akses Cepat</h3>
<p>Download dan baca kapan saja tanpa ribet</p>
</div>

<div className="feature">
<h3>🔒 Aman & Terpercaya</h3>
<p>Platform aman dengan sistem yang terpercaya</p>
</div>

</section>

{/* CTA */}
<section className="about-cta">

<h2>Mulai Jelajahi Ebook Sekarang</h2>

<a href="/" className="cta-btn">
Lihat Buku
</a>

</section>

</div>

)

}
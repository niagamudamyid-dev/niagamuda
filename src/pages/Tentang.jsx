import "../styles/tentang.css"
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react"

export default function Tentang(){

useEffect(()=>{
AOS.init({ duration: 1000 })
},[])

return(

<div className="aboutX-page">

{/* HERO */}
<section className="aboutX-hero" data-aos="fade-down">

<h1>Niagamuda</h1>

<p>
Platform ebook modern untuk kamu yang ingin belajar, berkembang,
dan mendapatkan pengetahuan dengan harga terjangkau.
</p>

</section>

{/* DESKRIPSI */}
<section className="aboutX-section" data-aos="fade-up">

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

{/* FEATURES */}
<section className="aboutX-features">

<div className="aboutX-feature" data-aos="fade-up">
<h3>📚 Koleksi Lengkap</h3>
<p>Berbagai kategori ebook tersedia</p>
</div>

<div className="aboutX-feature" data-aos="fade-up" data-aos-delay="100">
<h3>💸 Harga Terjangkau</h3>
<p>Harga ramah untuk semua kalangan</p>
</div>

<div className="aboutX-feature" data-aos="fade-up" data-aos-delay="200">
<h3>⚡ Akses Cepat</h3>
<p>Download instan tanpa ribet</p>
</div>

<div className="aboutX-feature" data-aos="fade-up" data-aos-delay="300">
<h3>🔒 Aman</h3>
<p>Platform terpercaya & aman</p>
</div>

</section>

{/* TEAM */}
<section className="aboutX-team">

<h2 data-aos="fade-up">Tim Kami</h2>

<div className="aboutX-team-grid">

<div className="aboutX-member" data-aos="zoom-in">
<img src="https://i.pravatar.cc/150?img=1"/>
<h4>Founder</h4>
<p>Visioner & Developer</p>
</div>

<div className="aboutX-member" data-aos="zoom-in" data-aos-delay="100">
<img src="https://i.pravatar.cc/150?img=2"/>
<h4>UI Designer</h4>
<p>Desain modern & clean</p>
</div>

<div className="aboutX-member" data-aos="zoom-in" data-aos-delay="200">
<img src="https://i.pravatar.cc/150?img=3"/>
<h4>Marketing</h4>
<p>Strategi & branding</p>
</div>

</div>

</section>

{/* CTA */}
<section className="aboutX-cta" data-aos="fade-up">

<h2>Mulai Jelajahi Ebook Sekarang 🚀</h2>

<a href="/" className="aboutX-btn">
Lihat Buku
</a>

</section>

</div>

)

}
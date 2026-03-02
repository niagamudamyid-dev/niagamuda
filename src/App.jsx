import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminGuard from "./components/AdminGuard";

export default function App() {
  return (
    <BrowserRouter>

      <nav className="navbar">
  <a href="/" className="logo">Niagamuda</a>
</nav>


      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/cms-portal-2026" element={<AdminGuard />} />
      </Routes>

    </BrowserRouter>
  );
}
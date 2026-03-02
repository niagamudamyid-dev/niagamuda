import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>

      <nav className="navbar">
  <div className="brand">
    <span className="dot"></span>
    Niagamuda
  </div>
</nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

    </BrowserRouter>
  );
}
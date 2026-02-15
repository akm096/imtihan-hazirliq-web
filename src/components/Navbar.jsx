import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-inner container">
                <Link to="/" className="navbar-brand">
                    <span className="navbar-logo">📖</span>
                    <span className="navbar-title">İmtihan Veb</span>
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menyunu aç/bağla"
                >
                    <span className={`hamburger ${menuOpen ? "open" : ""}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>

                <div className={`navbar-links ${menuOpen ? "show" : ""}`}>
                    <Link
                        to="/"
                        className={`navbar-link ${isActive("/") ? "active" : ""}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        🏠 Ana Səhifə
                    </Link>
                </div>
            </div>
        </nav>
    );
}

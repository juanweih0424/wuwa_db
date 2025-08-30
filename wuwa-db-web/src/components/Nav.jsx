import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "../assets/css/nav.css";

function Nav(){
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const btnRef = useRef(null);

    
    useEffect(() => {
        function onDocClick(e) {
        if (!open) return;
        if (
            menuRef.current &&
            !menuRef.current.contains(e.target) &&
            btnRef.current &&
            !btnRef.current.contains(e.target)
        ) {
            setOpen(false);
        }
        }
        document.addEventListener("click", onDocClick);
        return () => {
        document.removeEventListener("click", onDocClick);
        };
    }, [open]);

    const linkClass = ({ isActive }) =>
    "nav__link" + (isActive ? " active" : "");

    return (
    <nav className="nav">
      <div className="nav__brand">
        <Link to="/" className="nav__title">Wuthering Waves Database</Link>
      </div>

      <button
        ref={btnRef}
        className="nav__toggle"
        aria-label="Toggle menu"
        aria-controls="primary-menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className="nav__bar" />
        <span className="nav__bar" />
        <span className="nav__bar" />
      </button>

      <ul
        id="primary-menu"
        ref={menuRef}
        className={`nav__links ${open ? "is-open" : ""}`}
      >
        <li><NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/characters" className={linkClass} onClick={() => setOpen(false)}>Characters</NavLink></li>
        <li><NavLink to="/echoes" className={linkClass} onClick={() => setOpen(false)}>Echoes</NavLink></li>
        <li><NavLink to="/weapons" className={linkClass} onClick={() => setOpen(false)}>Weapons</NavLink></li>
        <li><NavLink to="/builder" className={linkClass} onClick={() => setOpen(false)}>Builder</NavLink></li>
        <li><NavLink to="/materials" className={linkClass} onClick={() => setOpen(false)}>Materials</NavLink></li>
        <li><NavLink to="/tierlist" className={linkClass} onClick={() => setOpen(false)}>Tier List</NavLink></li>
        <li><NavLink to="https://api.wuwa-db-api.com/" target="_blank" className={linkClass} onClick={() => setOpen(false)}>API</NavLink></li>
      </ul>
    </nav>
    )
}


export default Nav;
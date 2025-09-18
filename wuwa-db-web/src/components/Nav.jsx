import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Nav() {
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
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  const linkClass = ({ isActive }) =>
    [
      "block px-3 py-2 rounded-md text-sm font-medium transition",
      "hover:text-white/90 hover:bg-white/10",
      "xl:text-xl",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
      isActive ? "text-[color:var(--accent)]" : "text-white/80",
    ].join(" ");

  return (
    <nav className="bg-[#343541] w-full">
      <div className="mx-2">
        <div className="flex h-14 items-center justify-between">
          <Link
            to="/"
            className="text-lg text-[color:var(--accent)] font-bold lg:text-2xl"
          >
            Wuthering Waves Database
          </Link>

          <ul className="hidden lg:flex items-center">
            <li><NavLink  to="/" end className={linkClass}>Home</NavLink></li>
            <li><NavLink  to="/characters" className={linkClass}>Characters</NavLink></li>
            <li><NavLink  to="/echoes" className={linkClass}>Echoes</NavLink></li>
            <li><NavLink  to="/weapons" className={linkClass}>Weapons</NavLink></li>
            <li><NavLink  to="/builder" className={linkClass}>Builder</NavLink></li>
            <li><NavLink  to="/materials" className={linkClass}>Materials</NavLink></li>
            <li><NavLink  to="/tierlist" className={linkClass}>Tier List</NavLink></li>
            <li>
              <a
                href="https://api.wuwa-db-api.com/"
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2 rounded-md text-sm 
                font-medium text-white/80 hover:text-white/90
                 hover:bg-white/10 focus:outline-none focus-visible:ring-2
                 focus-visible:ring-white/40
                 xl:text-xl"
              >
                API
              </a>
            </li>
          </ul>

          <button
            ref={btnRef}
            aria-label="Toggle menu"
            aria-controls="primary-menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="lg:hidden cursor-pointer inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
          
            <span className="sr-only">Open main menu</span>
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`}></span>
              <span className={`block h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`}></span>
            </div>
          </button>
        </div>
      </div>

      <div
        id="primary-menu"
        ref={menuRef}
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="px-4 pb-4 space-y-1">
          <li><NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/characters" className={linkClass} onClick={() => setOpen(false)}>Characters</NavLink></li>
          <li><NavLink to="/echoes" className={linkClass} onClick={() => setOpen(false)}>Echoes</NavLink></li>
          <li><NavLink to="/weapons" className={linkClass} onClick={() => setOpen(false)}>Weapons</NavLink></li>
          <li><NavLink to="/builder" className={linkClass} onClick={() => setOpen(false)}>Builder</NavLink></li>
          <li><NavLink to="/materials" className={linkClass} onClick={() => setOpen(false)}>Materials</NavLink></li>
          <li><NavLink to="/tierlist" className={linkClass} onClick={() => setOpen(false)}>Tier List</NavLink></li>
          <li>
            <a
              href="https://api.wuwa-db-api.com/"
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white/90 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              onClick={() => setOpen(false)}
            >
              API
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

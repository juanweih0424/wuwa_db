// src/pages/WeaponDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { slugify, getWeaponImageUrl, prettySubstat } from "../utils/weapons.js";

const API = "https://api.wuwa-db-api.com/v1/weapons";

function WeaponDetail() {
  const { slug } = useParams();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    const ac = new AbortController();

    async function load() {
      try {
        const res = await fetch(API, { signal: ac.signal });
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.items || [];
        const found = arr.find(function (w) {
          return slugify(w.name) === slug;
        });
        setWeapon(found || null);
      } finally {
        setLoading(false);
      }
    }

    load();
    return function () {
      ac.abort();
    };
  }, [slug]);

  if (loading) return <p className="loading">Loading…</p>;
  if (!weapon) return <p className="error">Weapon not found. <Link to="/weapons">Back</Link></p>;

  const img = getWeaponImageUrl(weapon.name);

  return (
    <main className="weapon-detail">
      <Link to="/weapons" className="back-link">← Back to Weapons</Link>

      <header className="hero">
        <img
          src={img}
          alt={`${weapon.name} icon`}
          onError={(e) => (e.currentTarget.src = "/placeholder-weapon.webp")}
        />
        <h1>{weapon.name}</h1>
        <p className="sub">
          {weapon.type?.charAt(0).toUpperCase() + weapon.type?.slice(1)} • {weapon.rarity}★
        </p>
      </header>

      <section className="specs">
        <p><strong>ATK (Lv.90):</strong> {Math.round(weapon?.stats?.atk?.max ?? 0)}</p>
        <p><strong>Substat:</strong> {prettySubstat(weapon?.stats?.substats)}</p>
      </section>

      <section className="skill">
        <h2>{weapon?.skill?.name}</h2>
        <p className="muted">{weapon?.skill?.skill_description}</p>
      </section>
    </main>
  );
}

export default WeaponDetail;

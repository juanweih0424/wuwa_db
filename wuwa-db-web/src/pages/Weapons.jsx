// src/pages/Weapons.jsx
import { useEffect, useState,useMemo } from "react";
import WeaponCard from "../components/WeaponCard.jsx";
import { slugify, getWeaponImageUrl, prettySubstat } from "../utils/weapons.js";
import "../assets/css/weapons.css"

const API = "https://api.wuwa-db-api.com/v1/weapons";

function Weapons() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);


    // UI state for search and filters
    const [query, setQuery] = useState("");
    const [rarity, setRarity] = useState("all");  // default set to all
    const [type, setType] = useState("all");

    useEffect(function () {
        const ac = new AbortController();

        async function load() {
        try {
            const res = await fetch(API, { signal: ac.signal, headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const arr = Array.isArray(data) ? data : data.items || [];

            const list = arr.map(function (w) {
            return {
                id: w.id,
                name: w.name,
                slug: slugify(w.name),
                rarity: w.rarity,
                type: w.type,
                img: getWeaponImageUrl(w.name),
            };
            });

            
            list.sort(function (a, b) {
            return (
                b.rarity - a.rarity ||      
                a.name.localeCompare(b.name) 
            );
            });

        // setter
        setItems(list);


      } catch (e) {
        if (e.name !== "AbortError") setErr(e);
      } finally {
        setLoading(false);
      }
    }

    load();
    return function () {
      ac.abort();
    };
  }, []);

    if (err) return <p className="error">Failed to load weapons: {String(err.message)}</p>;

    const rarityOptions = useMemo(function () {
    const set = new Set(items.map((w) => String(w.rarity)));
    return Array.from(set).sort((a, b) => Number(b) - Number(a)); 
  }, [items]);

    const typeOptions = useMemo(function () {
    const set = new Set(items.map((w) => w.type));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

    function normStrict(s) {
    return String(s).toLowerCase();
  }

    const filtered = useMemo(function () {
        const q = normStrict(query);
        return items.filter(function (w) {
        const passQuery = q ? normStrict(w.name).includes(q) : true;
        const passRarity = rarity === "all" ? true : String(w.rarity) === rarity;
        const passType = type === "all" ? true : w.type === type;
        return passQuery && passRarity && passType;
        });
    }, [items, query, rarity, type]);

    const visible = useMemo(function () {
        const arr = filtered.slice();
        arr.sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name));
        return arr;
    }, [filtered]);


    return (
        <>
            <h1 className="page-title">Wuthering Waves Weapons</h1>
            <div className="content"> 
            <div className="filters">
                <input 
                    type="search"
                    placeholder="Enter a weapon name"
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                    className="filter-search"
                />

                <select
                value={rarity}
                onChange={(e)=>setRarity(e.target.value)}
                className="filter-rarity"
                >
                <option value="all">All</option>
                {rarityOptions.map((r) => (
                    <option key={r} value={r}>{r} stars</option>
                ))}
                </select>

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="filter-type"
                    >
                    <option value="all">All</option>
                        {typeOptions.map((t) => (
                        <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)} 
                        </option>
                    ))}
                </select>

            </div>
                <main className="weapons">

                <section className="weapons-grid">
                {loading ? null: visible.map((w) => (
                        <WeaponCard
                        key={w.id}
                        href={`/weapons/${w.slug}`}
                        name={w.name}
                        rarity={w.rarity}
                        type={w.type}
                        img={w.img}
                        />
                    ))}
            </section>
            </main>
             </div>
        </>
  );
}

export default Weapons;

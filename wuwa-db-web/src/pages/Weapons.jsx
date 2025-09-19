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



    const [query, setQuery] = useState("");
    const [rarity, setRarity] = useState("all");  
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
        <div className="flex flex-col items-center w-full mb-12">
            <h1 className="mt-8 text-xl text-[color:var(--accent)] font-semibold">Wuthering Waves Weapons</h1>
            <div className="flex flex-col w-full"> 
              <div className="my-4
              flex items-center justify-center
              gap-1 px-20">
                <input 
                    type="search"
                    placeholder="Search weapons..."
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                    className="pl-1 border-2 border-solid border-[#3c445d]
              bg-[#ffffff08] rounded-[12px] h-8"
                />

                <select
                value={rarity}
                onChange={(e)=>setRarity(e.target.value)}
                className="pl-1 border-2 border-solid border-[#3c445d]
              bg-[#ffffff08] rounded-[12px] cursor-pointer h-8 w-20"
                >
                <option value="all">All</option>
                {rarityOptions.map((r) => (
                    <option key={r} value={r}>{r} stars</option>
                ))}
                </select>

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="pl-1 border-2 border-solid border-[#3c445d]
              bg-[#ffffff08] rounded-[12px]  cursor-pointer h-8 w-20"
                    >
                    <option value="all">All</option>
                        {typeOptions.map((t) => (
                        <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)} 
                        </option>
                    ))}
                </select>
              </div>
              

            <div className="grid grid-cols-2 gap-y-4 justify-items-center px-12 place-self-center gap-x-2
            md:grid-cols-4 md:w-2xl
            lg:w-4xl
            2xl:grid-cols-6 2xl:w-7xl">
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
            </div>
             </div>
        </div>
  );
}

export default Weapons;

import { useEffect, useState, useMemo } from "react";
import CharacterCard from "../components/CharacterCard.jsx";
import "../assets/css/characters.css";
import yangyang from "../assets/images/stickers/yangyang_crying.png";
import sword from "../assets/images/stats/sword.png" 
import rectifier from "../assets/images/stats/rectifier.png" 
import broadblade from "../assets/images/stats/broadblade.png" 
import pistol from "../assets/images/stats/pistol.png" 
import gauntlet from "../assets/images/stats/gauntlet.png" 
import fusion from "../assets/images/element/fusion.webp"
import aero from "../assets/images/element/aero.webp"
import spectro from "../assets/images/element/spectro.webp"
import havoc from "../assets/images/element/havoc.webp"
import electro from "../assets/images/element/electro.webp"
import glacio from "../assets/images/element/glacio.webp"

const ELEMENT_ICON = {
  Fusion: fusion,
  Aero: aero,
  Spectro: spectro,
  Havoc: havoc,
  Electro: electro,
  Glacio: glacio,
};


const WEAPON_ICON = {
  sword,
  rectifier,
  broadblade,
  pistol,       
  gauntlet,     
};

const API = "https://api.wuwa-db-api.com/v1/characters";

const ALL = "all";
const norm = (s = "") => String(s).toLowerCase();


function Characters() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");

    const [rarity,  setRarity]  = useState(ALL);
    const [weapon,  setWeapon]  = useState(ALL); 
    const [element, setElement] = useState(ALL); 

    useEffect(() => {
        (async () => {
        try {
            setLoading(true);
            const res = await fetch(API, { headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error("Failed to fetch characters");
            const data = await res.json();
            setCharacters(Array.isArray(data) ? data : (data.items || []));
        } catch (err) {
            setError(err.message || String(err));
        } finally {
            setLoading(false);
        }
        })();
    }, []);


    const rarityOptions  = useMemo(
        () => [ALL, ...Array.from(new Set(characters.map(c => String(c.rarity)))).sort()],
        [characters]
    );
    const weaponOptions = useMemo(
    () =>
        Array.from(new Set(characters.map(c => c.weapon_type)))
        .filter(w => WEAPON_ICON[w])  
        .sort(),
    [characters]
    );
    const elementOptions = useMemo(
        () => [ALL, ...Array.from(new Set(characters.map(c => c.element))).sort()],
        [characters]
    );

    const resetAll = () => {
        setQuery("");
        setRarity(ALL);
        setWeapon(ALL);
        setElement(ALL);
    };

    const filtered = useMemo(() => {
        const q = norm(query);
        return characters.filter(c => {
            const passName   = q === "" ? true : norm(c.name).includes(q);
            const passRarity = rarity  === ALL ? true : String(c.rarity)   === rarity;
            const passWeapon = weapon  === ALL ? true : c.weapon_type      === weapon;
            const passElem   = element === ALL ? true : c.element          === element;
            return passName && passRarity && passWeapon && passElem;
            });
    }, [characters, query, rarity, weapon, element]);

    if (loading) return <p>Loading…</p>;
    if (error)   return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="main-character-page">
        <h1>Wuthering Waves Characters</h1>

            <div className="char-filter">
                <input
                type="search"
                placeholder="Search characters…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="char-filter-search"
                />
                <label>
                    <select className="char-filter-rarity" value={rarity} onChange={(e) => setRarity(e.target.value)}>
                        {rarityOptions.map(r => (
                        <option key={r} value={r}>{r === ALL ? "All" : `${r}★`}</option>
                        ))}
                    </select>
                </label>
            </div>

        <div className="char-option">
            <div className="char-option-weapon">
                {weaponOptions.map(w => (
                <button
                    key={w}
                    role="radio"
                    className={`icon-btn ${weapon === w ? "is-active" : ""}`}
                    onClick={() => setWeapon(weapon === w ? ALL : w)}
                    title={w}
                >
                    <img src={WEAPON_ICON[w]} alt="" />
                </button>
                ))}
            </div>
            <div className="char-option-element">
            {elementOptions
                .filter(el => ELEMENT_ICON[el]) 
                .map(el => {
                const active = element === el;
                return (
                    <button
                    key={el}
                    type="button"
                    role="radio"
                    className={`icon-btn ${active ? "is-active" : ""}`}
                    onClick={() => setElement(active ? ALL : el)}  
                    title={el}
                    >
                    <img src={ELEMENT_ICON[el]} />
                    </button>
                );
                })}
            </div>
            <button
                type="button"
                onClick={resetAll}
                className="reset-btn"
            >
                Reset 
            </button>
        </div>

        <div className="char-grid">
            {filtered.length ? (
            filtered.map(c => (
                <CharacterCard
                key={c.id}
                id={c.id}
                name={c.name}
                rarity={c.rarity}
                element={c.element}
                />
            ))
            ) : (
            <div className="empty-state">
                <img src={yangyang} alt="" />
                <p>No matches found. Try changing the filter.</p>
            </div>
            )}
        </div>
        </div>
  );
}

export default Characters;

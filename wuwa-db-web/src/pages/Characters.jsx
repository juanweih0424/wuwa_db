import { useEffect, useState } from "react";
import CharacterCard from "../components/CharacterCard.jsx"
import "../assets/css/characters.css"

const API = "https://api.wuwa-db-api.com/v1/characters";

function Characters(){
    
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function fetchCharacters() {
        try {
            const res = await fetch(API, {
            headers: { Accept: "application/json" }
            });
            if (!res.ok) throw new Error("Failed to fetch characters");
            const data = await res.json();
            setCharacters(data); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }

        fetchCharacters();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="main-character-page">
            <h1>Wuthering Waves Characters</h1>
            <div className="char-grid">
                {characters.map((c)=> (
                    <CharacterCard
                    key={c.id}
                    id={c.id}
                    name={c.name}
                    rarity={c.rarity}
                    element={c.element}
                    />
                ))}
            </div>
        </div>
    );
}

export default Characters;
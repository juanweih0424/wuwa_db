import React from 'react'
import "../assets/css/tierlist.css"
import { useEffect,useState } from 'react'
import CharacterCardTier from '../components/CharacterCardTier.jsx'
import { tier_dps,tier_sub,tier_sup } from '../utils/tier.js'


const API = "https://api.wuwa-db-api.com/v1/characters";

export default function Tierlist() {
    const [error, setError] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

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
    if (loading) return <p>Loading…</p>;
    if (error)   return <p style={{ color: "red" }}>Error: {error}</p>;

    const t05dps = characters.filter((char) => {
        for (let i = 0; i < tier_dps.T05.length; i++) {
            if (char.id === tier_dps.T05[i]) {
            return true;
            }
        }
        return false;
        });

    const t0dps = characters.filter((char) => {
        for (let i = 0; i < tier_dps.T0.length; i++) {
            if (char.id === tier_dps.T0[i]) {
            return true;
            }
        }
        return false;
        });

        
        const t0sub = characters.filter((char) => {
        for (let i = 0; i < tier_sub.T0.length; i++) {
            if (char.id === tier_sub.T0[i]) {
            return true;
            }
        }
        return false;
        });


        const t05sub = characters.filter((char) => {
        for (let i = 0; i < tier_sub.T05.length; i++) {
            if (char.id === tier_sub.T05[i]) {
            return true;
            }
        }
        return false;
        });
        const t0sup = characters.filter((char) => {
        for (let i = 0; i < tier_sup.T0.length; i++) {
            if (char.id === tier_sup.T0[i]) {
            return true;
            }
        }
        return false;
        });
        const t05sup = characters.filter((char) => {
        for (let i = 0; i < tier_sup.T05.length; i++) {
            if (char.id === tier_sup.T05[i]) {
            return true;
            }
        }
        return false;
        });
        const t1dps = characters.filter((char) => {
        for (let i = 0; i < tier_dps.T1.length; i++) {
            if (char.id === tier_dps.T1[i]) {
            return true;
            }
        }
        return false;
        });

        const t1sub = characters.filter((char) => {
        for (let i = 0; i < tier_sub.T1.length; i++) {
            if (char.id === tier_sub.T1[i]) {
            return true;
            }
        }
        return false;
        });
        const t1sup = characters.filter((char) => {
        for (let i = 0; i < tier_sup.T1.length; i++) {
            if (char.id === tier_sup.T1[i]) {
            return true;
            }
        }
        return false;
        });

        const t2dps = characters.filter((char) => {
        for (let i = 0; i < tier_dps.T2.length; i++) {
            if (char.id === tier_dps.T2[i]) {
            return true;
            }
        }
        return false;
        });

        const t2sub = characters.filter((char) => {
        for (let i = 0; i < tier_sub.T2.length; i++) {
            if (char.id === tier_sub.T2[i]) {
            return true;
            }
        }
        return false;
        });
        const t2sup = characters.filter((char) => {
        for (let i = 0; i < tier_sup.T2.length; i++) {
            if (char.id === tier_sup.T2[i]) {
            return true;
            }
        }
        return false;
        });

        const t3dps = characters.filter((char) => {
        for (let i = 0; i < tier_dps.T3.length; i++) {
            if (char.id === tier_dps.T3[i]) {
            return true;
            }
        }
        return false;
        });

        const t3sub = characters.filter((char) => {
        for (let i = 0; i < tier_sub.T3.length; i++) {
            if (char.id === tier_sub.T3[i]) {
            return true;
            }
        }
        return false;
        });
        const t3sup = characters.filter((char) => {
        for (let i = 0; i < tier_sup.T3.length; i++) {
            if (char.id === tier_sup.T3[i]) {
            return true;
            }
        }
        return false;
        });
     
  return (
    <div className='flex flex-col w-full p-8'>
        <p className='text-[var(--accent)] font-semibold text-center text-lg xl:text-2xl'>Tier List</p>
        <div className='mt-4'>
            <p className='text-lg font-semibold tracking-tight text-center xl:text-xl xl:text-left'>Criteria</p>
            <ul className='list-style mt-2'>
                <li>
                    <span className='strong-word'>Source:</span> This tier list is based on <span className='strong-word'>TOA</span> and <span className='strong-word'>WW</span> evaluations.
                </li>

                <li>
                    <span className='strong-word'>Characters:</span>
                    <ul className='list-style pl-8'>
                        <li>
                            Default tier list assumes S0 R1 — base character (0 Resonance) with their signature weapon at R1.
                        </li>

                    </ul>
                </li>
                <li>
                    <span className='strong-word'>Echoes:</span>
                    <ul className='list-style pl-8'>
                        <li>
                            All characters are equipped with max-level gold Echoes.
                        </li>
                        <li>
                            Echo main stats are assumed to be best-in-slot for each character.
                        </li>
                        <li>
                            Each Echo is assumed to have average 5 sub-stats, with 15 “good” rolls (endgame quality) and 10 random rolls.
                        </li>
                    </ul>
                </li>

                <li>
                    <span className='strong-word'>Weapons:</span>
                    <ul className='list-style pl-8'>
                        <li>
                            All characters use their signature weapon at the specified refinement level (R1).
                        </li>
                        <li>
                            If no signature weapon exists, best available alternatives are used.
                        </li>
                    </ul>
                </li>
                <li>
                    <span className='strong-word'>Team & Rotation:</span> Characters are evaluated as part of their best 3-man team, with optimal rotations and correct energy regeneration.
                </li>
                <li>
                    <span className='strong-word'>Content:</span>
                    <ul className='list-style pl-8'>
                        <li>
                            Rankings reflect general performance across all current game content (not just a single boss or event).
                        </li>
                        <li>
                            Assessments assume maximum character level and fully upgraded Forte trees.
                        </li>
                    </ul>
                </li>

            </ul>
        </div>
        
        <div className='flex flex-col mt-4 gap-y-4 xl:mt-12'>
            <div className='border-2 border-solid border-[color:#de3a28] flex flex-col
            xl:grid xl:grid-cols-[4%_1fr_1fr_1fr]'>
                <div className='bg-[#de3a28] flex justify-center items-center'>
                    <p className='text-base xl:text-xl'>T0</p>
                </div>
                <div className='section-1 bg-[#343541]'>
                    
                    <p className='sub-section text-[#f51e07]'>Main DPS</p>
                    <div className='tier-content'>
                        {t0dps.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-2 bg-[#2f3038]'>
                    <p className='sub-section text-[#d745ff]'>Secondary DPS</p>
                    <div className='tier-content'>
                        {t0sub.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-1 bg-[#343541]'>
                    <p className='sub-section text-[#45a2ff]'>Support</p>
                    <div className='tier-content'>
                        {t0sup.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='border-2 border-solid border-[color:#ff642b] flex flex-col
            xl:grid xl:grid-cols-[4%_1fr_1fr_1fr]'>
                <div className='bg-[#ff642b] flex justify-center items-center'>
                    <p className='text-base xl:text-xl'>T0.5</p>
                </div>
                <div className='section-1 bg-[#343541]'>
                    
                    <p className='sub-section text-[#f51e07]'>Main DPS</p>
                    <div className='tier-content'>
                        {t05dps.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-2 bg-[#2f3038]'>
                    <p className='sub-section text-[#d745ff]'>Secondary DPS</p>
                    <div className='tier-content'>
                        {t05sub.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-1 bg-[#343541]'>
                    <p className='sub-section text-[#45a2ff]'>Support/Healer</p>
                    <div className='tier-content'>
                        {t05sup.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='border-2 border-solid border-[color:#ffa02b] flex flex-col
            xl:grid xl:grid-cols-[4%_1fr_1fr_1fr]'>
                <div className='bg-[#ffa02b] flex justify-center items-center'>
                    <p className='text-base xl:text-xl'>T1</p>
                </div>
                <div className='section-1 bg-[#343541]'>
                    
                    <p className='sub-section text-[#f51e07]'>Main DPS</p>
                    <div className='tier-content'>
                        {t1dps.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-2 bg-[#2f3038]'>
                    <p className='sub-section text-[#d745ff]'>Secondary DPS</p>
                    <div className='tier-content'>
                        {t1sub.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-1 bg-[#343541]'>
                    <p className='sub-section text-[#45a2ff]'>Support/Healer</p>
                    <div className='tier-content'>
                        {t1sup.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className='border-2 border-solid border-[color:#fac584] flex flex-col
            xl:grid xl:grid-cols-[4%_1fr_1fr_1fr]'>
                <div className='bg-[#fac584] flex justify-center items-center'>
                    <p className='text-base xl:text-xl'>T2</p>
                </div>
                <div className='section-1 bg-[#343541]'>
                    
                    <p className='sub-section text-[#f51e07]'>Main DPS</p>
                    <div className='tier-content'>
                        {t2dps.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-2 bg-[#2f3038]'>
                    <p className='sub-section text-[#d745ff]'>Secondary DPS</p>
                    <div className='tier-content'>
                        {t2sub.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-1 bg-[#343541]'>
                    <p className='sub-section text-[#45a2ff]'>Support/Healer</p>
                    <div className='tier-content'>
                        {t2sup.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className='border-2 border-solid border-[color:#1dc257] flex flex-col
            xl:grid xl:grid-cols-[4%_1fr_1fr_1fr]'>
                <div className='bg-[#1dc257] flex justify-center items-center'>
                    <p className='text-base xl:text-xl'>T3</p>
                </div>
                <div className='section-1 bg-[#343541]'>
                    
                    <p className='sub-section text-[#f51e07]'>Main DPS</p>
                    <div className='tier-content'>
                        {t3dps.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-2 bg-[#2f3038]'>
                    <p className='sub-section text-[#d745ff]'>Secondary DPS</p>
                    <div className='tier-content'>
                        {t3sub.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
                <div className='section-1 bg-[#343541]'>
                    <p className='sub-section text-[#45a2ff]'>Support/Healer</p>
                    <div className='tier-content'>
                        {t3sup.map((char) => (
                            <CharacterCardTier
                            key={char.id}
                            id={char.id}
                            name={char.name}
                            rarity={char.rarity}
                            element={char.element}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>



    </div>
  )
}

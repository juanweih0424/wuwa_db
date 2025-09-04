import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getCharacterFullIcon, getElementIcon,getCharacterIcon } from "../utils/characters.js";
import "../assets/css/characterdetail.css";
import WeaponCard from "../components/WeaponCard.jsx"
import { slugify, getWeaponImageUrl } from "../utils/weapons.js";
import { getEchoSetImageUrl } from "../utils/echo.js";

import atk from "../assets/images/stats/atk.png";
import critdmg from "../assets/images/stats/critdmg.png";
import critrate from "../assets/images/stats/critrate.png";
import def from "../assets/images/stats/def.png";
import energy from "../assets/images/stats/energy.png";
import hp from "../assets/images/stats/hp.png";
import sword from "../assets/images/stats/sword.png" 

const API = "https://api.wuwa-db-api.com/v1/characters";
const WEAPON_API = "https://api.wuwa-db-api.com/v1/weapons";

const fmtPct = (v) => `${Math.round(v * 100)}%`;
const fmtNum = (v) => v.toLocaleString();

const MIN_LV = 1;
const MAX_LV = 90;
const lerpStat = (base, max, lv) =>
Math.round(base + (max - base) * ((lv - MIN_LV) / (MAX_LV - MIN_LV)));


const weaponIcons = {
  sword
};

export function getWeaponIcon(type) {
  return weaponIcons[type.toLowerCase()] ?? null;
}

function highlightDamageTypes(text) {
    if (!text) return "";

    return text
    .replace(
        /\b(Fusion|Aero|Glacio|Electro|Spectro|Havoc|Aero Erosion) DMG\b/g,
        (match, element) => `<span class="dmg">${match}</span>`
    )
    .replace(
      /\b(Basic Attack|Resonance Skill|Resonance Liberation|Heavy Attack)\b/g,
      `<span class="keyword">$&</span>`
    );
}

function CharacterDetail() {
    const { name } = useParams(); 
    const [character, setCharacter] = useState(null);
    const [error, setError] = useState(null);
    const [level, setLevel] = useState(90);
    const [weapon, setWeapon] = useState(null);
    const [weaponErr, setWeaponErr] = useState(null);
    const [echoSets, setEchoSets] = useState([]);
    
    useEffect(() => {
    fetch("https://api.wuwa-db-api.com/v1/echoes/sets")
        .then((res) => res.json())
        .then((data) => setEchoSets(data))
        .catch((err) => console.error("Failed to fetch echo sets:", err));
    }, []);

    useEffect(() => {
        if (!character?.best_weapon) return;

        const ac = new AbortController();

        (async () => {
        try {
            const res = await fetch(`${WEAPON_API}/${character.best_weapon}`, {
            signal: ac.signal,
            headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setWeapon(data);
            setWeaponErr(null);
        } catch (err) {
            if (err.name !== "AbortError") setWeaponErr(err.message || String(err));
        }
        })();

        return () => ac.abort();
    }, [character?.best_weapon]);
  
    useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("Failed to fetch characters");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.characters ?? [];
        const found = list.find((c) => slugify(c.name) === name);
        setCharacter(found ?? null);
        if (!found) setError("Character not found");
      } catch (e) {
        setError(e.message);
      }
    })();
    }, [name]);

    const scaled = useMemo(() => {
        if (!character) return null;
        const { HP, ATK, DEF, crit_rate, crit_dmg, energy } = character.stats;
        return {
        HP: lerpStat(HP.base, HP.max, level),
        ATK: lerpStat(ATK.base, ATK.max, level),
        DEF: lerpStat(DEF.base, DEF.max, level),
        crit_rate,
        crit_dmg,
        energy,
        };
    }, [character, level]);

    const pct = useMemo(
        () => ((level - MIN_LV) / (MAX_LV - MIN_LV)) * 100,
        [level]
    );

    if (error) return <div>Error: {error}</div>;
    if (!character || !scaled) return <div>Loading…</div>;
    
    const portrait = getCharacterFullIcon(character.id);     
    const elementIcon = getElementIcon(character.element);
    const weaponIcon = getWeaponIcon(character.weapon_type);   
    const charIcon = getCharacterIcon(character.id);
    const charEchoSetId = character.echo_set?.[0]
    const charEchoSet = echoSets.find((set) => set.id === charEchoSetId);
    const echoSetImg = charEchoSet ? getEchoSetImageUrl(charEchoSet.id) : null;

    const rows = [
        { key: "hp",     label: "HP",         value: fmtNum(scaled.HP),        icon: hp },
        { key: "atk",    label: "ATK",        value: fmtNum(scaled.ATK),       icon: atk },
        { key: "def",    label: "DEF",        value: fmtNum(scaled.DEF),       icon: def },
        { key: "cr",     label: "Crit. Rate", value: fmtPct(scaled.crit_rate), icon: critrate },
        { key: "cd",     label: "Crit. DMG",  value: fmtPct(scaled.crit_dmg),  icon: critdmg },
        { key: "energy", label: "Max Energy", value: fmtNum(scaled.energy),    icon: energy },
    ];

    const weaponCard = weapon && {
        href: `/weapons/${slugify(weapon.name)}`,
        name: weapon.name,
        img: getWeaponImageUrl(weapon.name),   
        rarity: weapon.rarity,
        type: weapon.type,
    };

    

    return (
        <div className="char-detail-main" char-rarity={character.rarity} data-element={character.element}>
            <div className="char-detail-info">
                <img className="char-detail-icon" src={portrait}/>
                <div className="char-detail-info-stats">
                <div className="char-detail-info-stats-header">

                    <h1 className="char-detail-name">
                    {character.name} <span className="star">{character.rarity}★</span>
                    </h1>
                    <div className="icon-wrapper">
                        <div className="weapon-icon-wrapper">
                            <img src={weaponIcon} className="weapon-icon"/>
                            <span>{character.weapon_type}</span>
                        </div>
                        <div className="element-icon-wrapper">
                            <img className="element-icon" src={elementIcon} />
                            <span>{character.element}</span>
                        </div>
                    </div>
                </div>
                <p className="char-about">
                    {character.description}
                </p>        
                <div className="char-level">
                    <div className="char-level-top">
                        <div className="lv">
                            <p>Lv</p> 
                            <p>{level}</p>
                        </div>
                    </div>
                    <input
                    type="range"
                    min={MIN_LV}
                    max={MAX_LV}
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    style={{ '--p': `${pct}%` }}
                    className="level-slider"
                    />
                </div>

                <div className="char-stats">
                    {rows.map((r) => (
                    <div className="stat-row" key={r.key}>
                        <div className="left">
                        <img className="substats-icon" src={r.icon} />
                        <span className="label">{r.label}</span>
                        </div>
                        <div className="right">{r.value}</div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            <h1 className="char-skill-big-title">{character.name} Skills</h1>
            <div className="char-skill">
                <div className="char-skill-basic">
                    <div className="wrapper-title-name">
                        <h2 className="char-skill-title">Basic Attack</h2>
                        <h3 className="char-skill-name">{character.active_skills.basic_attack.name}</h3>
                    </div>
                    <ul className="char-skill-list">
                        {Object.entries(character.active_skills.basic_attack.details || {}).map(
                            ([label, text]) => (
                                <li key={label} className="char-skill-row">
                                <h3 className="char-skill-sub">{label}</h3>
                                <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(text) }}/>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="char-skill-skill">
                    <div className="wrapper-title-name">
                        <h2 className="char-skill-title">Resonance Skill</h2>
                        <h3 className="char-skill-name">{character.active_skills.resonance_skill.name}</h3>
                    </div>
                    <ul className="char-skill-list">
                        {Object.entries(character.active_skills.resonance_skill.details || {}).map(
                            ([label, text]) => (
                                <li key={label} className="char-skill-row">
                                <h3 className="char-skill-sub">{label}</h3>
                                <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(text) }}/>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="char-skill-liberation">
                    <div className="wrapper-title-name">
                        <h2 className="char-skill-title">Resonance Liberation</h2>
                        <h3 className="char-skill-name">{character.active_skills.resonance_liberation.name}</h3>
                    </div>
                    <ul className="char-skill-list">
                        {Object.entries(character.active_skills.resonance_liberation.details || {}).map(
                            ([label, text]) => (
                                <li key={label} className="char-skill-row">
                                <h3 className="char-skill-sub">{label}</h3>
                                <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(text) }}/>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="char-skill-forte">
                    <div className="wrapper-title-name">
                        <h2 className="char-skill-title">Forte Circuit</h2>
                        <h3 className="char-skill-name">{character.forte_circuit.name}</h3>
                    </div>
                    <ul className="char-skill-list">
                        {Object.entries(character.forte_circuit.details || {}).map(
                            ([label, text]) => (
                                <li key={label} className="char-skill-row">
                                <h3 className="char-skill-sub">{label}</h3>
                                <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(text) }}/>
                                </li>
                            )
                        )}
                    </ul>
                </div>

                <div className="char-skill-inherent">
                    <div className="inherent1">
                        <div className="wrapper-title-name">
                            <h2 className="char-skill-title">Inherent Skill 1</h2>
                            <h3 className="char-skill-name">{character.inherent_skill1.name}</h3>
                        </div>
                        <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.inherent_skill1.description) }}/>
                    
                    </div>
                    <div className="inherent2">
                        <div className="wrapper-title-name">
                            <h2 className="char-skill-title">Inherent Skill 2</h2>
                            <h3 className="char-skill-name">{character.inherent_skill2.name}</h3>
                        </div>
                        <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.inherent_skill2.description) }}/>
                    </div>
                </div>
                <div className="char-skill-inout">
                    <div className="intro">
                        <div className="wrapper-title-name">
                            <h2 className="char-skill-title">Intro Skill</h2>
                            <h3 className="char-skill-name">{character.intro_skill.name}</h3>
                        </div>
                        <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.intro_skill.description) }}/>
                    </div>
                    <div className="outro">
                        <div className="wrapper-title-name">
                            <h2 className="char-skill-title">Outro Skill</h2>
                            <h3 className="char-skill-name">{character.outro_skill.name}</h3>
                        </div>
                        <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.outro_skill.description) }}/>
                    </div>
                </div>
            </div>
            <div className="char-chain">
                <h2 className="char-skill-title">Resonance Chain</h2>
                <div className="char-chain-detail">
                    <h3 className="char-skill-name">S1</h3>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s1) }}/>
                </div>
                <div className="char-chain-detail">
                    <h3 className="char-skill-name">S2</h3>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s2) }}/>
                </div>
                <div className="char-chain-detail">
                    <h3 className="char-skill-name">S3</h3>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s3) }}/>
                </div>
                <div className="char-chain-detail">
                    <h3 className="char-skill-name">S4</h3>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s4) }}/>
                </div>
                <div className="char-chain-detail">
                    <h3 className="char-skill-name">S5</h3>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s5) }}/>
                </div>
                <div className="char-chain-detail">
                    <h3 className="char-skill-name">S6</h3>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s6) }}/>
                </div>
            </div>
            <h1 className="char-skill-big-title">{character.name} Best Build</h1>
            <div className="char-build">
                    <img src={charIcon} className="char-build-icon"/>
                    <div className="char-build-wrapper">
                        <h1>Best Weapon</h1>
                        {weaponCard && (
                            <WeaponCard
                                href={weaponCard.href}
                                name={weaponCard.name}
                                img={weaponCard.img}
                                rarity={weaponCard.rarity}
                                type={weaponCard.type}
                                className="char-weapon-card"
                            />
                        )}
                    </div>
                    {charEchoSet && (
                    <div className="char-build-echoset">
                        <div className="echo-set-icon-title">
                            <img
                            src={getEchoSetImageUrl(charEchoSet.id)}
                            className="echo-set-icon"
                            />
                            <p>{charEchoSet.name}</p>
                        </div>
                        <div className="echo-set-effect">
                            {charEchoSet.effect?.["2pc"] && (
                            <p><strong>2pc:</strong> {charEchoSet.effect["2pc"]}</p>
                            )}
                            {charEchoSet.effect?.["5pc"] && (
                            <p><strong>5pc:</strong> {charEchoSet.effect["5pc"]}</p>
                            )}
                        </div>
                    </div>
                    )}
                </div>

        </div>
    );
}

export default CharacterDetail;
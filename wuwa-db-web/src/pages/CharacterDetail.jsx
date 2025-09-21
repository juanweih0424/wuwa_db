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
import rectifier from "../assets/images/stats/rectifier.png" 
import broadblade from "../assets/images/stats/broadblade.png" 
import pistol from "../assets/images/stats/pistol.png" 
import gauntlet from "../assets/images/stats/gauntlet.png" 

const API = "https://api.wuwa-db-api.com/v1/characters";
const WEAPON_API = "https://api.wuwa-db-api.com/v1/weapons";

const fmtPct = (v) => `${Math.round(v * 100)}%`;
const fmtNum = (v) => v.toLocaleString();

const MIN_LV = 1;
const MAX_LV = 90;
const lerpStat = (base, max, lv) =>
Math.round(base + (max - base) * ((lv - MIN_LV) / (MAX_LV - MIN_LV)));


const weaponIcons = {
  sword,
  rectifier,
  gauntlet,
  broadblade,
  pistol
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

function EchoSetCard({ set, pieceKey }) {
  if (!set) return null;
  const effect = set.effect?.[pieceKey];
  return (
    <div className="flex flex-col gap-y-2 items-center md:items-start">
      <div className="flex justify-center items-center gap-x-2">
        <img src={getEchoSetImageUrl(set.id)} className="w-6 h-6" />
        <p className="text-[var(--accent)] font-semibold">{set.name}</p>
      </div>
      {effect && (
        <div className="flex justify-center">
          <p>
            <strong className="text-[var(--accent)] font-semibold">{pieceKey}:</strong> {effect}
          </p>
        </div>
      )}
    </div>
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
    const echoIds = character.echo_set ?? [];
    const primaryEchoSet   = echoSets.find((s) => s.id === echoIds[0]);
    const secondaryEchoSet = echoSets.find((s) => s.id === echoIds[1]);

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
        <div className="flex flex-col items-center gap-6 bg-[#FFFFFF08]
        border border-solid border-[color:#FFFFFF1A] rounded-[16px] p-8
        shadow-[0_8px_24px_rgba(0,0,0,0.3)] w-full" 
        char-rarity={character.rarity} data-element={character.element}>
            <div className="flex flex-col gap-y-4 xl:flex-row xl:w-full xl:gap-x-6 xl:justify-center">
            <div className="flex flex-col gap-y-4 items-center xl:flex-col xl:gap-x-8">

            <img className="object-contain w-80 h-100 xl:w-140 xl:h-140" src={portrait}/>
            <div className="hidden w-full items-center border border-solid border-[color:#FFFFFF1A] rounded-[16px] p-4
            shadow-[0_8px_24px_rgba(0,0,0,0.3)] gap-y-4 xl:flex xl:flex-col xl:w-2xl
            ">
                <div className="flex gap-x-8 md:gap-x-2 md:min-w-70
                lg:min-w-90 xl:min-w-90 xl:justify-evenly">
                    <img src={charIcon} className="w-32 h-32 border-2 border-solid
                    md:w-35 md:h-37
                    lg:h-46 lg:w-46
                     rounded-3xl border-[color:var(--accent)]"/>
                        {weaponCard && (
                            <WeaponCard
                                href={weaponCard.href}
                                name={weaponCard.name}
                                img={weaponCard.img}
                                rarity={weaponCard.rarity}
                                type={weaponCard.type}
                            />
                        )}
                </div>
                        {echoIds.length === 1 && primaryEchoSet && (
                        <div className="flex flex-col lg:w-full lg:h-full justify-center xl:items-start">
                            <div className="flex gap-2 justify-center items-center mt-1 xl:items-start">
                                <img src={getEchoSetImageUrl(primaryEchoSet.id)}
                                 className="w-6 h-6" alt={primaryEchoSet.name} />
                                <p className="text-[var(--accent)] text-lg">{primaryEchoSet.name}</p>
                                </div>
                                <div className="flex flex-col items-center gap-y-1 xl:items-start">
                                {["2pc", "3pc", "5pc"].map((setKey) =>
                                    primaryEchoSet?.effect?.[setKey] && (
                                    <div key={setKey} className="flex flex-col items-center xl:items-start ">
                                    <p className="text-[var(--accent)] font-semibold">{setKey}</p>
                                    <p className="text-center">{primaryEchoSet.effect[setKey]}</p>
                                    </div>
                                    )
                                )}
                            </div>
                        </div>
                        )}
                        {echoIds.length === 2 && (
                        <div className="flex flex-col gap-y-4">
                            <EchoSetCard set={secondaryEchoSet} pieceKey="2pc" />
                            <EchoSetCard set={primaryEchoSet} pieceKey="3pc" />
                        </div>
                        )}
            </div>
                <div className="flex 
                flex-col gap-y-4 xl:hidden">
                    <div className="xl:flex-row xl:justify-between xl:items-center xl:px-2 flex flex-col gap-y-4">
                    <p className="text-[var(--text)] text-center text-xl ">
                        {character.name} {character.rarity}★
                    </p>
                    <div className="flex justify-center gap-x-4">
                        <div className="weapon-icon-wrapper">
                            <img src={weaponIcon} className="w-6 h-6"/>
                            <p className="capitalize">{character.weapon_type}</p>
                        </div>
                        <div className="element-icon-wrapper">
                            <img className="w-6 h-6" src={elementIcon} />
                                <p>{character.element}</p>
                        </div>
                    </div>
                    </div>
                    <p className="border border-solid border-[color:#FFFFFF1A] 
                    px-4 py-2 bg-[#FFFFFF08] rounded-t-[16px] rounded-b-[8px]
                    shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                        {character.description}
                    </p>
                </div>
            </div> 
        <div className="w-full flex flex-col items-center gap-8 bg-[#FFFFFF08]
        border border-solid border-[color:#FFFFFF1A] rounded-[16px] p-4
        shadow-[0_8px_24px_rgba(0,0,0,0.3)] xl:w-4xl xl:gap-y-16">
                <div className="hidden 
                flex-col gap-y-4 xl:flex">
                    <div className="xl:flex-row xl:justify-between xl:items-center xl:px-2 flex flex-col gap-y-4">
                    <p className="text-[var(--text)] text-center text-xl ">
                        {character.name} {character.rarity}★
                    </p>
                    <div className="flex justify-center gap-x-4">
                        <div className="weapon-icon-wrapper">
                            <img src={weaponIcon} className="w-6 h-6"/>
                            <p className="capitalize">{character.weapon_type}</p>
                        </div>
                        <div className="element-icon-wrapper">
                            <img className="w-6 h-6" src={elementIcon} />
                                <p>{character.element}</p>
                        </div>
                    </div>
                    </div>
                    <p className="px-2 pt-2 xl:text-xl">
                        {character.description}
                    </p>
                </div>
                <div className="flex flex-col w-full">
                    <div>
                        <div className="char-level-top">
                            <div className="flex justify-between">
                                <p className="text-base">Lv</p> 
                                <p className="text-base">{level}</p>
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
                    <div className="flex flex-col gap-18 mt-8">
                        {rows.map((r) => (
                        <div className="flex items-center justify-between" key={r.key}>
                            <div className="flex gap-1">
                                <img className="w-5 h-5 xl:w-8 xl:h-8" src={r.icon} />
                                <p className="text-base xl:text-xl">{r.label}</p>
                            </div>
                            <p className="text-base xl:text-xl">{r.value}</p>
                        </div>
                        ))}
                    </div>
                </div>

            
                </div>

            </div>
            <p className="text-[var(--accent)] text-xl font-semibold xl:hidden">{character.name} Builds</p>
            <div className="flex flex-col w-full items-center border border-solid border-[color:#FFFFFF1A] rounded-[16px] p-4
        shadow-[0_8px_24px_rgba(0,0,0,0.3)] gap-y-4 md:flex-row md:gap-x-4 xl:hidden
        ">
                <div className="flex gap-x-8 md:gap-x-2 md:min-w-70
                lg:min-w-90 xl:min-w-115 xl:justify-evenly">
                    <img src={charIcon} className="w-32 h-32 border-2 border-solid
                    md:w-35 md:h-37
                    lg:h-46 lg:w-46
                     rounded-3xl border-[color:var(--accent)]"/>
                        {weaponCard && (
                            <WeaponCard
                                href={weaponCard.href}
                                name={weaponCard.name}
                                img={weaponCard.img}
                                rarity={weaponCard.rarity}
                                type={weaponCard.type}
                            />
                        )}
                </div>
                        {echoIds.length === 1 && primaryEchoSet && (
                        <div className="flex flex-col lg:w-full lg:h-full justify-center xl:items-start">
                            <div className="flex gap-2 justify-center items-center mt-1 xl:items-start">
                                <img src={getEchoSetImageUrl(primaryEchoSet.id)}
                                 className="w-6 h-6" alt={primaryEchoSet.name} />
                                <p className="text-[var(--accent)] text-lg">{primaryEchoSet.name}</p>
                                </div>
                                <div className="flex flex-col items-center gap-y-1 xl:items-start">
                                {["2pc", "3pc", "5pc"].map((setKey) =>
                                    primaryEchoSet?.effect?.[setKey] && (
                                    <div key={setKey} className="flex flex-col items-center xl:items-start ">
                                    <p className="text-[var(--accent)] font-semibold">{setKey}</p>
                                    <p className="text-center">{primaryEchoSet.effect[setKey]}</p>
                                    </div>
                                    )
                                )}
                            </div>
                        </div>
                        )}
                        {echoIds.length === 2 && (
                        <div className="flex flex-col gap-y-4">
                            <EchoSetCard set={secondaryEchoSet} pieceKey="2pc" />
                            <EchoSetCard set={primaryEchoSet} pieceKey="3pc" />
                        </div>
                        )}
            </div>

            <p className="text-[var(--accent)] font-semibold text-xl">{character.name} Skills</p>
            <div className="flex flex-col w-full gap-y-8">
                <div className="char-skill-basic">
                    <div className="wrapper-title-name">
                        <p className="char-skill-title">Basic Attack</p>
                        <p className="char-skill-name">{character.active_skills.basic_attack.name}</p>
                    </div>
                    <ul className="char-skill-list">
                        {Object.entries(character.active_skills.basic_attack.details || {}).map(
                            ([label, text]) => (
                                <li key={label} className="char-skill-row">
                                <p className="char-skill-sub">{label}</p>
                                <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(text) }}/>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="char-skill-skill">
                    <div className="wrapper-title-name">
                        <p className="char-skill-title">Resonance Skill</p>
                        <p className="char-skill-name">{character.active_skills.resonance_skill.name}</p>
                    </div>
                    <ul className="char-skill-list">
                        {Object.entries(character.active_skills.resonance_skill.details || {}).map(
                            ([label, text]) => (
                                <li key={label} className="char-skill-row">
                                <p className="char-skill-sub">{label}</p>
                                <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(text) }}/>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="char-skill-liberation">
                    <div className="wrapper-title-name">
                        <p className="char-skill-title">Resonance Liberation</p>
                        <p className="char-skill-name">{character.active_skills.resonance_liberation.name}</p>
                    </div>
                    <ul className="char-skill-list">
                        {Object.entries(character.active_skills.resonance_liberation.details || {}).map(
                            ([label, text]) => (
                                <li key={label} className="char-skill-row">
                                <p className="char-skill-sub">{label}</p>
                                <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(text) }}/>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div className="char-skill-forte">
                    <div className="wrapper-title-name">
                        <p className="char-skill-title">Forte Circuit</p>
                        <p className="char-skill-name">{character.forte_circuit.name}</p>
                    </div>
                    <ul className="char-skill-list">
                        {Object.entries(character.forte_circuit.details || {}).map(
                            ([label, text]) => (
                                <li key={label} className="char-skill-row">
                                <p className="char-skill-sub">{label}</p>
                                <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(text) }}/>
                                </li>
                            )
                        )}
                    </ul>
                </div>

                    <div className="inherent">
                        <div className="wrapper-title-name">
                            <p className="char-skill-title">Inherent Skill 1</p>
                            <p className="char-skill-name">{character.inherent_skill1.name}</p>
                        </div>
                        <div className="px-2 pb-4">
                            <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.inherent_skill1.description) }}/>
                        </div>
                    </div>
                    <div className="inherent">
                        <div className="wrapper-title-name">
                            <p className="char-skill-title">Inherent Skill 2</p>
                            <p className="char-skill-name">{character.inherent_skill2.name}</p>
                        </div>
                        <div className="px-2 pb-4">
                            <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.inherent_skill2.description) }}/>
                        </div>
                    </div>
                    <div className="intro">
                        <div className="wrapper-title-name">
                            <p className="char-skill-title">Intro Skill</p>
                            <p className="char-skill-name">{character.intro_skill.name}</p>
                        </div>
                        <div className="px-2 pb-4">
                            <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.intro_skill.description) }}/>
                        </div>
                    </div>
                    <div className="outro">
                        <div className="wrapper-title-name">
                            <p className="char-skill-title">Outro Skill</p>
                            <p className="char-skill-name">{character.outro_skill.name}</p>
                        </div>
                        <div className="px-2 pb-4">
                            <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.outro_skill.description) }}/>
                        </div>
                    </div>
            </div>
            <div className="flex flex-col rounded-[15px] px-5 py-3 bg-[rgba(255,255,255,0.02)] 
            shadow-[0_8px_24px_rgba(0,0,0,0.3)] gap-y-4 w-full">
                <p className="text-center text-[var(--accent)] 
                mb-4 text-lg font-semibold">Resonance Chain</p>
                <div className="char-chain-detail">
                    <p className="char-skill-name">S1</p>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s1) }}/>
                </div>
                <div className="char-chain-detail">
                    <p className="char-skill-name">S2</p>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s2) }}/>
                </div>
                <div className="char-chain-detail">
                    <p className="char-skill-name">S3</p>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s3) }}/>
                </div>
                <div className="char-chain-detail">
                    <p className="char-skill-name">S4</p>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s4) }}/>
                </div>
                <div className="char-chain-detail">
                    <p className="char-skill-name">S5</p>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s5) }}/>
                </div>
                <div className="char-chain-detail">
                    <p className="char-skill-name">S6</p>
                    <p className="char-skill-text" dangerouslySetInnerHTML={{ __html: highlightDamageTypes(character.resonance_chain.s6) }}/>
                </div>
            </div>
            

        </div>
    );
}

export default CharacterDetail;
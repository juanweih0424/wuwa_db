// src/pages/WeaponDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { slugify, getWeaponImageUrl, prettySubstat } from "../utils/weapons.js";
import { buildSkillHTML} from "../utils/weapons.js"
import "../assets/css/weapondetail.css"

const API = "https://api.wuwa-db-api.com/v1/weapons";

function calcAtk(base_atk, max_atk, level){
  const increaseV = (max_atk - base_atk) / 89 ;
    
  return (level-1) * increaseV + base_atk;
}

function calcSubstats(base_sub, max_sub, level){
    const base = base_sub * 100;
    const max = max_sub * 100

    if (level == 1){
      return base;
    }
    if (level == 90){
      return max;
    }

    const stepVal = (max - base) / ( 90 / 5 );
    return base + Math.trunc(level/5) * stepVal;

}

function WeaponDetail() {
  const { slug } = useParams();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [level, setLevel] = useState(90);

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

    
    const maxLevel = 90;
    const img = getWeaponImageUrl(weapon.name);
    const skillHTML = buildSkillHTML(weapon?.skill);
    const atk = calcAtk(weapon.stats.atk.base, weapon.stats.atk.max, level);
    const substat = calcSubstats(weapon.stats.substats.base, weapon.stats.substats.max, level);
    const pct = (level - 1) / (maxLevel - 1);
    const left = Math.min(100, Math.max(0, pct * 100)); // clamp

return (
  <main className="weapon-detail">
    <div className="wd-container">
    <header className="wd-hero">
      <img className="wd-icon" data-rarity={weapon.rarity} src={img} alt={`${weapon.name} icon`} />
      <div className="wd-title">
        <h1 className="wd-name" data-rarity={weapon.rarity}>{weapon.name}</h1>

        <div className="stat-pills">
          <div className="stat-pill">
            <span>ATK</span>
            <strong>{atk.toFixed(2)}</strong>
          </div>
          <div className="stat-pill">
            <span>{weapon.stats.substats.kind}</span>
            <strong>{substat.toFixed(2)}%</strong>
          </div>
        </div>
      </div>
    </header>
    </div>

    <div className="level-row" data-rarity={weapon.rarity}>
      <span className="min">1</span>

      <div className="level-wrap"  style={{ '--pct': ((level - 1) / (maxLevel - 1)) * 100 }}>
        <input
          type="range"
          min="1"
          max={maxLevel}
          step="1"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value, 10))}
          className="level-range"
        />
        <div className="slider-badge" >
          Lv {level}
        </div>
      </div>

      <span className="max">{maxLevel}</span>
    </div>
    
    <section className="skill" data-rarity={weapon.rarity}>
      <h2>{weapon?.skill?.name}</h2>
      <p className="skill-text" dangerouslySetInnerHTML={{ __html: skillHTML }} />
      <div className="about">
      <h1>About</h1>
      <p className="description">{weapon?.weapon_description}</p>
      </div>
    </section>
  </main>
  );
}

export default WeaponDetail;

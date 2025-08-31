import { Link } from "react-router-dom";
import "../assets/css/weaponcard.css"


function WeaponCard({ href, name, img, rarity, type }) {

  return (
    <Link to={href} className="weapon-card">
      <div className="weapon-img-wrap">
        <img
          src={img}
          loading="lazy"
        />
      </div>
      <div className="rarity-bar" data-rarity={rarity} />
      <h3 className="weapon-title">{name}</h3>
    </Link>
  );
}

export default WeaponCard;

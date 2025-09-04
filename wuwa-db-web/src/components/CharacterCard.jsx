import { Link } from "react-router-dom";
import { getCharacterIcon, getElementIcon } from "../utils/characters.js";
import "../assets/css/charactercard.css"

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function CharacterCard( {id, name, rarity, element} ){
    const slug = slugify(name);
    const charIcon = getCharacterIcon(id);         
    const elementIcon = getElementIcon(element);

    return (
        <Link to={`/characters/${slug}`} className="char-card" char-rarity={rarity}>
            <div className="char-image-wrapper">
                <img src={charIcon} alt={name} className="char-icon" />
                <img src={elementIcon} alt={element} className="char-element" />
            </div>
            <div className="char-accent-bar"></div>
            <div className="char-name">{name}</div>
        </Link>
    );
}

export default CharacterCard;
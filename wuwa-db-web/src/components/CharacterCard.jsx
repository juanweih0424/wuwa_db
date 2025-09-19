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
        <Link to={`/characters/${slug}`} className="flex flex-col items-center border 
        border-solid rounded-[12px] bg-[#2f3548] border-[color:#FFFFFF1A] text-[#e9ecf1]
        w-24 h-34 hover:scale-[1.05] transition-transform duration-150 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]
        hover:border-[color:var(--accent,#fff)]
        md:w-28 md:h-38
        lg:w-32 lg:h-42
        2xl:w-36 2xl:h-48" 
        char-rarity={rarity}>
            <div className="relative w-full aspect-square">
                <img src={charIcon} alt={name} className="w-full h-full object-cover" />
                <img src={elementIcon} alt={element} className="absolute top-[1px] left-[1px] w-[28px] h-[28px] rounded-full p-[3px]" />
            </div>
            <div className="w-full h-1.25 bg-[var(--accent,#999)]"></div>
            <div className="text-sm place-self-center mt-1
            lg:text-lg
            ">{name}</div>
        </Link>
    );
}

export default CharacterCard;
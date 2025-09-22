import { Link } from "react-router-dom";
import { getCharacterIcon, getElementIcon } from "../utils/characters.js";
import "../assets/css/charactercard.css"

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}



function CharacterCardTier( {id, name, rarity, element, className} ){
    const slug = slugify(name);
    const charIcon = getCharacterIcon(id);         
    const elementIcon = getElementIcon(element);

    const rarityBg =
    rarity === 5
      ? "bg-[#bdbf3f]"
      : rarity === 4
      ? "bg-[#cb13d1]"
      : "bg-black"

    return (
        <Link
        to={`/characters/${slug}`}
        className={`inline-flex flex-col items-center
            border border-solid border-[#FFFFFF1A] bg-[#2f3548] text-[#e9ecf1]
            cursor-pointer hover:scale-[1.08] transition-transform duration-200
            w-24 md:w-28 lg:w-36 xl:w-24 2xl:w-32
            ${rarityBg} ${className || ""}`}
        >
        <div className="relative w-full aspect-square overflow-hidden rounded-[10px]">
            <img src={charIcon} alt={name} className="absolute inset-0 w-full h-full object-cover" />
            <img src={elementIcon} alt={element} className="absolute top-1 left-1 w-6 h-6" />
        </div>
        </Link>

    );
}

export default CharacterCardTier;
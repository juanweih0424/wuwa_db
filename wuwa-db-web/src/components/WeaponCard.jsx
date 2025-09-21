import { Link } from "react-router-dom";
import "../assets/css/weaponcard.css"


function WeaponCard({ href, name, img, rarity, type }) {

  return (
    <Link to={href} className="flex flex-col
    rounded-[12px]
    bg-[#2a2e40]
    border-2 border-[#48506a]
    no-underline
    text-[#e9ecf1]
    shadow-[0_8px_24px_rgba(0,0,0,0.18)]
    transition-[transform,border-color,box-shadow] duration-150 ease-in-out hover:scale-[1.05] hover:bg-[#383c50]
    w-30 h-33
    md:w-34 md:h-37
    lg:w-47 lg:h-47
  ">
      <div className="flex justify-center p-3 overflow-hidden">
        <img
          src={img}
          loading="lazy"
          className="w-15 h-15
          lg:w-25 lg:h-25"
        />
      </div>
      <div className="rarity-bar" data-rarity={rarity} />
      <p className="text-center font-semibold leading-[0.7] pl-2 py-4 text-xs
      lg:text-base">{name}</p>
    </Link>
  );
}

export default WeaponCard;

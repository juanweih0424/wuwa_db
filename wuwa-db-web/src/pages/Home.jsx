import rover_thinking from "../assets/images/stickers/rover_thinking.png"
import clangbang from "../assets/images/stickers/clangbang.webp"
import coin from "../assets/images/stickers/coin.png"
import weapon from "../assets/images/stickers/weapons.webp"
import changli from "../assets/images/stickers/changli_lecturing.png"
import jinhsi from "../assets/images/stickers/jinhsi_writing.webp"
import yangyang from "../assets/images/stickers/yangyang_staring.png"
import "../assets/css/home.css"
import { Link } from "react-router-dom"

function Home(){
    
    return (
    <div className="px-4 pt-12 flex flex-col min-w-full min-h-full items-center
    lg:pt-20">
      <h1 className="text-[color:var(--accent)] text-[length:18px] font-bold text-center
      md:text-[length:24px] md:mb-4
      lg:text-[length:32px]">Wuwa Database – Wuthering Waves Wiki & Database</h1>
      <p className="text-center text-[length:16px]
      md:text-[length:18px]
      lg:text-[length:22px] lg:my-2 
      xl:mx-60
      2xl:mx-100">This is an unofficial, fan-made compendium powered by customized API. Contains information on characters and their best builds, echos, materials, weapons, a tier list and API documentations</p>
      <div className="my-[1rem] mx-auto grid grid-cols-3 gap-x-2 gap-y-2
      xl:grid-cols-4">
        <Link to="/characters" className="home-links">
          <img className="card_img" src={rover_thinking} alt="Characters" />
          <span className="card_description">Characters</span>
        </Link>
        <Link to="/echoes" className="home-links">
          <img className="card_img" src={clangbang}/>
          <span className="card_description">Echoes</span>
        </Link>
        <Link to="/weapons" className="home-links">
          <img className="card_img" src={weapon}/>
          <span className="card_description">Weapons</span>
        </Link>
        <Link to="/builder" className="home-links">
          <img className="card_img" src={changli}/>
          <span className="card_description">Builder</span>
        </Link>
        <Link to="/materials" className="home-links">
          <img className="card_img" src={coin}/>
          <span className="card_description">Materials</span>
        </Link>
        <Link to="/tierlist" className="home-links">
          <img className="card_img" src={yangyang}/>
          <span className="card_description">Tier List</span>
        </Link>
        <a href="https://api.wuwa-db-api.com/" target="_blank" className="home-links">
          <img className="card_img" src={jinhsi}/>
          <span className="card_description">API</span>
        </a>
      </div>
      <p className="my-3 font-semibold text-lg text-center md:my-6 md:text-xl lg:text-2xl">Note: some features are still in development</p>
    </div>
    );
}

export default Home;
import rover_thinking from "../assets/images/stickers/rover_thinking.png"
import clangbang from "../assets/images/stickers/clangbang.webp"
import coin from "../assets/images/stickers/coin.png"
import weapon from "../assets/images/stickers/weapons.webp"
import changli from "../assets/images/stickers/changli_lecturing.png"
import jinhsi from "../assets/images/stickers/jinhsi_writing.webp"
import yangyang from "../assets/images/stickers/yangyang_staring.png"
import "../assets/css/home.css"


function Home(){
    
    return (
    <section className="homebody">
      <h1 className="title">Wuwa Database – Wuthering Waves Wiki & Database</h1>
      <p className="subtitle">This is an unofficial, fan-made compendium powered by customized API. Contains information on characters and their best builds, echos, materials, weapons, a tier list and API documentations</p>
      <section className="card_container">
        <a href="/characters" className="link">
          <img className="card_img" src={rover_thinking}/>
          <span>Characters</span>
        </a>
        <a href="/echoes" className="link">
          <img className="card_img" src={clangbang}/>
          <span>Echoes</span>
        </a>
          <a href="/weapons" className="link">
          <img className="card_img" src={weapon}/>
          <span>Weapons</span>
        </a>
          <a href="/builder" className="link">
          <img className="card_img" src={changli}/>
          <span>Builder</span>
        </a>
          <a href="/materials" className="link">
          <img className="card_img" src={coin}/>
          <span>Materials</span>
        </a>
          <a href="/tierlist" className="link">
          <img className="card_img" src={yangyang}/>
          <span>Tier List</span>
        </a>
          <a href="https://api.wuwa-db-api.com/" target="_blank" className="link">
          <img className="card_img" src={jinhsi}/>
          <span>API Documentation</span>
        </a>
      </section>
      <p className="note">Note: some features are still in development</p>
    </section>
    );
}

export default Home;
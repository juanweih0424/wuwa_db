import React from "react";
import "../assets/css/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faFile } from "@fortawesome/free-solid-svg-icons";

function Footer(){
    const year = new Date().getFullYear()

    return (
        <div className="footer">
            <section className="grid">
            <a href="https://github.com/juanweih0424/wuwa_db/tree/main" target="_blank" rel="noreferrer">
            <div className="card">
                <FontAwesomeIcon icon={faGithub} className="icon" /><p className="cardtext">Github</p>
            </div>
            </a>
            </section>
            <small>© {year}  Wuthering Waves unofficial database. Fan-made and non-commercial. Not affiliated with Kuro Game. All trademarks belong to their owners.</small>
        </div>
    )
}

export default Footer;
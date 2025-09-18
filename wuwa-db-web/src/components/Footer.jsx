import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function Footer(){
    const year = new Date().getFullYear()

    return (
        <div className="bg-[#343541] flex flex-col items-center w-full">
            <a href="https://github.com/juanweih0424/wuwa_db/tree/main" target="_blank" rel="noreferrer">
            <div className="flex my-2 items-center gap-2 w-full">
                <FontAwesomeIcon icon={faGithub} className="!w-4 !h-4
                md:!w-6 md:!h-6
                lg:!w-8 lg:!h-8
                xl:!w-10 xl:!h-10
                hover:scale-[1.05]" />
                <p className="text-sm
                md:text-base
                lg:text-lg
                xl:text-xl">Github</p>
            </div>
            </a>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl">© {year} Wuthering Waves unofficial database. Fan-made and non-commercial. Not affiliated with Kuro Game. All trademarks belong to their owners.
            </p>
        </div>
    )
}

export default Footer;
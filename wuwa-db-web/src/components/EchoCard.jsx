import { Link } from "react-router-dom";
import "../assets/css/echocard.css"


function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


function EchoCard({echo, setsById}){
    const slug = slugify(echo.name);
    const icon = echo.icon;

    const explicitSetIds = Array.isArray(echo.echo_sets)
    ? echo.echo_sets.map(Number)
    : [];

    let derivedSetIds = [];
    if (explicitSetIds.length === 0) {
        derivedSetIds = Object.values(setsById)
        .filter(s => Array.isArray(s?.members) && s.members.map(Number).includes(Number(echo.id)))
        .map(s => Number(s.id));
    }

    const setIds = Array.from(new Set([...explicitSetIds, ...derivedSetIds]));

    const setIcons = setIds
        .map(id => (setsById[id] && setsById[id].icon) || null)
        .filter(Boolean);


    return (
        <Link to={`/echoes/${slug}`} className="echo-card">
            <div className="echo-media">
            <img src={icon} />
            </div>

            <div className="echo-name">{echo.name}</div>

            <div className="echo-sets">
            {setIcons.map((src, i) => (
                <img key={`${setIds[i]}-${i}`} src={src}/>
            ))}
            </div>
        </Link>
    );
}

export default EchoCard;
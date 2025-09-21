import { Link } from "react-router-dom";

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
            <Link
            to={`/echoes/${slug}`}
            className="w-34 h-34 p-2 bg-[#2f3548]
                border border-solid rounded-[12px] border-[#ffffff19]
                transition-transform duration-150 flex flex-col justify-center items-center hover:scale-[1.05] hover:bg-[#323845]
                lg:w-44 lg:h-44
            "
            >
            <div className="relative rounded-[12px] bg-[#222839] overflow-hidden w-32 h-32">
                <img src={icon} className="w-full h-full object-contain" />

                <div className="absolute top-1 left-1 flex gap-1">
                {setIcons.map((src, i) => (
                    <img
                    key={`${setIds[i]}-${i}`}
                    src={src}
                    className="
                        w-6 h-6 rounded-full
                        ring-2 ring-[#222839]
                        shadow-[0_2px_6px_rgba(0,0,0,0.35)]
                    "/>
                ))}
                </div>
            </div>

            <div
                className="
                mt-2 text-sm font-semibold leading-[1.2] flex items-center justify-center
                min-h-[2.4em] overflow-hidden
                [-webkit-line-clamp:2] [-webkit-box-orient:vertical]
                text-[#e9ecf1]
                "
            >
                {echo.name}
            </div>
            </Link>
    );
}

export default EchoCard;
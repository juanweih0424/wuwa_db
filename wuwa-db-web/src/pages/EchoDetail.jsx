import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getEchoImageUrl, getEchoSetImageUrl } from "../utils/echo.js";
import "../assets/css/echodetail.css"

const APIechoset = "https://api.wuwa-db-api.com/v1/echoes/sets";
const APIechoes  = "https://api.wuwa-db-api.com/v1/echoes";

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function EchoDeatil(){
    const { slug = "" } = useParams();
    const [echoSets, setEchoSets] = useState([]);
    const [echoes, setEchoes]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const [setsRes, echoesRes] = await Promise.all([
          fetch(APIechoset, { signal: ac.signal, headers: { Accept: "application/json" } }),
          fetch(APIechoes,  { signal: ac.signal, headers: { Accept: "application/json" } }),
        ]);
        if (!setsRes.ok)  throw new Error(`echo sets ${setsRes.status}`);
        if (!echoesRes.ok) throw new Error(`echoes ${echoesRes.status}`);

        const [setsJson, echoesJson] = await Promise.all([setsRes.json(), echoesRes.json()]);
        setEchoSets(Array.isArray(setsJson)   ? setsJson   : (setsJson.items   || []));
        setEchoes  (Array.isArray(echoesJson) ? echoesJson : (echoesJson.items || []));
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

    const setsById = useMemo(() => {
    const m = Object.create(null);
    for (const s of echoSets) m[s.id] = { ...s, icon: getEchoSetImageUrl(s.id) };
    return m;
  }, [echoSets]);

    const echo = useMemo(() => {
    const found = echoes.find(e => slugify(e.name) === slug);
    return found ? { ...found, icon: getEchoImageUrl(found.id) } : null;
  }, [echoes, slug]);

    const setDetails = useMemo(() => {
    const ids = Array.isArray(echo?.echo_sets) ? echo.echo_sets.map(Number) : [];
    return ids
    .map(id => setsById[id])
    .filter(Boolean)
    .map(s => {
      let effects = [];
      if (typeof s.effect === "string") {
        effects = [{ pieces: null, text: s.effect }];
      } else if (s.effect && typeof s.effect === "object") {
        effects = Object.entries(s.effect)
          .map(([k, v]) => ({ pieces: k, text: String(v || "") }))
          .sort((a, b) => parseInt(a.pieces) - parseInt(b.pieces)); 
      }
      return { id: s.id, name: s.name, icon: s.icon, effects };
    });
}, [echo, setsById]);


    if (loading) return <div className="echo-sets">Loading…</div>;
    if (error)   return <div className="echo-sets">Failed to load.</div>;
    if (!echo)   return <div className="echo-sets">Echo not found.</div>;

    const echoIcon = getEchoImageUrl(echo.id);

    return (
    <div className="echo-detail">
            <div className="echo-info" echo-class={echo.cost}>
                <img classNmae="echo-icon" src={echoIcon}/>
                <div className="echo-info-sub-container">
                    <p className="echo-name1">{echo.name}</p>
                    <p className="echo-class">Class: {echo.class}</p>
                    <p className="echo-cost">Cost: {echo.cost}</p>
                </div>
            </div>
            <div className="echo-ability">
                <div className="echo-ability__title">Echo Ability</div>
                <div className="echo-ability__body">
                    <p className="echo-ability__desc">{echo.skill?.description}</p>
                    {Number.isFinite(Number(echo.skill?.cd)) && (
                    <div className="echo-ability__cd">CD: {echo.skill.cd}s</div>
                    )}
                </div>
            </div>

        <div className="set-effect">
                <div className="set-effect__grid">
                    {setDetails.map(s => (
                    <article key={s.id} className="set-effect__card">
                        <header className="set-effect__head">
                        <img className="set-effect__icon" src={s.icon} />
                        <h4 className="set-effect__name">{s.name}</h4>
                        </header>

                        <div className="set-effect__body">
                        {s.effects.map((ef, i) => (
                        <p key={i} className="set-effect__line">
                        <u>{ef.pieces?.replace("pc", " Set")}:</u> {ef.text}
                        </p>
                        ))}
                        </div>
                    </article>
                    ))}
            </div>
        </div>
    </div>
    );
}

export default EchoDeatil;
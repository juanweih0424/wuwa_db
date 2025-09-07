import { useState, useEffect,useMemo } from "react";
import { getEchoImageUrl, getEchoSetImageUrl } from "../utils/echo.js";
import EchoCard from "../components/EchoCard.jsx"
import "../assets/css/echoes.css"
const APIechoset = "https://api.wuwa-db-api.com/v1/echoes/sets";

const APIechoes = "https://api.wuwa-db-api.com/v1/echoes";

function norm(s) {
  return String(s ?? "").toLowerCase();
}

function Echoes() {
  const [echoSets, setEchoSets] = useState([]);
  const [echoes, setEchoes]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [query, setQuery]       = useState("");
  const [cost, setCost]         = useState("all"); 
  const [setFilter, setSetFilter] = useState("all");

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

        const [setsJson, echoesJson] = await Promise.all([
          setsRes.json(),
          echoesRes.json(),
        ]);

        setEchoSets(Array.isArray(setsJson)   ? setsJson   : (setsJson.items   || []));
        setEchoes(Array.isArray(echoesJson) ? echoesJson : (echoesJson.items || []));
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

  const echoesWithIcon = useMemo(() => echoes.map(e => ({ ...e, icon: getEchoImageUrl(e.id) })),
    [echoes]
  );

  const setList = useMemo(() => {
    return Object.values(setsById)
      .map(s => ({ id: String(s.id), name: s.name, icon: s.icon }))
      .sort((a,b) => a.name.localeCompare(b.name));
  }, [setsById]);


  function echoHasSet(e, sid){
    if (!sid || sid === "all") return true;
    const sNum = Number(sid);
    if (Array.isArray(e.echo_sets) && e.echo_sets.map(Number).includes(sNum)) return true;
    const members = setsById[sNum]?.members;
    if (Array.isArray(members) && members.map(Number).includes(Number(e.id))) return true;
    return false;
  }

  const filtered = useMemo(()=>{
    const q = norm(query);
    return echoesWithIcon.filter(e => {
      const passName = q === "" ? true : norm(e.name).includes(q);
      const passCost = cost === "all" ? true : String(e.cost) === cost;
      const passSet  = echoHasSet(e, setFilter);
      return passName && passCost && passSet;
    });
  }, [query, cost,setFilter, echoesWithIcon, setsById]);

  const costOptions = useMemo(() => {
    const set = new Set(echoes.map(e => String(e.cost)));
    return Array.from(set).sort((a,b) => Number(a) - Number(b));
  }, [echoes]);

  
  if (loading) return <div className="echo-sets">Loading…</div>;
  if (error)   return <div className="echo-sets">Failed to load.</div>;
  return (
    <div className="main-body"> 
      <h1 className="title">Wuthering Waves Echoes</h1>
      <div className="searchbar">
        <input type="search" 
        placeholder="Search echoes..." 
        className="echo-search"
        value={query}
        onChange={(e)=>setQuery(e.target.value)}/>

        <select className="cost-select"
        value={cost}
        onChange={(e)=>setCost(e.target.value)}>
          <option value="all">All</option>
          {costOptions.map(c => <option key={c} value={c}>Cost {c}</option>)}
        </select>
      </div>

      <div className="setsbar" role="toolbar">

        <div className="set-icons" role="listbox" aria-label="Sets">
          {setList.map(s => (
            <button
              key={s.id}
              type="button"
              className={`set-icon ${setFilter === s.id ? "is-active" : ""}`}
              onClick={() => setSetFilter(prev => prev === s.id ? "all" : s.id)}
              title={s.name}
            >
              <img src={s.icon}/>
              <span className="visually-hidden">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    
      <div className="echo-body">
        {filtered.map(e => (
          <EchoCard key={e.id} echo={e} setsById={setsById} />
        ))}
      </div>
    </div>


  );
}

export default Echoes;
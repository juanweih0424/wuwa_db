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
    <div className="flex flex-col w-full items-center"> 
      <p className="text-[var(--accent)] mt-8 text-xl
      md:text-2xl">Wuthering Waves Echoes</p>
      <div className="flex w-xs md:w-md lg:w-xl xl:w-4xl
        gap-3 
        items-center 
        my-4 
        bg-[rgba(255,255,255,0.03)] 
        border border-[#3c445d] 
        shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
        <input type="search" 
        placeholder="Search echoes..." 
        className="h-[36px]
        px-2
        rounded-[10px]
        border-2 border-[#48506a]
        bg-[#2a2e40]
        text-[#e9ecf1]
        outline-none
        w-full
        transition-[border-color,box-shadow,background] duration-150 ease-in-out"
        value={query}
        onChange={(e)=>setQuery(e.target.value)}/>

        <select className="h-[36px]
        px-2
        rounded-[10px]
        border-2 border-[#48506a]
        bg-[#2a2e40]
        text-[#e9ecf1]
        outline-none
        w-30
        transition-[border-color,box-shadow,background] duration-150 ease-in-out"
        value={cost}
        onChange={(e)=>setCost(e.target.value)}>
          <option value="all">All</option>
          {costOptions.map(c => <option key={c} value={c}>Cost {c}</option>)}
        </select>
      </div>

      <div className="flex gap-2.5 my-2 justify-center w-xs
      md:w-md lg:w-xl xl:w-4xl" role="toolbar">

        <div className="flex flex-wrap gap-2 py-1 px-1.5 
        rounded-[12px] border border-solid bg-[#FFFFFF08] border-[color:#3c445d]" role="listbox">
          {setList.map(s => (
            <button
              key={s.id}
              type="button"
              className={`w-9 h-9 p-0.5 border-2 border-solid rounded-full grid place-items-center cursor-pointer
              bg-[#1c2130] transition-colors duration-150
              ${setFilter === s.id ? "border-yellow-500" : "border-[#48506a]"}`}
              onClick={() => setSetFilter(prev => prev === s.id ? "all" : s.id)}
              title={s.name}
            >
              <img src={s.icon} className="object-contain w-full h-full"/>
              <span className="visually-hidden">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    
      <div className="grid grid-cols-2 my-4 gap-x-4 gap-y-4 px-4
      md:grid-cols-3
      xl:grid-cols-5
      2xl:grid-cols-6">
        {filtered.map(e => (
          <EchoCard key={e.id} echo={e} setsById={setsById} />
        ))}
      </div>
    </div>


  );
}

export default Echoes;
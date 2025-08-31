
const _images = import.meta.glob("../assets/images/weapons/*.{webp,png}", {
    query: "?url",
    import: "default",
    eager: true,
});


const _byKey = new Map(
  Object.entries(_images).map(([path, url]) => {
    const file = path.split("/").pop() || ""; // StringMaster.webp 
    const key = file.replace(/\.(webp|png)$/i, "").toLowerCase(); // take out the .webp and convert to lower case e.g. stringmaster
    return [key, url]; // return (stringmaster, with hash url e.g. /assets/StringMaster.hash123.webp)
  })
);  // result pair e.g. stringmaster: /assets/StringMaster.hash123.webp

// Naming conventions: replacing every non-alphabetical string to - e.g. Ages of Harvest-> ages-of-harvest
export function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getWeaponImageUrl(name) {
  const s = slugify(name);
  if (_byKey.has(s)) return _byKey.get(s);
  const hit = [..._byKey.keys()].find((k) => k.includes(s));
  if (hit) return _byKey.get(hit);
  return undefined; 
}

export function prettySubstat(sub) {
  if (!sub) return "";
  const value = typeof sub.max === "number" ? sub.max : 0;
  const isPercent =
    /%|rate|dmg|regen/i.test(sub.kind || "") || (value > 0 && value < 1);

  const num = isPercent
    ? (value * 100).toFixed(value * 100 >= 10 ? 1 : 2) + "%"
    : String(Math.round(value));

  const label = String(sub.kind || "").replace("%", "");
  return `${label} ${num}`;
}


function stripZeros(numStr) {
  return String(numStr)
    .replace(/\.0+$/, '')                 
    .replace(/(\.\d*?[1-9])0+$/, '$1');  
}

function toPercentNumber(v) {
  const n = Number(v);
  if (!isFinite(n)) return '';
  if (n > 0 && n <= 1) return stripZeros((n * 100).toFixed(2));
  return stripZeros(n.toFixed(2));
}

export function buildSkillHTML(skill) {
  const template = skill?.skill_description || '';
  const ranks = skill?.ranks || [];

  return template.replace(/\{(\w+)\}/g, (match, key, offset, full) => {
    const nextChar = full[offset + match.length];
    const templateHasPercent = nextChar === '%';

    const raw = ranks
      .map(r => r?.[key])
      .filter(v => v != null)
      .map(Number)
      .filter(n => isFinite(n));

    if (!raw.length) return match;

    const joined = raw.map((n, i) => {
      const numStr = toPercentNumber(n);

      const withMaybePercent = templateHasPercent
        ? (i < raw.length - 1 ? `${numStr}%` : numStr)
        : (n > 0 && n < 1 ? `${numStr}%` : numStr);


      return `<span class="skill-val skill-val--${key}">${withMaybePercent}</span>`;
    }).join('/');

    return joined;
  });
}

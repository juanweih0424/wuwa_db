// url
const characterIcons = import.meta.glob("../assets/images/characters/*.{webp,png}", { eager: true });
const elementIcons = import.meta.glob("../assets/images/element/*.webp", { eager: true });


function getImage(map, filename) {
  for (const path in map) {
    const base = path.split("/").pop().toLowerCase();
    if (base === `${filename}.png` || base === `${filename}.webp`) {
      return map[path].default;
    }
  }
  return null;
}

export function getCharacterIcon(id) {
  return getImage(characterIcons, id);
}

export function getElementIcon(element) {
  return getImage(elementIcons, element.toLowerCase());
}

export function getCharacterFullIcon(id) {
  return getImage(characterIcons, `${id}-full`);
}
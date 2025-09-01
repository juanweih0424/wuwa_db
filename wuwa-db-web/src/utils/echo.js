const echoImgs    = import.meta.glob("../assets/images/echoes/*.png",        { eager: true });
const echoSetImgs = import.meta.glob("../assets/images/echoset_image/*.png", { eager: true });

export function getEchoImageUrl(id) {
  const key = `../assets/images/echoes/${id}.png`;
  return echoImgs[key]?.default ?? null;
}

export function getEchoSetImageUrl(id) {
  const key = `../assets/images/echoset_image/${id}.png`;
  return echoSetImgs[key]?.default ?? null;
}
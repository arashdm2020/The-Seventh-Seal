export const ring = (id, name, symbols, initial, target) => ({
  id,
  name,
  symbols,
  initial,
  target,
});
export const link = (id, direction = 1, when) => ({
  id,
  direction,
  ...(when ? { when } : {}),
});
export const FIRE_DATE = "1893-10-17";
export const FIRE_RECORD =
  "17 October 1893 — the observatory burned. Elian Vale refused the council’s false repair certificate. The warning never reached the river.";

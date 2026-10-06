import { ring, link, FIRE_DATE } from "./shared.js";
export const memorialAlphabet = [
  "sun",
  "moon",
  "star",
  "eye",
  "mountain",
  "diamond",
  "skull",
  "infinity",
  "flame",
  "key",
];
// The dated story record determines Memorial's word, never the device clock.
const memorialWord =
  memorialAlphabet[(Number(FIRE_DATE.slice(-2)) - 1) % memorialAlphabet.length];
export const lock07 = {
  id: "final-seal",
  numeral: "VII",
  title: "FINAL SEAL",
  ordinal: "SEVENTH",
  rings: [
    ring("outer", "Memorial", memorialAlphabet, 0, memorialWord),
    ring(
      "second",
      "Promise",
      [
        "infinity",
        "serpent",
        "crown",
        "skull",
        "eye",
        "gate",
        "hourglass",
        "compass",
        "anchor",
        "hand",
        "raven",
        "star",
      ],
      2,
      "infinity",
    ),
    ring(
      "third",
      "Memory",
      [
        "flame",
        "anchor",
        "hand",
        "raven",
        "moon",
        "key",
        "eye",
        "hourglass",
        "skull",
        "infinity",
        "serpent",
        "gate",
      ],
      3,
      "flame",
    ),
    ring(
      "inner",
      "Release",
      ["key", "gate", "compass", "infinity", "skull", "moon", "flame", "hand"],
      3,
      "key",
    ),
  ],
  coupling: {
    outer: [link("second", -1)],
    second: [link("third", -2, { id: "outer", symbol: "skull" })],
    third: [link("outer", 1, { id: "inner", symbol: "gate" })],
    inner: [link("second")],
  },
  inscription:
    "Name the day the observatory fell.\nLet the promise have no end.\nWhat fire remembers, only the key may release.",
  note: "For Memorial, count the day of the observatory fire through its ten-word alphabet: Sun is one, then follow the engraved signs clockwise; after Key, begin again at Sun. Revisit the earlier pages if the date escapes you. The other rings speak of an endless promise, memory, and release.",
  noteFooter:
    "Skull names those lost; Infinity is a promise without end. Only Memorial’s Skull lets Promise turn Memory two positions backward. Only Release’s Gate lets Memory turn Memorial one position forward. Memorial reverses Promise; Release carries Promise forward. Check the gate before each step; no chain reactions.",
  hints: [
    "The date belongs to the story, not today. The fire’s day selects a word from Memorial’s engraved alphabet; the promise survives beyond a lifetime.",
    "Memorial’s Skull opens Promise’s doubled, opposite link to Memory. Release’s Gate opens Memory’s link to Memorial. Changing either gate can protect a ring you have already aligned.",
    "The fire was on 17 October 1893. Count seventeen through the ten-word alphabet. Use Skull, Infinity, Flame, and Key as final words, and plan when the two gates must be open or closed.",
  ],
  fragment:
    "“Mira, I could not save you. Let whoever opens this carry the truth farther than I could.” The ledger is yours. The names will not be buried again.",
};

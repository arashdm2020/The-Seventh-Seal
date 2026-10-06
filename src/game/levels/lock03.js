import { ring, link, FIRE_RECORD } from "./shared.js";
export const lock03 = {
  id: "oath",
  numeral: "III",
  title: "THE FALSE OATH",
  ordinal: "THIRD",
  rings: [
    ring(
      "outer",
      "Authority",
      ["crown", "sun", "moon", "diamond", "eye", "star", "key", "flame"],
      2,
      "crown",
    ),
    ring(
      "second",
      "Oath",
      ["serpent", "eye", "flame", "crown", "mountain", "key"],
      1,
      "serpent",
    ),
    ring(
      "third",
      "Memory",
      ["flame", "key", "moon", "star", "serpent", "eye", "crown", "path"],
      3,
      "flame",
    ),
    ring(
      "inner",
      "Release",
      ["key", "path", "crown", "serpent", "flame", "circle"],
      2,
      "key",
    ),
  ],
  coupling: {
    outer: [link("second", -1)],
    second: [link("inner")],
    third: [link("outer", 2), link("second")],
    inner: [],
  },
  inscription:
    "A crown commanded.\nA serpent swore.\nFire remembers; the key releases.",
  note: "Crown means the council’s authority. Serpent means its false oath. Beneath them lie the words you already know: memory and release. Read inward.",
  noteFooter:
    "Memory turns Authority twice and Oath once in its own direction. Authority turns Oath backward. Oath carries Release forward. Links do not cascade.",
  hints: [
    "The council and its lie are separate words. Match those words to Crown and Serpent, then recall the meaning of Flame and Key.",
    "One Memory step moves Authority two positions and Oath one. Authority reverses Oath; Oath moves Release in the same direction.",
    "Resolve Memory before Authority, then account for the combined movement of Oath. Release can be corrected last without disturbing the others.",
  ],
  fragment: "“I am Elian Vale, keeper of the floodgate.” " + FIRE_RECORD,
};

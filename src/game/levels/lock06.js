import { ring, link } from "./shared.js";
export const lock06 = {
  id: "held",
  numeral: "VI",
  title: "THE HOLDING HAND",
  ordinal: "SIXTH",
  rings: [
    ring(
      "outer",
      "Keeper",
      ["hand", "crown", "sun", "eye", "gate", "moon", "key", "anchor"],
      3,
      "hand",
    ),
    ring(
      "second",
      "Burden",
      [
        "anchor",
        "mountain",
        "gate",
        "flame",
        "compass",
        "key",
        "hand",
        "hourglass",
      ],
      0,
      "anchor",
    ),
    ring(
      "third",
      "Messenger",
      ["raven", "hand", "serpent", "key", "eye", "gate", "flame", "moon"],
      1,
      "raven",
    ),
    ring(
      "inner",
      "Release",
      ["key", "gate", "hand", "anchor", "moon", "raven"],
      3,
      "key",
    ),
    ring(
      "memory",
      "Memory",
      ["flame", "hourglass", "anchor", "hand", "key", "star", "raven", "moon"],
      1,
      "flame",
    ),
  ],
  coupling: {
    outer: [link("second"), link("third", -1)],
    second: [link("inner", -1)],
    third: [link("memory", 1, { id: "inner", symbol: "gate" })],
    inner: [link("memory", -1)],
    memory: [link("second")],
  },
  inscription:
    "A hand holds what the anchor could not save.\nA raven waits at the gate.\nRelease the memory, not the names.",
  note: "Hand is the keeper’s promise. Anchor is the weight of those lost to the river. After them come the warning, release, and the fire that remembers. Read all five rings inward.",
  noteFooter:
    "Keeper carries Burden forward and Messenger backward. Burden drives Release backward; Release drives Memory backward; Memory carries Burden forward. Messenger reaches Memory only while Release shows Gate. Connections never cascade.",
  hints: [
    "The new hand promises to hold the truth; the anchor names its burden. The fifth ring is the memory itself, not an extra number.",
    "Burden, Release, and Memory form a loop. Messenger can shift Memory by one while Release shows Gate, without moving the other two.",
    "Use the gate to make the one-position correction that the loop cannot supply on its own. Then close the passage and balance the loop; keep Flame as Memory’s final word.",
  ],
  fragment:
    "The drowned are named one by one. The last is Mira Vale, Elian’s daughter. “A hand must carry what an anchor could not hold.”",
};

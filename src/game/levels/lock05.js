import { ring, link } from "./shared.js";
export const lock05 = {
  id: "permission",
  numeral: "V",
  title: "THE WATCHFUL GATE",
  ordinal: "FIFTH",
  rings: [
    ring(
      "outer",
      "Threshold",
      ["gate", "sun", "crown", "path", "key", "moon", "flame", "compass"],
      3,
      "gate",
    ),
    ring(
      "second",
      "Messenger",
      ["raven", "eye", "moon", "gate", "flame", "key", "crown", "compass"],
      0,
      "raven",
    ),
    ring(
      "third",
      "Memory",
      ["flame", "raven", "serpent", "hourglass", "key", "gate", "moon", "star"],
      4,
      "flame",
    ),
    ring(
      "inner",
      "Release",
      ["key", "gate", "flame", "path", "raven", "moon", "hourglass", "serpent"],
      3,
      "key",
    ),
  ],
  coupling: {
    outer: [link("second")],
    second: [link("inner")],
    third: [
      link("outer", 2, { id: "inner", symbol: "gate" }),
      link("second", -1, { id: "inner", symbol: "gate" }),
    ],
    inner: [],
  },
  inscription:
    "The gate permits the memory to speak.\nThe raven carries its warning.\nA key is the destination, not the passage.",
  note: "Gate means permission; Raven means a warning carried onward. At the edge, permission. Then the messenger, the remembered fire, and release.",
  noteFooter:
    "Only while Release shows Gate does Memory drive Threshold twice forward and Messenger once backward. Threshold carries Messenger; Messenger carries Release. All gates are checked before each step; driven links never cascade.",
  hints: [
    "A symbol may be a temporary tool. Gate opens a connection even though Key remains Release’s final word.",
    "Release’s Gate enables both Memory links. Moving Messenger changes Release, so it can open or close that passage before the next Memory turn.",
    "Prepare the gate before using Memory’s doubled movement. You may need to close it before finishing Memory; correct Messenger and Release around that change.",
  ],
  fragment:
    "“The raven was my warning. The council shut the gate. I sealed the ledger so they could not erase the names.”",
};

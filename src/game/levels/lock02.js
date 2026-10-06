import { ring, link } from "./shared.js";
export const lock02 = {
  id: "language",
  numeral: "II",
  title: "THE LANGUAGE",
  ordinal: "SECOND",
  rings: [
    ring(
      "outer",
      "Memory",
      ["flame", "moon", "eye", "key", "sun", "star"],
      2,
      "flame",
    ),
    ring(
      "second",
      "Release",
      ["key", "path", "circle", "flame", "diamond", "moon", "sun", "eye"],
      0,
      "key",
    ),
    ring(
      "third",
      "Witness",
      ["eye", "star", "flame", "key", "mountain", "path"],
      2,
      "eye",
    ),
  ],
  coupling: { outer: [link("second", -1)], second: [], third: [] },
  inscription:
    "What fire remembers,\nonly the key may release.\nLet an open eye bear witness.",
  note: "Vale drew fire for a memory that survives, a key for release, and an eye for the one who sees. Read from the edge to the heart.",
  noteFooter:
    "Memory draws Release in the opposite direction. Witness stands alone. A driven ring does not drive its own neighbors.",
  hints: [
    "These are words, not decorations: fire preserves memory, a key releases it, and an eye witnesses it.",
    "Turning Memory also moves Release one position in the opposite direction. Turning Release never moves Memory.",
    "Align Flame, Key, and Eye from outside inward. Set Memory before making the final correction to Release.",
  ],
  fragment:
    "A maker’s mark emerges: E. Vale. “Fire keeps what paper loses. The key is permission to remember.”",
};

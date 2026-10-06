import { lock01 } from "./lock01.js";
import { lock02 } from "./lock02.js";
import { lock03 } from "./lock03.js";
import { createLock04 } from "./lock04.js";
import { lock05 } from "./lock05.js";
import { lock06 } from "./lock06.js";
import { lock07 } from "./lock07.js";
export const levels = [
  {
    ...lock01,
    numeral: "I",
    title: "THE ALIGNMENT",
    ordinal: "FIRST",
    fragment: "Something moves inside the box.",
  },
  lock02,
  lock03,
  createLock04("2026-10-06"),
  lock05,
  lock06,
  lock07,
];

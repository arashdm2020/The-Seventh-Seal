import { ring, link } from "./shared.js";
import { dateSeedFromDate, calendarLabel } from "../calendar.js";
import { wrap } from "../lockRules.js";
// Six authored arrangements, selected by the calendar rather than randomness.
const arrangements = {
  against: [
    [1, 1, 1],
    [2, 1, 1],
    [3, 1, 5],
  ],
  with: [
    [1, 3, 1],
    [2, 5, 1],
    [3, 1, 5],
  ],
};
export function createLock04(date, stopped = false) {
  const seed = dateSeedFromDate(date);
  const direction = wrap(seed, 2) === 0 ? 1 : -1;
  const mode = direction === 1 ? "with" : "against";
  const initial = arrangements[mode][wrap(Math.floor(seed / 2), 3)];
  return {
    id: "calendar",
    numeral: "IV",
    title: "THE DATE",
    ordinal: "FOURTH",
    calendar: { date, label: calendarLabel(date), stopped, mode },
    rings: [
      ring(
        "outer",
        "Time",
        ["hourglass", "sun", "moon", "flame", "key", "star"],
        initial[0],
        "hourglass",
      ),
      ring(
        "second",
        "Bearing",
        ["compass", "path", "moon", "star", "sun", "key", "eye", "flame"],
        initial[1],
        "compass",
      ),
      ring(
        "third",
        "Record",
        ["flame", "key", "hourglass", "eye", "star", "compass"],
        initial[2],
        "flame",
      ),
    ],
    coupling: {
      outer: [link("second", direction)],
      second: [link("third", -1)],
      third: [],
    },
    inscription: `Time gives the compass its bearing.\nOn this page it turns ${mode} time.\nFire keeps the record.`,
    note: "Hourglass means the passing of days; Compass means a direction chosen by the calendar. Read inward: passing time, its bearing, the fire that preserves the record. Today’s date chooses the starting arrangement and the direction of the connection; it is not a combination to enter.",
    noteFooter: `The calendar page reads ${calendarLabel(date)}. Time carries Bearing ${direction === 1 ? "in the same direction" : "in the opposite direction"}. Bearing drives Record backward; Record stands alone. This page stays fixed until the seal is broken. Driven connections never cascade.`,
    hints: [
      "The date changes the mechanism, not the three words you must align. An hourglass speaks of time; a compass of bearing; fire of a lasting record.",
      `Today Time turns Bearing ${direction === 1 ? "in the same direction" : "in the opposite direction"}. Bearing turns Record backward. Each ring has its own number of positions.`,
      "Align Hourglass, Compass, and Flame from outside inward. Work from Time to Bearing to Record, allowing for the motion inherited at each stage.",
    ],
    fragment:
      "“The calendar changes the path so no copied combination can open every seal. The date of the fire, though, must never change.”",
  };
}

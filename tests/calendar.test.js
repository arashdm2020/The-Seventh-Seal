import test from "node:test";
import assert from "node:assert/strict";
import {
  dateSeedFromDate,
  authoritativeCalendar,
} from "../src/game/calendar.js";
import { createLock04 } from "../src/game/levels/lock04.js";
import { fallbackCalendarLevel } from "../src/game/calendarFallback.js";
import { initialState, reducePuzzle } from "../src/game/puzzleEngine.js";
import { isSolved } from "../src/game/lockRules.js";
import { GET } from "../src/app/api/puzzle-date/route.js";
import { solve } from "./solver.js";

test("Calendar validates 738 distinct dates, covering leap years, century exceptions, and every arrangement", () => {
  const dates = [];
  for (
    let day = Date.UTC(2024, 0, 1);
    day < Date.UTC(2026, 0, 1);
    day += 86400000
  )
    dates.push(new Date(day).toISOString().slice(0, 10));
  dates.push(
    "1893-10-17",
    "1900-02-28",
    "1900-03-01",
    "2000-02-29",
    "2100-02-28",
    "2100-03-01",
    "2026-10-06",
  );
  assert.equal(new Set(dates).size, 738);
  const arrangements = new Set(),
    minima = new Set();
  for (const date of dates) {
    const level = createLock04(date);
    assert.deepEqual(level, createLock04(date));
    const start = initialState(level);
    assert.equal(isSolved(level, start.positions), false);
    const path = solve(level);
    assert.ok(path);
    assert.ok(path.length >= 6 && path.length <= 8);
    minima.add(path.length);
    arrangements.add(
      JSON.stringify([level.rings.map((r) => r.initial), level.coupling.outer]),
    );
    let state = start;
    for (const move of path)
      state = reducePuzzle(level, state, { type: "rotate", ...move });
    assert.ok(isSolved(level, state.positions));
    assert.equal(state.phase, "unlocking");
    assert.deepEqual(reducePuzzle(level, state, { type: "reset" }), start);
  }
  assert.equal(arrangements.size, 6);
  assert.deepEqual([...minima].sort(), [6, 7, 8]);
});
test("Server calendar changes at Tehran midnight, never with minutes within a day", () => {
  const early = authoritativeCalendar(new Date("2026-10-06T00:00:00Z"));
  assert.deepEqual(
    early,
    authoritativeCalendar(new Date("2026-10-06T20:29:59Z")),
  );
  assert.equal(early.date, "2026-10-06");
  assert.equal(
    authoritativeCalendar(new Date("2026-10-06T20:30:00Z")).date,
    "2026-10-07",
  );
  assert.notDeepEqual(
    createLock04("2026-10-06").coupling,
    createLock04("2026-10-07").coupling,
  );
});
test("Calendar rejects invalid days and leap dates rather than silently normalizing them", () => {
  for (const value of [
    "2026-02-29",
    "1900-02-29",
    "2100-02-29",
    "2026-13-01",
    "today",
    "2026-1-1",
  ])
    assert.throws(() => dateSeedFromDate(value));
});
test("Date endpoint supplies normalized authoritative data with caching disabled", async () => {
  const response = GET(),
    data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(dateSeedFromDate(data.date), data.dateSeed);
  for (const header of [
    "cache-control",
    "cdn-cache-control",
    "vercel-cdn-cache-control",
  ])
    assert.match(response.headers.get(header), /no-store/);
});
test("Stopped-calendar fallback is distinct, deterministic, and solvable", () => {
  const level = fallbackCalendarLevel();
  assert.equal(level.calendar.stopped, true);
  assert.equal(level.calendar.date, "1893-10-17");
  assert.deepEqual(level, fallbackCalendarLevel());
  assert.ok(solve(level).length >= 6);
});

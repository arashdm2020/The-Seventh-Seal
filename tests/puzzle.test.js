import test from "node:test";
import assert from "node:assert/strict";
import { lock01 } from "../src/game/levels/lock01.js";
import { initialState, reducePuzzle } from "../src/game/puzzleEngine.js";
import {
  alignedSymbol,
  isSolved,
  rotatePositions,
} from "../src/game/lockRules.js";
test("deterministic start, independent rings, and mechanical coupling", () => {
  const state = initialState(lock01);
  assert.equal(isSolved(lock01, state.positions), false);
  for (const id of ["outer", "inner"]) {
    const next = rotatePositions(lock01, state.positions, id, 1);
    for (const r of lock01.rings)
      assert.equal(next[r.id], state.positions[r.id] + (r.id === id ? 1 : 0));
  }
  const earth = rotatePositions(lock01, state.positions, "second", 1);
  assert.equal(earth.second, 4);
  assert.equal(earth.inner, 5);
  const witness = rotatePositions(lock01, state.positions, "third", -1);
  assert.equal(witness.third, 4);
  assert.equal(witness.second, 2);
  assert.deepEqual(state, initialState(lock01));
});
test("every symbol stays snapped across wrapping and inverse turns", () => {
  for (const ring of lock01.rings)
    for (let step = -20; step <= 20; step++) {
      const start = initialState(lock01).positions;
      const rotated = rotatePositions(lock01, start, ring.id, step);
      assert.equal(Number.isInteger(rotated[ring.id]), true);
      assert.ok(ring.symbols.includes(alignedSymbol(ring, rotated[ring.id])));
      assert.deepEqual(rotatePositions(lock01, rotated, ring.id, -step), start);
    }
});
test("solvable through coupled turns, phases freeze interaction, and reset restores everything", () => {
  let state = initialState(lock01);
  for (const ring of [
    lock01.rings[0],
    lock01.rings[2],
    lock01.rings[1],
    lock01.rings[3],
  ]) {
    const target = -ring.symbols.indexOf(ring.target);
    state = reducePuzzle(lock01, state, {
      type: "rotate",
      id: ring.id,
      step: target - state.positions[ring.id],
    });
  }
  assert.equal(isSolved(lock01, state.positions), true);
  assert.equal(state.phase, "unlocking");
  assert.equal(reducePuzzle(lock01, state, { type: "rotate", step: 1 }), state);
  state = reducePuzzle(lock01, state, { type: "complete" });
  assert.equal(state.phase, "solved");
  assert.deepEqual(
    reducePuzzle(lock01, state, { type: "reset" }),
    initialState(lock01),
  );
});
test("hints progress exactly three times", () => {
  let state = initialState(lock01);
  for (let i = 1; i < 6; i++) {
    state = reducePuzzle(lock01, state, { type: "hint" });
    assert.equal(state.hints, Math.min(i, 3));
  }
});

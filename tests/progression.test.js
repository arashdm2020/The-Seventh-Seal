import test from "node:test";
import assert from "node:assert/strict";
import { levels } from "../src/game/levels/index.js";
import { initialState, reducePuzzle } from "../src/game/puzzleEngine.js";
import {
  alignedSymbol,
  isSolved,
  rotatePositions,
  wrap,
  couplingActive,
} from "../src/game/lockRules.js";
import { layoutRings } from "../src/visuals/ringLayout.js";
import { solve, analyzeSpace } from "./solver.js";
import { verifiedLevels } from "./verifiedLevels.js";

const targetSymbols = [
  ["sun", "mountain", "eye", "path"],
  ["flame", "key", "eye"],
  ["crown", "serpent", "flame", "key"],
  ["hourglass", "compass", "flame"],
  ["gate", "raven", "flame", "key"],
  ["hand", "anchor", "raven", "key", "flame"],
  ["skull", "infinity", "flame", "key"],
];
const goals = (level) =>
  Object.fromEntries(
    level.rings.map((r) => [r.id, -r.symbols.indexOf(r.target)]),
  );
const normalize = (level, p) =>
  level.rings.map((r) => wrap(p[r.id], r.symbols.length));
const expectedClosed = [
  [
    [1, 0, 0, 0],
    [0, 1, 0, -1],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
  ],
  [
    [1, -1, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  [
    [1, -1, 0, 0],
    [0, 1, 0, 1],
    [2, 1, 1, 0],
    [0, 0, 0, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, -1],
    [0, 0, 1],
  ],
  [
    [1, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
  [
    [1, 1, -1, 0, 0],
    [0, 1, 0, -1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, -1],
    [0, 1, 0, 0, 1],
  ],
  [
    [1, -1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 0, 1],
  ],
];
for (const [index, level] of levels.entries()) {
  const prefix = `Lock ${level.numeral}`;
  test(`${prefix}: authored ring counts, unique emblems, and exact targets`, () => {
    assert.equal(level.rings.length, [4, 3, 4, 3, 4, 5, 4][index]);
    assert.deepEqual(
      level.rings.map((r) => r.target),
      targetSymbols[index],
    );
    assert.equal(
      new Set(level.rings.map((r) => r.id)).size,
      level.rings.length,
    );
    for (const ring of level.rings) {
      assert.equal(new Set(ring.symbols).size, ring.symbols.length);
      assert.ok(ring.symbols.includes(ring.target));
    }
    const target = goals(level);
    assert.ok(isSolved(level, target));
    for (const r of level.rings)
      assert.equal(
        isSolved(level, { ...target, [r.id]: target[r.id] + 1 }),
        false,
      );
    assert.equal(isSolved(level, initialState(level).positions), false);
  });
  test(`${prefix}: direct and coupled turns in both directions, without chain reactions`, () => {
    const base = Object.fromEntries(level.rings.map((r) => [r.id, 0]));
    for (const links of Object.values(level.coupling))
      for (const link of links)
        if (link.when) {
          const gate = level.rings.find((r) => r.id === link.when.id);
          base[gate.id] = -gate.symbols.indexOf(link.when.symbol) + 1;
        }
    for (const [i, r] of level.rings.entries())
      for (const sign of [-1, 1]) {
        const next = rotatePositions(level, base, r.id, sign);
        assert.deepEqual(
          level.rings.map((ring) => next[ring.id] - base[ring.id]),
          expectedClosed[index][i].map((n) => (n === 0 ? 0 : n * sign)),
        );
        assert.deepEqual(
          normalize(level, rotatePositions(level, next, r.id, -sign)),
          normalize(level, base),
        );
      }
  });
  test(`${prefix}: BFS minimum and recorded sequence reach success`, () => {
    const moves = solve(level),
      record = verifiedLevels[level.id];
    assert.ok(moves);
    assert.equal(moves.length, record.minimum);
    let state = initialState(level);
    for (const move of record.sequence)
      state = reducePuzzle(level, state, { type: "rotate", ...move });
    assert.ok(isSolved(level, state.positions));
    assert.equal(state.phase, "unlocking");
    assert.equal(state.moves, record.minimum);
    assert.equal(
      reducePuzzle(level, state, {
        type: "rotate",
        id: level.rings[0].id,
        step: 1,
      }),
      state,
    );
    assert.equal(
      reducePuzzle(level, state, { type: "complete" }).phase,
      "solved",
    );
  });
  test(`${prefix}: reset restores state, selection, hints, and feedback`, () => {
    let state = initialState(level);
    state = reducePuzzle(level, state, { type: "rotate", step: 1 });
    state = reducePuzzle(level, state, {
      type: "select",
      id: level.rings.at(-1).id,
    });
    for (let n = 1; n <= 4; n++) {
      state = reducePuzzle(level, state, { type: "hint" });
      assert.equal(state.hints, Math.min(n, 3));
    }
    assert.deepEqual(
      reducePuzzle(level, state, { type: "reset" }),
      initialState(level),
    );
  });
  test(`${prefix}: batched detents and wrapping respect each ring's own count`, () => {
    for (const r of level.rings)
      for (const step of [-19, 19]) {
        const base = initialState(level).positions;
        const batch = rotatePositions(level, base, r.id, step);
        let single = base;
        for (let n = 0; n < Math.abs(step); n++)
          single = rotatePositions(level, single, r.id, Math.sign(step));
        assert.deepEqual(batch, single);
        for (const ring of level.rings)
          assert.equal(
            alignedSymbol(ring, batch[ring.id]),
            ring.symbols[wrap(-batch[ring.id], ring.symbols.length)],
          );
      }
  });
}
test("Lock I retains its exact authored dimensions, positions, vocabulary, and links", () => {
  const level = levels[0];
  assert.deepEqual(
    level.rings.map((r) => r.initial),
    [2, 3, 5, 6],
  );
  assert.deepEqual(
    layoutRings(level).map((r) => [r.radius, r.width, r.symbolSize]),
    [
      [230, 54, 30],
      [172, 50, 30],
      [118, 46, 30],
      [68, 42, 30],
    ],
  );
  assert.deepEqual(level.coupling, {
    outer: [],
    second: [{ id: "inner", direction: -1 }],
    third: [{ id: "second", direction: 1 }],
    inner: [],
  });
});
test("All layouts fit the annulus and separate independent rings and readable symbols", () => {
  for (const level of levels) {
    const rings = layoutRings(level);
    for (const [i, r] of rings.entries()) {
      assert.ok(r.symbolSize >= 24);
      assert.ok(r.radius + r.width / 2 <= 258);
      assert.ok(r.radius - r.width / 2 >= 43);
      if (i)
        assert.ok(
          rings[i - 1].radius - rings[i - 1].width / 2 > r.radius + r.width / 2,
        );
    }
  }
  assert.ok(layoutRings(levels[1])[0].width > layoutRings(levels[5])[0].width);
});
for (const level of levels.filter((l) =>
  Object.values(l.coupling)
    .flat()
    .some((link) => link.when),
)) {
  test(`Lock ${level.numeral}: gates open and close exactly on the named emblem`, () => {
    for (const [operated, links] of Object.entries(level.coupling))
      for (const link of links)
        if (link.when) {
          const gate = level.rings.find((r) => r.id === link.when.id),
            open = {
              ...goals(level),
              [gate.id]: -gate.symbols.indexOf(link.when.symbol),
            };
          assert.equal(couplingActive(level, open, link), true);
          const closed = { ...open, [gate.id]: open[gate.id] + 1 };
          assert.equal(couplingActive(level, closed, link), false);
          for (const direction of [-1, 1]) {
            const next = rotatePositions(level, open, operated, direction),
              inactive = rotatePositions(level, closed, operated, direction);
            assert.equal(
              next[link.id] - open[link.id],
              direction * link.direction,
            );
            assert.equal(inactive[link.id] - closed[link.id], 0);
          }
        }
  });
  test(`Lock ${level.numeral}: gating rewards ordering, verified against ungated play`, () => {
    const noGate = solve(level, initialState(level).positions, (p, id) =>
      (level.coupling[id] || []).every(
        (link) => !link.when || !couplingActive(level, p, link),
      ),
    );
    assert.ok(
      noGate === null || noGate.length > verifiedLevels[level.id].minimum,
    );
  });
}
test("Conditional turns use pre-step state and re-evaluate between detents", () => {
  const level = {
    rings: [
      { id: "a", symbols: ["key", "gate", "flame"], target: "key" },
      { id: "b", symbols: ["sun", "moon", "eye", "star"], target: "sun" },
    ],
    coupling: {
      a: [{ id: "b", direction: 1, when: { id: "a", symbol: "gate" } }],
    },
  };
  assert.deepEqual(rotatePositions(level, { a: 1, b: 0 }, "a", 3), {
    a: 4,
    b: 1,
  });
});
test("A batched swipe stops at success in later levels without changing Lock I bulk semantics", () => {
  const level = levels[1],
    positions = goals(level);
  positions.third = -1;
  const solved = reducePuzzle(
    level,
    { ...initialState(level), positions },
    { type: "rotate", id: "third", step: 4 },
  );
  assert.equal(solved.phase, "unlocking");
  assert.equal(solved.moves, 1);
  assert.equal(solved.positions.third, 0);
  const first = levels[0],
    p = goals(first);
  p.outer = -1;
  const result = reducePuzzle(
    first,
    { ...initialState(first), positions: p },
    { type: "rotate", id: "outer", step: 4 },
  );
  assert.equal(result.positions.outer, 3);
  assert.equal(result.moves, 4);
  assert.equal(result.phase, "playing");
});
test("Reverse graph audit independently agrees with forward BFS for the finale", () => {
  const level = levels[6],
    space = analyzeSpace(level);
  assert.equal(
    space.distances[space.encode(initialState(level).positions)],
    verifiedLevels[level.id].minimum,
  );
});

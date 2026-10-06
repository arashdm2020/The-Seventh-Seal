import { rotatePositions, wrap, isSolved } from "../src/game/lockRules.js";
import { initialState } from "../src/game/puzzleEngine.js";

// Development only: breadth-first search counts individual detents, including
// both directions. Conditional edges are evaluated by the production rules.
export function solve(
  level,
  start = initialState(level).positions,
  allowMove = () => true,
) {
  const bases = level.rings.map((r) => r.symbols.length);
  const size = bases.reduce((a, b) => a * b, 1);
  const encode = (positions) =>
    level.rings.reduce(
      (code, r, i) => code * bases[i] + wrap(positions[r.id], bases[i]),
      0,
    );
  const decode = (code) => {
    const positions = {};
    for (let i = bases.length - 1; i >= 0; i--) {
      positions[level.rings[i].id] = code % bases[i];
      code = Math.floor(code / bases[i]);
    }
    return positions;
  };
  const parents = new Int32Array(size).fill(-2);
  const actions = new Int8Array(size);
  const queue = new Int32Array(size);
  const first = encode(start);
  queue[0] = first;
  parents[first] = -1;
  let tail = 1;
  for (let head = 0; head < tail; head++) {
    const code = queue[head];
    const positions = decode(code);
    if (isSolved(level, positions)) {
      const moves = [];
      for (
        let cursor = code;
        parents[cursor] !== -1;
        cursor = parents[cursor]
      ) {
        const action = actions[cursor];
        moves.push({
          id: level.rings[Math.floor(action / 2)].id,
          step: action % 2 ? 1 : -1,
        });
      }
      return moves.reverse();
    }
    for (let i = 0; i < level.rings.length; i++)
      for (const step of [-1, 1]) {
        if (!allowMove(positions, level.rings[i].id, step)) continue;
        const next = encode(
          rotatePositions(level, positions, level.rings[i].id, step),
        );
        if (parents[next] !== -2) continue;
        parents[next] = code;
        actions[next] = i * 2 + (step === 1 ? 1 : 0);
        queue[tail++] = next;
      }
  }
  return null;
}

// Reverse the actual directed graph, rather than assuming a turn is reversible.
export function analyzeSpace(level) {
  const bases = level.rings.map((r) => r.symbols.length);
  const size = bases.reduce((a, b) => a * b, 1);
  const encode = (p) =>
    level.rings.reduce((c, r, i) => c * bases[i] + wrap(p[r.id], bases[i]), 0);
  const decode = (code) => {
    const p = {};
    for (let i = bases.length - 1; i >= 0; i--) {
      p[level.rings[i].id] = code % bases[i];
      code = Math.floor(code / bases[i]);
    }
    return p;
  };
  const incoming = Array.from({ length: size }, () => []);
  for (let code = 0; code < size; code++) {
    const p = decode(code);
    for (const r of level.rings)
      for (const step of [-1, 1])
        incoming[encode(rotatePositions(level, p, r.id, step))].push(code);
  }
  const target = encode(
    Object.fromEntries(
      level.rings.map((r) => [r.id, -r.symbols.indexOf(r.target)]),
    ),
  );
  const distances = new Int16Array(size).fill(-1),
    queue = [target];
  distances[target] = 0;
  for (let h = 0; h < queue.length; h++)
    for (const parent of incoming[queue[h]]) {
      if (distances[parent] !== -1) continue;
      distances[parent] = distances[queue[h]] + 1;
      queue.push(parent);
    }
  return { distances, decode, encode };
}

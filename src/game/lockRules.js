export const wrap = (value, count) => ((value % count) + count) % count;
export function alignedSymbol(ring, position) {
  return ring.symbols[wrap(-position, ring.symbols.length)];
}
export function isSolved(level, positions) {
  return level.rings.every(
    (ring) => alignedSymbol(ring, positions[ring.id]) === ring.target,
  );
}
export function couplingActive(level, positions, link) {
  if (!link.when) return true;
  const gate = level.rings.find((ring) => ring.id === link.when.id);
  return alignedSymbol(gate, positions[gate.id]) === link.when.symbol;
}
export function rotatePositions(level, positions, id, step) {
  if (!Number.isInteger(step) || !level.rings.some((r) => r.id === id))
    return positions;
  let next = { ...positions };
  const direction = Math.sign(step);
  // Evaluate each detent against its pre-turn state. Coupling never cascades.
  for (let click = 0; click < Math.abs(step); click++) {
    const before = next;
    next = { ...before, [id]: before[id] + direction };
    for (const linked of level.coupling[id] || []) {
      if (couplingActive(level, before, linked))
        next[linked.id] += direction * linked.direction;
    }
  }
  return next;
}

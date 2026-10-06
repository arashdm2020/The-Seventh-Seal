import { isSolved, rotatePositions } from "./lockRules.js";
export function initialState(level) {
  return {
    positions: Object.fromEntries(level.rings.map((r) => [r.id, r.initial])),
    selected: level.rings[0].id,
    moves: 0,
    hints: 0,
    phase: "playing",
    lastTurn: null,
  };
}
export function reducePuzzle(level, state, action) {
  if (action.type === "reset") return initialState(level);
  if (action.type === "complete" && state.phase === "unlocking")
    return { ...state, phase: "solved" };
  if (state.phase !== "playing") return state;
  if (action.type === "select" && level.rings.some((r) => r.id === action.id))
    return { ...state, selected: action.id };
  if (action.type === "hint")
    return { ...state, hints: Math.min(state.hints + 1, level.hints.length) };
  if (action.type === "rotate") {
    const id = action.id || state.selected;
    let positions = state.positions;
    let clicks = 0;
    if (level.id === "alignment") {
      positions = rotatePositions(level, positions, id, action.step);
      clicks = Math.abs(action.step);
    } else if (
      Number.isInteger(action.step) &&
      level.rings.some((r) => r.id === id)
    ) {
      for (let i = 0; i < Math.abs(action.step); i++) {
        positions = rotatePositions(
          level,
          positions,
          id,
          Math.sign(action.step),
        );
        clicks++;
        if (isSolved(level, positions)) break;
      }
    }
    if (positions === state.positions) return state;
    return {
      ...state,
      positions,
      moves: state.moves + clicks,
      lastTurn: {
        id,
        changes: Object.fromEntries(
          level.rings.map((r) => [
            r.id,
            positions[r.id] - state.positions[r.id],
          ]),
        ),
      },
      phase: isSolved(level, positions) ? "unlocking" : "playing",
    };
  }
  return state;
}

"use client";
import { useReducer, useState } from "react";
import { levels } from "../../game/levels";
import { initialState, reducePuzzle } from "../../game/puzzleEngine";
import { alignedSymbol, couplingActive } from "../../game/lockRules";
import { useLockSound } from "../../hooks/useLockSound";
import { useLockSequence } from "../../hooks/useLockSequence";
import { usePuzzleCalendar } from "../../hooks/usePuzzleCalendar";
import MechanicalLock from "./MechanicalLock";
import CluePanel from "./CluePanel";
import HintPanel from "./HintPanel";
import Inventory from "./Inventory";
import NoteInspector from "./NoteInspector";
import SuccessOverlay from "./SuccessOverlay";
import Symbol from "./Symbol";

export default function GameScreen() {
  const [index, setIndex] = useState(0);
  const [journey, setJourney] = useState(0);
  const [sound, setSound] = useState(false);
  const calendar = usePuzzleCalendar();
  const level = index === 3 ? calendar : levels[index];
  function beginAgain() {
    setIndex(0);
    setJourney(journey + 1);
  }
  return (
    <LockSession
      key={journey + ":" + index}
      level={level}
      index={index}
      sound={sound}
      toggleSound={() => setSound(!sound)}
      canContinue={index !== 2 || Boolean(calendar)}
      onContinue={() => setIndex(index + 1)}
      onBeginAgain={beginAgain}
    />
  );
}

function LockSession({
  level,
  index,
  sound,
  toggleSound,
  canContinue,
  onContinue,
  onBeginAgain,
}) {
  const [state, dispatch] = useReducer(
    (state, action) => reducePuzzle(level, state, action),
    level,
    initialState,
  );
  const [note, setNote] = useState(false);
  const [ending, setEnding] = useState(false);
  const tick = useLockSound(sound);
  useLockSequence(state.phase, dispatch);
  function reset() {
    dispatch({ type: "reset" });
    setEnding(false);
    setNote(false);
  }
  const selected = level.rings.find((r) => r.id === state.selected);
  const disabled = state.phase !== "playing";
  const gates = [
    ...new Map(
      Object.values(level.coupling)
        .flat()
        .filter((link) => link.when)
        .map((link) => [link.when.id + ":" + link.when.symbol, link]),
    ).values(),
  ];
  const responses = state.lastTurn
    ? level.rings.filter(
        (r) => r.id !== state.lastTurn.id && state.lastTurn.changes[r.id],
      )
    : [];
  const first = index === 0;
  return (
    <main className={`game-screen phase-${state.phase}`} data-level={level.id}>
      <header className="masthead">
        <div className="brand">
          SEVENFOLD<span>Seven locks. One buried truth.</span>
        </div>
        <span className="chapter-counter">
          CHAPTER <b>{String(index + 1).padStart(2, "0")}</b>
          <span>/ 07</span>
        </span>
      </header>
      <section
        className="game-content"
        aria-label={first ? "The first lock" : `Lock ${level.numeral}`}
      >
        <div className="chapter-heading">
          <span className="eyebrow">THE BOX HAS BEEN WAITING FOR YOU</span>
          <h1>
            LOCK {level.numeral} <span>—</span> {level.title}
          </h1>
          <p>
            {first
              ? "Align the four rings and reveal the first seal."
              : `Align the ${level.rings.length === 3 ? "three" : level.rings.length === 5 ? "five" : "four"} rings and reveal the ${level.ordinal.toLowerCase()} seal.`}
          </p>
        </div>
        <div className="puzzle-composition">
          <aside className="left-caption">
            <span className="vertical-rule" />
            <span className="eyebrow">
              {first
                ? "THE FIRST MECHANISM"
                : "THE " + level.ordinal + " MECHANISM"}
            </span>
            <p>
              Every turn
              <br />
              has a consequence.
            </p>
            <small>BRASS · STEEL · SECRETS</small>
          </aside>
          <div className="lock-column">
            <MechanicalLock
              level={level}
              state={state}
              dispatch={dispatch}
              tick={tick}
            />
            <div
              className={`ring-selector ${level.rings.length === 5 ? "five-rings" : ""}`}
              aria-label="Select ring"
              onKeyDown={(e) => {
                if (
                  !disabled &&
                  (e.key === "ArrowLeft" || e.key === "ArrowRight")
                ) {
                  e.preventDefault();
                  dispatch({
                    type: "rotate",
                    step: e.key === "ArrowRight" ? 1 : -1,
                  });
                  tick();
                }
              }}
            >
              {level.rings.map((ring, i) => (
                <button
                  key={ring.id}
                  aria-pressed={state.selected === ring.id}
                  aria-label={`Select ${ring.name} ring`}
                  disabled={disabled}
                  onClick={() => dispatch({ type: "select", id: ring.id })}
                >
                  <span>0{i + 1}</span>
                  {ring.name}
                </button>
              ))}
            </div>
            <p className="interaction-help">
              Select a ring · Drag or scroll to turn · ← →
            </p>
            <div className="lock-status" aria-live="polite">
              {disabled
                ? "The mechanism yields."
                : `${selected.name} selected · ${alignedSymbol(selected, state.positions[selected.id])} at the marker`}
            </div>
            <span className="sr-only" aria-live="polite">
              {state.lastTurn &&
                `${level.rings.find((r) => r.id === state.lastTurn.id).name} turned.${responses.length ? " " + responses.map((r) => r.name).join(" and ") + " responded." : ""}`}
            </span>
            {gates.length > 0 && (
              <div className="gate-indicators" aria-label="Mechanical passages">
                {gates.map((link) => {
                  const gate = level.rings.find((r) => r.id === link.when.id);
                  const active = couplingActive(level, state.positions, link);
                  return (
                    <span
                      key={gate.id + link.when.symbol}
                      className={active ? "gate-open" : ""}
                      aria-label={`${gate.name} at ${link.when.symbol}: passage ${active ? "open" : "closed"}`}
                    >
                      <Symbol
                        name={link.when.symbol}
                        width="19"
                        height="19"
                        aria-hidden="true"
                      />
                      {gate.name}
                      <i aria-hidden="true" />
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <CluePanel level={level} />
        </div>
        <HintPanel hints={level.hints} count={state.hints} />
      </section>
      <footer className="game-footer">
        <Inventory onInspect={() => setNote(true)} disabled={disabled} />
        <div className="controls">
          <button
            onClick={() => dispatch({ type: "hint" })}
            disabled={disabled || state.hints === 3}
          >
            Hint{" "}
            <span
              className="hint-dots"
              aria-label={`${3 - state.hints} hints remaining`}
            >
              {[0, 1, 2].map((i) => (
                <i key={i} className={i < 3 - state.hints ? "available" : ""} />
              ))}
            </span>
          </button>
          <button onClick={reset}>
            ↺ <span>Reset</span>
          </button>
          <button
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={`Turn sound ${sound ? "off" : "on"}`}
          >
            ♪ <span>Sound {sound ? "on" : "off"}</span>
          </button>
        </div>
      </footer>
      {note && (
        <NoteInspector
          level={level}
          archive={levels.slice(0, index)}
          onClose={() => setNote(false)}
        />
      )}
      {state.phase === "solved" && (
        <SuccessOverlay
          level={level}
          final={index === 6}
          ending={ending}
          canContinue={canContinue}
          onContinue={index === 6 ? () => setEnding(true) : onContinue}
          onReset={reset}
          onBeginAgain={onBeginAgain}
        />
      )}
    </main>
  );
}

"use client";
import { useRef } from "react";
import LockRing from "./LockRing";
import { useLockInteraction } from "../../hooks/useLockInteraction";
import { layoutRings } from "../../visuals/ringLayout";
export default function MechanicalLock({ level, state, dispatch, tick }) {
  const ref = useRef(null);
  const events = useLockInteraction(
    ref,
    state.selected,
    state.phase !== "playing",
    dispatch,
    tick,
  );
  return (
    <div className={`lock-stage ${state.phase}`}>
      <span className="corner top-left" />
      <span className="corner top-right" />
      <span className="corner bottom-left" />
      <span className="corner bottom-right" />
      <svg
        ref={ref}
        {...events}
        tabIndex={0}
        role="group"
        aria-label="Mechanical lock. Select a ring, then drag horizontally, scroll, or use the left and right arrow keys."
        className="mechanical-lock"
        viewBox="-290 -290 580 580"
      >
        <defs>
          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#766044" />
            <stop offset=".25" stopColor="#342d24" />
            <stop offset=".5" stopColor="#574831" />
            <stop offset=".8" stopColor="#27251f" />
            <stop offset="1" stopColor="#746044" />
          </linearGradient>
          <radialGradient id="base">
            <stop stopColor="#292720" />
            <stop offset="1" stopColor="#0b0d0c" />
          </radialGradient>
        </defs>
        <circle r="271" fill="url(#base)" stroke="#4d4030" strokeWidth="3" />
        <circle r="264" fill="none" stroke="#88704b" strokeWidth="1" />
        {Array.from({ length: 72 }, (_, i) => (
          <path
            key={i}
            d={i % 3 === 0 ? "M0 -260V-252" : "M0 -260V-257"}
            transform={`rotate(${i * 5})`}
            stroke="#806b47"
            opacity=".6"
          />
        ))}
        {layoutRings(level).map((ring) => (
          <LockRing
            key={ring.id}
            ring={ring}
            position={state.positions[ring.id]}
            selected={state.selected === ring.id}
            feedback={
              state.lastTurn?.changes[ring.id]
                ? state.lastTurn.id === ring.id
                  ? "direct"
                  : "coupled"
                : null
            }
            turn={state.moves}
          />
        ))}
        <g className="center-emblem">
          <circle r="43" fill="url(#base)" stroke="#a18653" />
          <path
            d="M0 -29 25 -14V14L0 29 -25 14V-14Z M0 -20 17 -10V10L0 20 -17 10V-10Z M0 -20V20 M-17 -10 17 10 M17 -10 -17 10"
            fill="none"
            stroke="#a18653"
          />
          <circle r="5" fill="#b99a60" />
        </g>
        <g className="alignment-marker">
          <path d="M-9 -281H9L0 -258Z" fill="#d8b878" />
          <path
            d="M0 -250V-45"
            stroke="#e6c88a"
            strokeWidth="1"
            opacity=".2"
            strokeDasharray="2 7"
          />
        </g>
        <circle
          className="seal-pulse"
          r="40"
          fill="none"
          stroke="#efd8a2"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

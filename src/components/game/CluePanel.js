"use client";
import { Fragment, useEffect, useRef } from "react";
export default function CluePanel({ level }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.open = !window.matchMedia("(max-width: 680px)").matches;
  }, []);
  return (
    <details ref={ref} className="clue-panel" open>
      <summary>
        The inscription <span>↗</span>
      </summary>
      <div className="parchment">
        <span className="paper-label">A WORD FROM THE MAKER</span>
        <div className="paper-ornament">◇</div>
        {level.inscription ? (
          <p>
            {level.inscription.split("\n").map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        ) : (
          <p>
            Everything has its place.
            <br />
            When heaven and earth
            <br />
            face the same path,
            <br />
            the first seal will yield.
          </p>
        )}
        <span className="paper-rule" />
        {level.calendar ? (
          <small className="calendar-page">
            {level.calendar.stopped
              ? "The calendar has stopped at"
              : "The calendar page"}
            <br />
            <strong>{level.calendar.label}</strong>
          </small>
        ) : (
          <small>
            Some truths are written.
            <br />
            Others must be turned.
          </small>
        )}
      </div>
    </details>
  );
}

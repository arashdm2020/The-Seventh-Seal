export default function HintPanel({ hints, count }) {
  return (
    <div className="hint-panel" aria-live="polite">
      {count > 0 && (
        <>
          <span className="eyebrow">WHISPER {count} / 3</span>
          <p>{hints[count - 1]}</p>
        </>
      )}
    </div>
  );
}

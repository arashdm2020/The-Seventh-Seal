import Dialog from "./Dialog";
export default function SuccessOverlay({
  level,
  final,
  ending,
  canContinue,
  onContinue,
  onReset,
  onBeginAgain,
}) {
  return (
    <Dialog
      label={
        ending
          ? "The truth is unbound"
          : "The " + level.ordinal.toLowerCase() + " seal is broken"
      }
      className="success-dialog"
    >
      <span className="seal-mark">◇</span>
      <span className="eyebrow">
        {ending
          ? "SEVEN OF SEVEN"
          : level.numeral === "I"
            ? "ONE OF SEVEN"
            : level.ordinal + " OF SEVEN"}
      </span>
      <h2>
        {ending
          ? "THE TRUTH IS UNBOUND"
          : "THE " + level.ordinal + " SEAL IS BROKEN"}
      </h2>
      <p>
        {ending
          ? "The box opens. Vale’s ledger names the council’s lie and every life the river took. You carry it into the light. Mira’s name will be remembered."
          : level.fragment}
      </p>
      {ending ? (
        <button className="primary" onClick={onBeginAgain}>
          Begin again <span>↺</span>
        </button>
      ) : (
        <>
          <button
            className="primary"
            onClick={onContinue}
            disabled={!canContinue}
          >
            {canContinue
              ? final
                ? "Open the ledger"
                : "Continue"
              : "Reading the calendar…"}{" "}
            <span>→</span>
          </button>
          <button className="replay" onClick={onReset}>
            {level.numeral === "I"
              ? "Replay the first lock"
              : "Replay this lock"}
          </button>
        </>
      )}
    </Dialog>
  );
}

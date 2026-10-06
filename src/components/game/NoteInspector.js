import Dialog from "./Dialog";
export default function NoteInspector({ level, archive, onClose }) {
  return (
    <Dialog label="Inspect Torn Note" onClose={onClose} className="note-dialog">
      <button className="close" aria-label="Close note" onClick={onClose}>
        ×
      </button>
      <span className="paper-label">A FRAGMENT, FOUND IN THE BOX</span>
      <h2>Torn Note</h2>
      {level.note ? (
        <p>{level.note}</p>
      ) : (
        <p>
          “Beyond the sun, beneath the mountain,
          <br />
          an open eye watches the branching way.”
        </p>
      )}
      <div className="paper-rule" />
      <small>
        {level.noteFooter || "Four names. From the edge to the heart."}
      </small>
      {archive.length > 0 && (
        <details className="recalled-pages">
          <summary>Recalled pages</summary>
          {archive.map((page) => (
            <section key={page.id}>
              <span className="paper-label">SEAL {page.numeral}</span>
              <p>{page.fragment}</p>
            </section>
          ))}
        </details>
      )}
    </Dialog>
  );
}

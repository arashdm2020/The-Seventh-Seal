export default function Inventory({ onInspect, disabled }) {
  return (
    <div className="inventory">
      <span className="eyebrow">IN YOUR POSSESSION</span>
      <button
        className="inventory-item"
        onClick={onInspect}
        disabled={disabled}
      >
        <span className="note-icon" aria-hidden="true">
          ≋
        </span>
        <span>
          Torn Note<small>Inspect item</small>
        </span>
        <span className="inventory-arrow">↗</span>
      </button>
    </div>
  );
}

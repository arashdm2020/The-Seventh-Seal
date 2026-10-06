import Symbol from "./Symbol";
export default function LockRing({ ring, position, selected, feedback, turn }) {
  return (
    <g
      data-ring={ring.id}
      className={`lock-ring ${selected ? "selected" : ""}`}
      style={{
        transform: `rotate(${(position * 360) / ring.symbols.length}deg)`,
      }}
    >
      <circle r={ring.radius} className="ring-body" strokeWidth={ring.width} />
      <circle r={ring.radius + ring.width / 2 - 2} className="rim" />
      <circle r={ring.radius - ring.width / 2 + 2} className="rim" />
      {ring.symbols.map((name, i) => (
        <g
          key={name}
          transform={`rotate(${(i * 360) / ring.symbols.length}) translate(0 ${-ring.radius})`}
        >
          <path
            className="engraving"
            d={`M-17 ${-ring.width / 2 + 9}H17 M-3 ${ring.width / 2 - 7}H3`}
          />
          <Symbol
            name={name}
            x={-ring.symbolSize / 2}
            y={-ring.symbolSize / 2}
            width={ring.symbolSize}
            height={ring.symbolSize}
          />
        </g>
      ))}
      {feedback && (
        <circle
          key={turn}
          data-feedback={feedback}
          className={`turn-response ${feedback}`}
          r={ring.radius}
          fill="none"
          strokeWidth={ring.width - 3}
          pointerEvents="none"
        />
      )}
    </g>
  );
}

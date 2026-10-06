export function layoutRings(level) {
  const count = level.rings.length;
  const outside = 257,
    inside = 47,
    gap = count >= 5 ? 4 : 12;
  const width = (outside - inside - gap * (count - 1)) / count;
  return level.rings.map((ring, i) => {
    // Lock I's authored dimensions are preserved exactly. All later rings size
    // themselves from the available annulus and the configuration's ring count.
    const radius = ring.radius ?? outside - width / 2 - i * (width + gap);
    const thickness = ring.width ?? width;
    const symbolSize = Math.min(
      30,
      thickness - 12,
      2 * radius * Math.sin(Math.PI / ring.symbols.length) - 8,
    );
    return { ...ring, radius, width: thickness, symbolSize };
  });
}

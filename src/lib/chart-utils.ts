/**
 * De-overlap labels so nearby positions don't stack on top of each other.
 * Nudges labels apart vertically when they're too close.
 */
export function deOverlapLabels(
  items: { id: string; y: number }[],
  minGap: number
): Map<string, number> {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) {
    const diff = sorted[i].y - sorted[i - 1].y;
    if (diff < minGap) {
      sorted[i].y = sorted[i - 1].y + minGap;
    }
  }
  return new Map(sorted.map((s) => [s.id, s.y]));
}

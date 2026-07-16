/** Format a 0-1 or 0-100 ratio as a percentage string. */
export function formatPercent(value: number, alreadyPercent = false): string {
  const pct = alreadyPercent ? value : value * 100;
  return `${pct.toFixed(1)}%`;
}

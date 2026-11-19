/**
 * Helper formatter functions for the S-Tidy application.
 */

/**
 * Format decimal numbers using Indonesian comma separator (e.g., 15.5 -> "15,5")
 */
export function formatDecimal(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toString().replace('.', ',');
}

/**
 * Extract the first letter as uppercase for avatar fallback
 */
export function getInitialLetter(name: string): string {
  if (!name || name.trim().length === 0) return '?';
  return name.trim().charAt(0).toUpperCase();
}


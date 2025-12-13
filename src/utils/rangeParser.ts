/**
 * Shared utility for parsing status code ranges.
 * Used by both statusMapper and statusColor utilities.
 */

/**
 * Parses a range string into [min, maxInclusive] bounds.
 * - Single numbers like "0" or "200" are treated as ranges [n, n+1]
 * - Range strings like "200-300" are parsed as [200, 301] inclusive
 * Returns null if not a valid format.
 */
export function parseRange(rangeStr: string): [number, number] | null {
  // Check if it's a single number (e.g., "0", "200")
  const singleNumberMatch = rangeStr.match(/^(\d+)$/);
  if (singleNumberMatch) {
    const num = parseInt(singleNumberMatch[1], 10);
    if (isNaN(num)) {
      return null;
    }
    // Treat single number as range [n, n+1]
    return [num, num + 1];
  }

  // Check if it's a range (e.g., "200-300")
  const rangeMatch = rangeStr.match(/^(\d+)-(\d+)$/);
  if (!rangeMatch) {
    return null;
  }
  const min = parseInt(rangeMatch[1], 10);
  const maxInclusive = parseInt(rangeMatch[2], 10) + 1; // Add 1 so '200-300' includes 301
  if (isNaN(min) || isNaN(maxInclusive) || min > maxInclusive) {
    return null;
  }
  return [min, maxInclusive];
}

/**
 * Checks if a status code falls within a range [min, maxInclusive] inclusive on both ends.
 */
export function isInRange(statusCode: number, min: number, maxInclusive: number): boolean {
  return statusCode >= min && statusCode <= maxInclusive;
}


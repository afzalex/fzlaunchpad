import type { AppConfig } from './configLoader';

export type ServiceStatus = string; // Allow any string for custom status names

/**
 * Parses a range string into [min, maxInclusive] bounds.
 * - Single numbers like "0" or "200" are treated as ranges [n, n+1]
 * - Range strings like "200-300" are parsed as [200, 301] inclusive
 * - So "200-300" means [200, 301] inclusive, which includes 200, 201, ..., 300, and 301
 * Returns null if not a valid format.
 */
function parseRange(rangeStr: string): [number, number] | null {
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
function isInRange(statusCode: number, min: number, maxInclusive: number): boolean {
  return statusCode >= min && statusCode <= maxInclusive;
}

/**
 * Maps an HTTP status code to a service status name using the statusMapping configuration.
 * Numerically checks the status code against configured ranges.
 * 
 * All mappings are treated as ranges:
 * - Single numbers like "0" are treated as [0, 1]
 * - Single numbers like "200" are treated as [200, 201]
 * - Range strings like "200-300" are treated as [200, 301]
 * 
 * Ranges are sorted by specificity (smaller ranges first) for more specific matches.
 * 
 * Example: 
 * - '0': 'stopped' maps status code 0 to 'stopped' (treated as [0, 1])
 * - '200-300': 'mysuccess' maps status codes 200-301 to 'mysuccess' (treated as [200, 301])
 */
export function mapStatusCodeToStatus(
  statusCode: number,
  statusMapping?: AppConfig['statusMapping']
): ServiceStatus {
  if (!statusMapping) {
    // Default fallback mapping
    if (statusCode === 0) return 'stopped';
    if (statusCode >= 200 && statusCode < 300) return 'running';
    if (statusCode >= 300 && statusCode < 400) return 'running';
    if (statusCode >= 400 && statusCode < 500) return 'error';
    if (statusCode >= 500 && statusCode < 600) return 'warning';
    return 'stopped';
  }

  // Check all mappings as ranges (including single numbers like "0" or "200")
  // Sort ranges by specificity (smaller ranges first) for more specific matches
  const rangeEntries = Object.entries(statusMapping)
    .map(([key, value]) => {
      const range = parseRange(key);
      if (!range) return null;
      return { key, value, range, width: range[1] - range[0] };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  // Check if status code falls within any configured range
  for (const { value, range } of rangeEntries) {
    if (isInRange(statusCode, range[0], range[1])) {
      return value;
    }
  }

  return 'uknown';
}


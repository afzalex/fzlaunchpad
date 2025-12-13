import type { AppConfig } from './configLoader';
import { parseRange, isInRange } from './rangeParser';
import { DEFAULT_STATUS_MAPPING, DEFAULT_STATUS_NAME, DEFAULT_STATUS_COLORS, DEFAULT_COLOR, HTTP_STATUS_RANGES } from './constants';

export type ServiceStatus = string; // Allow any string for custom status names

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
  const mapping = statusMapping || DEFAULT_STATUS_MAPPING;

  const rangeEntries = Object.entries(mapping)
    .map(([key, value]) => {
      const range = parseRange(key);
      if (!range) return null;
      return { key, value, range, width: range[1] - range[0] };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => a.width - b.width);

  for (const { value, range } of rangeEntries) {
    if (isInRange(statusCode, range[0], range[1])) {
      return value;
    }
  }

  return DEFAULT_STATUS_NAME;
}

/**
 * Gets the default color for a status code based on HTTP status ranges.
 */
function getDefaultColorForStatusCode(statusCode: number): string {
  if (statusCode === 0) return DEFAULT_STATUS_COLORS['0'];
  if (statusCode >= HTTP_STATUS_RANGES.SUCCESS.min && statusCode <= HTTP_STATUS_RANGES.SUCCESS.max) {
    return DEFAULT_STATUS_COLORS['200-299'];
  }
  if (statusCode >= HTTP_STATUS_RANGES.REDIRECT.min && statusCode <= HTTP_STATUS_RANGES.REDIRECT.max) {
    return DEFAULT_STATUS_COLORS['300-399'];
  }
  if (statusCode >= HTTP_STATUS_RANGES.CLIENT_ERROR.min && statusCode <= HTTP_STATUS_RANGES.CLIENT_ERROR.max) {
    return DEFAULT_STATUS_COLORS['400-499'];
  }
  if (statusCode >= HTTP_STATUS_RANGES.SERVER_ERROR.min && statusCode <= HTTP_STATUS_RANGES.SERVER_ERROR.max) {
    return DEFAULT_STATUS_COLORS['500-599'];
  }
  return DEFAULT_COLOR;
}

/**
 * Gets the color for a status code by looking it up directly in serviceStatus configuration.
 * Uses the same range parsing logic as statusMapping.
 */
export function getStatusColorForCode(
  statusCode: number | undefined,
  serviceStatus?: AppConfig['theme']['colors']['serviceStatus']
): string {
  // Handle checking state (undefined statusCode means checking)
  if (statusCode === undefined) {
    // Return a neutral color for checking state (can be customized in config)
    return serviceStatus?.['checking'] || '#3b82f6'; // Default to blue for checking
  }

  if (!serviceStatus) {
    return getDefaultColorForStatusCode(statusCode);
  }

  const rangeEntries = Object.entries(serviceStatus)
    .map(([key, color]) => {
      const range = parseRange(key);
      if (!range) return null;
      return { key, color, range, width: range[1] - range[0] };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => a.width - b.width);

  for (const { color, range } of rangeEntries) {
    if (isInRange(statusCode, range[0], range[1])) {
      return color;
    }
  }

  return getDefaultColorForStatusCode(statusCode);
}

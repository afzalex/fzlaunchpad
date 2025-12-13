/**
 * Application-wide constants
 */

// Health check configuration
export const HEALTH_CHECK_TIMEOUT_MS = 5000; // 5 seconds
export const HEALTH_CHECK_INTERVAL_MS = 30000; // 30 seconds

// HTTP status code ranges
export const HTTP_STATUS_RANGES = {
  SUCCESS: { min: 200, max: 299 },
  REDIRECT: { min: 300, max: 399 },
  CLIENT_ERROR: { min: 400, max: 499 },
  SERVER_ERROR: { min: 500, max: 599 },
} as const;

// Default status code to status name mapping
export const DEFAULT_STATUS_MAPPING = {
  '0': 'stopped',
  '200-299': 'running',
  '300-399': 'running',
  '400-499': 'error',
  '500-599': 'warning',
} as const;

// Default status code to color mapping
export const DEFAULT_STATUS_COLORS = {
  '0': '#808080',        // Gray for stopped/unreachable
  '200-299': '#10b981',  // Green for success
  '300-399': '#3b82f6',  // Blue for redirect
  '400-499': '#ef4444',  // Red for client error
  '500-599': '#f59e0b',  // Orange for server error
} as const;

// Default fallback values
export const DEFAULT_STATUS_NAME = 'stopped';
export const DEFAULT_COLOR = '#808080';


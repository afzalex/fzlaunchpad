/**
 * Replaces placeholders in text content with their actual values.
 * Supported placeholders:
 * 
 * Date/Time:
 * - {year} - Current year (e.g., 2024)
 * - {month} - Current month number (1-12)
 * - {monthName} - Current month name (e.g., January)
 * - {monthShort} - Current month short name (e.g., Jan)
 * - {day} - Day of month (1-31)
 * - {weekday} - Day of week name (e.g., Monday)
 * - {weekdayShort} - Day of week short name (e.g., Mon)
 * - {date} - Full date (e.g., 2024-01-15)
 * - {dateUS} - US date format (e.g., 01/15/2024)
 * - {dateEU} - EU date format (e.g., 15/01/2024)
 * - {time} - Current time (e.g., 14:30:45)
 * - {time12} - 12-hour time format (e.g., 2:30 PM)
 * - {hour} - Current hour (0-23)
 * - {hour12} - 12-hour format hour (1-12)
 * - {minute} - Current minute (0-59)
 * - {second} - Current second (0-59)
 * - {ampm} - AM/PM indicator
 * 
 * URL:
 * - {url} - Full URL
 * - {hostname} - Hostname (e.g., example.com)
 * - {host} - Host with port if present
 * - {pathname} - Pathname (e.g., /path/to/page)
 * - {origin} - Origin (e.g., https://example.com)
 * - {protocol} - Protocol (e.g., https:)
 * - {port} - Port if present
 * - {search} - Query string (e.g., ?key=value)
 * - {hash} - Hash (e.g., #section)
 */

// Constants for date/time formatting
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] as const;

const WEEKDAY_SHORT_NAMES = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
] as const;

/**
 * Formats a number with zero-padding to 2 digits.
 */
function padZero(value: number): string {
  return value.toString().padStart(2, '0');
}

/**
 * Gets the current date/time values for placeholder replacement.
 */
function getDateTimeValues(now: Date) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate(); // 1-31
  const hour = now.getHours(); // 0-23
  const minute = now.getMinutes(); // 0-59
  const second = now.getSeconds(); // 0-59
  const monthIndex = now.getMonth();
  const dayOfWeek = now.getDay();

  const hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  return {
    year: year.toString(),
    month: padZero(month),
    monthName: MONTH_NAMES[monthIndex],
    monthShort: MONTH_SHORT_NAMES[monthIndex],
    day: padZero(day),
    weekday: WEEKDAY_NAMES[dayOfWeek],
    weekdayShort: WEEKDAY_SHORT_NAMES[dayOfWeek],
    date: `${year}-${padZero(month)}-${padZero(day)}`,
    dateUS: `${padZero(month)}/${padZero(day)}/${year}`,
    dateEU: `${padZero(day)}/${padZero(month)}/${year}`,
    time: `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`,
    time12: `${hour12}:${padZero(minute)} ${ampm}`,
    hour: padZero(hour),
    hour12: hour12.toString(),
    minute: padZero(minute),
    second: padZero(second),
    ampm,
  };
}

/**
 * Gets URL values for placeholder replacement.
 * Returns null if not in browser environment or URL parsing fails.
 */
function getUrlValues(): Record<string, string> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const url = new URL(window.location.href);
    return {
      url: url.href,
      hostname: url.hostname,
      host: url.host,
      pathname: url.pathname,
      origin: url.origin,
      protocol: url.protocol,
      port: url.port || '',
      search: url.search,
      hash: url.hash,
    };
  } catch (error) {
    console.warn('Failed to parse URL for placeholder replacement:', error);
    return null;
  }
}

/**
 * Replaces placeholders in text content with their actual values.
 * 
 * @param text - The text containing placeholders to replace
 * @returns The text with all placeholders replaced
 */
export function replacePlaceholders(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  const now = new Date();
  const dateTimeValues = getDateTimeValues(now);
  const urlValues = getUrlValues();

  let result = text;

  // Replace date/time placeholders
  for (const [key, value] of Object.entries(dateTimeValues)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }

  // Replace URL placeholders if available
  if (urlValues) {
    for (const [key, value] of Object.entries(urlValues)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
  }

  return result;
}


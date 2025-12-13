import type { IconType } from 'react-icons';
import * as MdIcons from 'react-icons/md';

/**
 * Cache for dynamically loaded icons to avoid repeated lookups
 */
const iconCache = new Map<string, IconType>();

/**
 * Gets a Material Design icon by name.
 * Supports ALL icons from react-icons/md package dynamically.
 * 
 * Icons are accessed from the imported namespace, allowing any Material Design
 * icon to be used without hardcoding. Icons are cached after first access
 * for better performance.
 * 
 * Material Design icon lists:
 * - https://fonts.google.com/icons
 * - https://react-icons.github.io/react-icons/icons/md/
 * 
 * @param iconName - The name of the icon (e.g., "MdHome", "MdSettings", "MdCloud", "MdRocket")
 *                   Must match the exact export name from react-icons/md
 * @returns The icon component or undefined if not found
 * 
 * @example
 * ```typescript
 * // Works with any Material Design icon
 * const HomeIcon = getIcon('MdHome');
 * const RocketIcon = getIcon('MdRocket');
 * const CustomIcon = getIcon('MdAccountCircle');
 * ```
 */
export function getIcon(iconName: string): IconType | undefined {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName);
  }

  const iconModule = MdIcons as Record<string, IconType | undefined>;
  const Icon = iconModule[iconName];

  if (Icon && typeof Icon === 'function') {
    iconCache.set(iconName, Icon);
    return Icon;
  }

  return undefined;
}

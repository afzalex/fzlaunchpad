import type { IconType } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

/**
 * Cache for dynamically loaded icons to avoid repeated lookups
 */
const iconCache = new Map<string, IconType>();

/**
 * Gets an icon by name, supporting both Font Awesome and Material Design icons.
 * Automatically detects the icon set based on the prefix (Fa* for Font Awesome, Md* for Material Design).
 * 
 * Icons are accessed from the imported namespace, allowing any icon from either set
 * to be used without hardcoding. Icons are cached after first access for better performance.
 * 
 * Icon lists:
 * - Font Awesome: https://react-icons.github.io/react-icons/icons/fa/
 * - Material Design: https://fonts.google.com/icons, https://react-icons.github.io/react-icons/icons/md/
 * 
 * @param iconName - The name of the icon (e.g., "FaServer", "MdHome", "FaDatabase", "MdSettings")
 *                   Must match the exact export name from react-icons/fa or react-icons/md
 *                   - Font Awesome icons start with "Fa" (e.g., "FaServer", "FaDatabase")
 *                   - Material Design icons start with "Md" (e.g., "MdHome", "MdSettings")
 * @returns The icon component or undefined if not found
 * 
 * @example
 * ```typescript
 * // Font Awesome icons
 * const ServerIcon = getIcon('FaServer');
 * const DatabaseIcon = getIcon('FaDatabase');
 * 
 * // Material Design icons
 * const HomeIcon = getIcon('MdHome');
 * const SettingsIcon = getIcon('MdSettings');
 * ```
 */
export function getIcon(iconName: string): IconType | undefined {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName);
  }

  // Determine icon set based on prefix
  const isFontAwesome = iconName.startsWith('Fa');
  const iconModule = (isFontAwesome ? FaIcons : MdIcons) as Record<string, IconType | undefined>;
  const Icon = iconModule[iconName];

  if (Icon && typeof Icon === 'function') {
    iconCache.set(iconName, Icon);
    return Icon;
  }

  return undefined;
}

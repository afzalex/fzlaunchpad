import type { AppConfig } from './configLoader';
import { mapStatusCodeToStatus } from './statusMapper';
import type { ServiceStatus } from './statusMapper';

export function getStatusColorForCode(
  statusCode: number,
  statusName?: ServiceStatus,
  serviceStatus?: AppConfig['theme']['colors']['serviceStatus'],
  statusMapping?: AppConfig['statusMapping']
): string {
  // If we have a status name directly, use it to get the color
  if (statusName && serviceStatus && serviceStatus[statusName]) {
    return serviceStatus[statusName];
  }

  // Map HTTP status code to service status name using the same utility
  const mappedStatusName = mapStatusCodeToStatus(statusCode, statusMapping);

  // Get color for the mapped service status name
  if (serviceStatus && serviceStatus[mappedStatusName]) {
    return serviceStatus[mappedStatusName];
  }

  // Fallback to default colors if not configured
  if (statusCode === 0) return '#808080';
  if (statusCode >= 200 && statusCode < 300) return '#10b981';
  if (statusCode >= 300 && statusCode < 400) return '#3b82f6';
  if (statusCode >= 400 && statusCode < 500) return '#ef4444';
  if (statusCode >= 500 && statusCode < 600) return '#f59e0b';
  return '#808080';
}


import type { AppConfig } from './configLoader';

export function getStatusColorForCode(
  statusCode: number,
  serviceStatus?: AppConfig['theme']['colors']['serviceStatus']
): string {
  if (!serviceStatus) {
    // Default colors if not configured
    if (statusCode === 0) return '#808080';
    if (statusCode >= 200 && statusCode < 300) return '#10b981';
    if (statusCode >= 300 && statusCode < 400) return '#3b82f6';
    if (statusCode >= 400 && statusCode < 500) return '#ef4444';
    if (statusCode >= 500 && statusCode < 600) return '#f59e0b';
    return '#808080';
  }

  // Check exact match first
  if (serviceStatus[statusCode.toString()]) {
    return serviceStatus[statusCode.toString()];
  }

  // Check ranges
  if (statusCode === 0 && serviceStatus['0']) {
    return serviceStatus['0'];
  }
  if (statusCode >= 200 && statusCode < 300 && serviceStatus['200-299']) {
    return serviceStatus['200-299'];
  }
  if (statusCode >= 300 && statusCode < 400 && serviceStatus['300-399']) {
    return serviceStatus['300-399'];
  }
  if (statusCode >= 400 && statusCode < 500 && serviceStatus['400-499']) {
    return serviceStatus['400-499'];
  }
  if (statusCode >= 500 && statusCode < 600 && serviceStatus['500-599']) {
    return serviceStatus['500-599'];
  }

  // Fallback
  return serviceStatus['0'] || '#808080';
}


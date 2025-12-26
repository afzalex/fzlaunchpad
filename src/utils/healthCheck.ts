import type { AppConfig } from './configLoader';
import { mapStatusCodeToStatus, type ServiceStatus } from './statusMapper';
import { HEALTH_CHECK_TIMEOUT_MS } from './constants';

export type { ServiceStatus };

export type CheckMethod = 'normal' | 'no-cors' | 'error' | 'timeout' | 'no-url';

export interface HealthCheckResult {
  status: ServiceStatus;
  statusCode: number;
  checkMethod: CheckMethod;
}

function isCorsError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return error.message.includes('CORS') || 
           error.message.includes('Failed to fetch') ||
           error.message.includes('NetworkError');
  }
  return false;
}

export async function checkServiceHealth(
  healthCheckUrl: string,
  statusMapping?: AppConfig['statusMapping']
): Promise<HealthCheckResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);

    // Try CORS request first
    let response: Response;
    try {
      response = await fetch(healthCheckUrl, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
        redirect: 'manual'
      });
    } catch (corsError) {
      // If CORS fails, try no-cors mode (but we won't get status code)
      if (isCorsError(corsError)) {
        console.warn(`CORS error for ${healthCheckUrl}, trying no-cors mode`);
        try {
          await fetch(healthCheckUrl, {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors',
            credentials: 'omit',
            redirect: 'manual'
          });
          clearTimeout(timeoutId);
          // With no-cors, we can't read the response, but if it didn't throw, assume it's reachable
          const assumedStatus = mapStatusCodeToStatus(200, statusMapping);
          return {
            status: assumedStatus,
            statusCode: 200, // Assume success if no-cors works
            checkMethod: 'no-cors',
          };
        } catch {
          clearTimeout(timeoutId);
          throw corsError; // Throw original CORS error
        }
      }
      throw corsError;
    }

    clearTimeout(timeoutId);

    // Map HTTP status code to service status using configuration
    const status = mapStatusCodeToStatus(response.status, statusMapping);

    return {
      status,
      statusCode: response.status,
      checkMethod: 'normal',
    };
  } catch (error) {
    // Network error, CORS error, or timeout
    if (isCorsError(error)) {
      console.warn(`CORS blocked health check for ${healthCheckUrl}. Consider using a proxy or enabling CORS on the service.`);
    } else {
      console.warn(`Health check failed for ${healthCheckUrl}:`, error);
    }
    const status = mapStatusCodeToStatus(0, statusMapping);
    const checkMethod: CheckMethod = error instanceof Error && error.name === 'AbortError' ? 'timeout' : 'error';
    return {
      status,
      statusCode: 0,
      checkMethod,
    };
  }
}

export async function checkMultipleServices(
  services: Array<{ healthCheckUrl?: string }>,
  statusMapping?: AppConfig['statusMapping']
): Promise<HealthCheckResult[]> {
  const promises = services.map((service) => {
    if (service.healthCheckUrl) {
      return checkServiceHealth(service.healthCheckUrl, statusMapping);
    }
    const status = mapStatusCodeToStatus(0, statusMapping);
    return Promise.resolve({
      status,
      statusCode: 0,
      checkMethod: 'no-url' as CheckMethod,
    });
  });

  return Promise.all(promises);
}


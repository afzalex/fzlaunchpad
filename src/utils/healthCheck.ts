export type ServiceStatus = 'running' | 'stopped' | 'error' | 'warning';

export interface HealthCheckResult {
  status: ServiceStatus;
  statusCode: number;
}

function isCorsError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return error.message.includes('CORS') || 
           error.message.includes('Failed to fetch') ||
           error.message.includes('NetworkError');
  }
  return false;
}

export async function checkServiceHealth(healthCheckUrl: string): Promise<HealthCheckResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Try CORS request first
    let response: Response;
    try {
      response = await fetch(healthCheckUrl, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'cors',
      });
    } catch (corsError) {
      // If CORS fails, try no-cors mode (but we won't get status code)
      if (isCorsError(corsError)) {
        console.warn(`CORS error for ${healthCheckUrl}, trying no-cors mode`);
        try {
          await fetch(healthCheckUrl, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors',
          });
          clearTimeout(timeoutId);
          // With no-cors, we can't read the response, but if it didn't throw, assume it's reachable
          return {
            status: 'running',
            statusCode: 200, // Assume success if no-cors works
          };
        } catch {
          clearTimeout(timeoutId);
          throw corsError; // Throw original CORS error
        }
      }
      throw corsError;
    }

    clearTimeout(timeoutId);

    let status: ServiceStatus;
    if (response.ok) {
      status = 'running';
    } else if (response.status >= 400 && response.status < 500) {
      status = 'error';
    } else if (response.status >= 500) {
      status = 'warning';
    } else {
      status = 'stopped';
    }

    return {
      status,
      statusCode: response.status,
    };
  } catch (error) {
    // Network error, CORS error, or timeout
    if (isCorsError(error)) {
      console.warn(`CORS blocked health check for ${healthCheckUrl}. Consider using a proxy or enabling CORS on the service.`);
    } else {
      console.warn(`Health check failed for ${healthCheckUrl}:`, error);
    }
    return {
      status: 'stopped',
      statusCode: 0,
    };
  }
}

export async function checkMultipleServices(
  services: Array<{ healthCheckUrl?: string }>
): Promise<HealthCheckResult[]> {
  const promises = services.map((service) => {
    if (service.healthCheckUrl) {
      return checkServiceHealth(service.healthCheckUrl);
    }
    return Promise.resolve({
      status: 'stopped' as ServiceStatus,
      statusCode: 0,
    });
  });

  return Promise.all(promises);
}


import type { ServiceConfig } from './configLoader';
import { replacePlaceholders } from './placeholderReplacer';

/**
 * Processes service configuration by replacing placeholders in all relevant fields.
 * This ensures consistent placeholder replacement across the application.
 */
export function processServiceConfig(serviceConfig: ServiceConfig): ServiceConfig {
  return {
    ...serviceConfig,
    name: replacePlaceholders(serviceConfig.name),
    description: replacePlaceholders(serviceConfig.description),
    url: serviceConfig.url ? replacePlaceholders(serviceConfig.url) : undefined,
    healthCheckUrl: serviceConfig.healthCheckUrl ? replacePlaceholders(serviceConfig.healthCheckUrl) : undefined,
  };
}

/**
 * Processes an array of service configurations.
 */
export function processServiceConfigs(serviceConfigs: ServiceConfig[]): ServiceConfig[] {
  return serviceConfigs.map(processServiceConfig);
}


import yaml from 'js-yaml';

export interface FooterItem {
  type: 'text' | 'link';
  content?: string;  // For text type
  label?: string;    // For link type
  url?: string;      // For link type
  target?: string;   // For link type - HTML target attribute (e.g., "_blank", "_self", "_parent", "_top")
}

export interface ServerConfig {
  name: string;
  subtitle?: string | FooterItem[];  // Can be a simple string or array of items (same structure as footer)
  headerContent?: string | FooterItem[];  // Additional customizable content at the bottom of header
  status?: string;
  uptime?: string;
  lastUpdated?: string;
}

export interface ThemeConfig {
  backgroundImage?: {
    url?: string;
    opacity?: number;
    position?: string;
    size?: string;
    repeat?: string;
  };
  colors: {
    background: string;
    cardBackground: string;
    mediumAccent: string;
    darkAccent: string;
    text: string;
    headerBackground: string;
    headerText: string;
    footerBackground?: string;
    footerText?: string;
    serviceStatus?: {
      [key: string]: string; // HTTP status codes/ranges to colors: "0": "#808080", "200-299": "#10b981", etc.
    };
  };
}

export interface StatusMappingConfig {
  [key: string]: string; // HTTP status codes/ranges to service status names: "0": "stopped", "200-299": "running", etc.
}

export interface ServiceConfig {
  name: string;
  description: string;
  icon: string;
  url?: string;
  healthCheckUrl?: string;
}

export interface FooterConfig {
  enabled?: boolean;
  content?: FooterItem[];  // Changed from 'items' to 'content'
}

export interface AppConfig {
  server: ServerConfig;
  footer?: FooterConfig;
  theme: ThemeConfig;
  statusMapping?: StatusMappingConfig;
  services?: ServiceConfig[];
}

let cachedConfig: AppConfig | null = null;

export async function loadConfig(): Promise<AppConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  // Try config files in order: config.yaml, config1.yaml, config2.yaml, config3.yaml
  const configFiles = ['/config.yaml', '/config1.yaml', '/config2.yaml', '/config3.yaml'];
  
  for (const configFile of configFiles) {
    try {
      const response = await fetch(configFile);
      if (response.ok) {
        const yamlText = await response.text();
        const config = yaml.load(yamlText) as AppConfig;
        cachedConfig = config;
        return config;
      }
    } catch (error) {
      // Continue to next config file if this one fails
      continue;
    }
  }

  // If all config files failed, throw an error
  const errorMessage = `No configuration file found. Tried: ${configFiles.join(', ')}`;
  console.error('Error loading config:', errorMessage);
  throw new Error(errorMessage);
}

export function getColor(colorKey: Exclude<keyof ThemeConfig['colors'], 'serviceStatus'>): string {
  if (!cachedConfig) {
    return '#000000';
  }
  const color = cachedConfig.theme.colors[colorKey];
  return typeof color === 'string' ? color : '#000000';
}


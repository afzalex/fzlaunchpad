import yaml from 'js-yaml';
import { DEFAULT_STATUS_MAPPING, DEFAULT_STATUS_COLORS } from './constants';

export interface FooterItem {
  type: 'text' | 'link';
  content?: string;  // For text type
  label?: string;    // For link type
  url?: string;      // For link type
}

export interface ServerConfig {
  name: string;
  subtitle?: string | FooterItem[];  // Can be a simple string or array of items (same structure as footer)
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

  try {
    const response = await fetch('/config.yaml');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    const yamlText = await response.text();
    const config = yaml.load(yamlText) as AppConfig;
    cachedConfig = config;
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    // Return default config if loading fails
    return {
      server: {
        name: 'Server',
        status: 'Online',
      },
      footer: {
        enabled: true,
        content: [
          {
            type: 'text',
            content: '© {year} Launchpad',
          },
        ],
        // Attribution is automatically appended in Footer component
      },
      theme: {
        colors: {
          background: '#fafaff',
          cardBackground: '#eef0f2',
          mediumAccent: '#ecebe4',
          darkAccent: '#daddd8',
          text: '#1c1c1c',
          headerBackground: '#1c1c1c',
          headerText: '#eef0f2',
          footerBackground: '#fafaff',
          footerText: '#1c1c1c',
          serviceStatus: { ...DEFAULT_STATUS_COLORS },
        },
      },
      statusMapping: { ...DEFAULT_STATUS_MAPPING },
    };
  }
}

export function getColor(colorKey: Exclude<keyof ThemeConfig['colors'], 'serviceStatus'>): string {
  if (!cachedConfig) {
    return '#000000';
  }
  const color = cachedConfig.theme.colors[colorKey];
  return typeof color === 'string' ? color : '#000000';
}


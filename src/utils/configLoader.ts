import yaml from 'js-yaml';

export interface ServerConfig {
  name: string;
  subtitle?: string;
  status?: string;
  uptime?: string;
  lastUpdated?: string;
}

export interface ThemeConfig {
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
      [key: string]: string; // e.g., "0", "200-299", "400-499", "500-599"
    };
  };
}

export interface ServiceConfig {
  name: string;
  description: string;
  icon: string;
  url?: string;
  healthCheckUrl?: string;
}

export interface FooterItem {
  type: 'text' | 'link';
  content?: string;  // For text type
  label?: string;    // For link type
  url?: string;      // For link type
}

export interface FooterConfig {
  enabled?: boolean;
  items?: FooterItem[];
}

export interface AppConfig {
  server: ServerConfig;
  footer?: FooterConfig;
  theme: ThemeConfig;
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
        items: [
          {
            type: 'text',
            content: '© {year} Launchpad',
          },
        ],
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
          serviceStatus: {
            '0': '#808080',
            '200-299': '#10b981',
            '300-399': '#3b82f6',
            '400-499': '#ef4444',
            '500-599': '#f59e0b',
          },
        },
      },
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


import type { IconType } from 'react-icons';
import {
  FaServer,
  FaDatabase,
  FaCode,
  FaDocker,
  FaCloud,
  FaNetworkWired,
  FaHome,
  FaCog,
  FaChartLine,
  FaShieldAlt,
  FaFileAlt,
  FaEnvelope,
  FaBell,
  FaUser,
  FaUsers,
  FaGlobe,
  FaLock,
  FaUnlock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from 'react-icons/fa';

const iconMap: Record<string, IconType> = {
  FaServer,
  FaDatabase,
  FaCode,
  FaDocker,
  FaCloud,
  FaNetworkWired,
  FaHome,
  FaCog,
  FaChartLine,
  FaShieldAlt,
  FaFileAlt,
  FaEnvelope,
  FaBell,
  FaUser,
  FaUsers,
  FaGlobe,
  FaLock,
  FaUnlock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
};

export function getIcon(iconName: string): IconType | undefined {
  return iconMap[iconName];
}


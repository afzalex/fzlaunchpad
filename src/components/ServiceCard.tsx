import type { IconType } from 'react-icons';
import './ServiceCard.css';
import { useConfig } from '../hooks/useConfig';
import { getStatusColorForCode } from '../utils/statusColor';

export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'error' | 'warning';
  statusCode?: number;
  icon?: IconType;
  url?: string;
}

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  const { config } = useConfig();
  
  const handleClick = () => {
    if (service.url) {
      window.location.href = service.url;
    }
  };

  const statusColor = getStatusColorForCode(
    service.statusCode ?? 0,
    config?.theme.colors.serviceStatus
  );
  
  return (
    <div 
      className={`service-card status-${service.status} ${service.url ? 'clickable' : ''}`}
      onClick={handleClick}
      role={service.url ? 'button' : undefined}
      tabIndex={service.url ? 0 : undefined}
      onKeyDown={(e) => {
        if (service.url && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div 
        className={`service-status-indicator status-${service.status}`}
        style={{ '--status-color': statusColor } as React.CSSProperties}
      >
        <span className={`status-dot status-${service.status}`}></span>
      </div>
      <div className="service-card-header">
        <div className="service-title-row">
          {Icon && (
            <div className="service-icon-wrapper">
              <Icon className="service-icon" />
            </div>
          )}
          <h3 className="service-name">{service.name}</h3>
        </div>
      </div>
      <div className="service-card-content">
        <p className="service-description">{service.description}</p>
        <div className="service-footer">
          <span className="status-label">{service.status}</span>
        </div>
      </div>
    </div>
  );
}


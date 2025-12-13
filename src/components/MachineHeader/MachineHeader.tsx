import './MachineHeader.css';
import type { FooterItem } from '../../utils/configLoader';

interface MachineHeaderProps {
  machineName: string;
  subtitle?: string | FooterItem[];
  headerContent?: string | FooterItem[];
}

export default function MachineHeader({ 
  machineName,
  subtitle,
  headerContent,
}: MachineHeaderProps) {
  const currentYear = new Date().getFullYear();

  const renderSubtitle = () => {
    if (!subtitle) return null;

    // If it's a string, render it directly (backward compatible)
    if (typeof subtitle === 'string') {
      return <div className="machine-subtitle"><div className="machine-subtitle-wrapper">{subtitle}</div></div>;
    }

    // If it's an array of items, render them like footer
    return (
      <div className="machine-subtitle">
        <div className="machine-subtitle-wrapper">
          {subtitle.map((item, index) => {
            if (item.type === 'text') {
              const displayText = (item.content || '').replace('{year}', currentYear.toString());
              return (
                <span key={index} className="subtitle-item subtitle-text">
                  {displayText}
                </span>
              );
            } else if (item.type === 'link' && item.url) {
              return (
                <a
                  key={index}
                  href={item.url}
                  className="subtitle-item subtitle-link"
                >
                  {item.label || item.url}
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const renderHeaderContent = () => {
    if (!headerContent) return null;

    // If it's a string, render it directly
    if (typeof headerContent === 'string') {
      return <div className="machine-header-content-bottom"><div className="machine-header-content-wrapper">{headerContent}</div></div>;
    }

    // If it's an array of items, render them like footer
    return (
      <div className="machine-header-content-bottom">
        <div className="machine-header-content-wrapper">
          {headerContent.map((item, index) => {
            if (item.type === 'text') {
              const displayText = (item.content || '').replace('{year}', currentYear.toString());
              return (
                <span key={index} className="header-content-item header-content-text">
                  {displayText}
                </span>
              );
            } else if (item.type === 'link' && item.url) {
              return (
                <a
                  key={index}
                  href={item.url}
                  className="header-content-item header-content-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label || item.url}
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <header className="machine-header">
      <div className="machine-header-content">
        <h1 className="machine-name">{machineName}</h1>
        {renderSubtitle()}
        {renderHeaderContent()}
      </div>
    </header>
  );
}


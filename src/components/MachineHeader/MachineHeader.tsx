import './MachineHeader.css';
import type { FooterItem } from '../../utils/configLoader';
import { replacePlaceholders } from '../../utils/placeholderReplacer';

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

  const renderSubtitle = () => {
    if (!subtitle) return null;

    // If it's a string, render it directly (backward compatible)
    if (typeof subtitle === 'string') {
      const displayText = replacePlaceholders(subtitle);
      return <div className="machine-subtitle"><div className="machine-subtitle-wrapper">{displayText}</div></div>;
    }

    // If it's an array of items, render them like footer
    return (
      <div className="machine-subtitle">
        <div className="machine-subtitle-wrapper">
          {subtitle.map((item, index) => {
            if (item.type === 'text') {
              const displayText = replacePlaceholders(item.content || '');
              return (
                <span key={index} className="subtitle-item subtitle-text">
                  {displayText}
                </span>
              );
            } else if (item.type === 'link' && item.url) {
              const linkUrl = replacePlaceholders(item.url);
              const linkLabel = item.label ? replacePlaceholders(item.label) : linkUrl;
              const target = item.target || '_blank'; // Default to _blank for backward compatibility
              return (
                <a
                  key={index}
                  href={linkUrl}
                  className="subtitle-item subtitle-link"
                  target={target}
                  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                >
                  {linkLabel}
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
      const displayText = replacePlaceholders(headerContent);
      return <div className="machine-header-content-bottom"><div className="machine-header-content-wrapper">{displayText}</div></div>;
    }

    // If it's an array of items, render them like footer
    return (
      <div className="machine-header-content-bottom">
        <div className="machine-header-content-wrapper">
          {headerContent.map((item, index) => {
            if (item.type === 'text') {
              const displayText = replacePlaceholders(item.content || '');
              return (
                <span key={index} className="header-content-item header-content-text">
                  {displayText}
                </span>
              );
            } else if (item.type === 'link' && item.url) {
              const linkUrl = replacePlaceholders(item.url);
              const linkLabel = item.label ? replacePlaceholders(item.label) : linkUrl;
              const target = item.target || '_blank'; // Default to _blank for backward compatibility
              return (
                <a
                  key={index}
                  href={linkUrl}
                  className="header-content-item header-content-link"
                  target={target}
                  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                >
                  {linkLabel}
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  const displayMachineName = replacePlaceholders(machineName);

  return (
    <header className="machine-header">
      <div className="machine-header-content">
        <h1 className="machine-name">{displayMachineName}</h1>
        {renderSubtitle()}
        {renderHeaderContent()}
      </div>
    </header>
  );
}


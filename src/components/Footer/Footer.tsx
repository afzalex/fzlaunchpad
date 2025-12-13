import './Footer.css';
import { useConfig } from '../../hooks/useConfig';
import type { FooterItem } from '../../utils/configLoader';

export default function Footer() {
  const { config } = useConfig();
  const currentYear = new Date().getFullYear();
  
  if (config?.footer?.enabled === false) {
    return null;
  }

  const content = config?.footer?.content || [
    { type: 'text' as const, content: '© {year} Launchpad' }
  ];

  // Attribution is always appended - this ensures proper credit to the original author
  // Removing this attribution violates the spirit of open source contribution
  const attribution: FooterItem[] = [
    { type: 'text', content: '© {year}' },
    { type: 'link', label: 'fzlaunchpad', url: 'https://github.com/afzalex/fzlaunchpad' },
    { type: 'text', content: '|' },
    ...content,
    { type: 'text', content: '| Built by' },
    { type: 'link', label: 'Mohammad Afzal', url: 'https://afzalex.com' }
  ];
  
  const allContent = attribution;
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        {allContent.map((item, index) => {
          if (item.type === 'text') {
            const displayText = (item.content || '').replace('{year}', currentYear.toString());
            return (
              <span key={index} className="footer-item footer-text">
                {displayText}
              </span>
            );
          } else if (item.type === 'link' && item.url) {
            return (
              <a
                key={index}
                href={item.url}
                className="footer-item footer-link"
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
    </footer>
  );
}


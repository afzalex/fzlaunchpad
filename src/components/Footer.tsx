import './Footer.css';
import { useConfig } from '../hooks/useConfig';

export default function Footer() {
  const { config } = useConfig();
  const currentYear = new Date().getFullYear();
  
  if (config?.footer?.enabled === false) {
    return null;
  }

  const items = config?.footer?.items || [
    { type: 'text' as const, content: '© {year} Launchpad' }
  ];
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        {items.map((item, index) => {
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


import './Footer.css';
import { useConfig } from '../../hooks/useConfig';
import type { FooterItem } from '../../utils/configLoader';
import { replacePlaceholders } from '../../utils/placeholderReplacer';

export default function Footer() {
  const { config } = useConfig();
  
  if (config?.footer?.enabled === false) {
    return null;
  }

  const content = config?.footer?.content;
  const contentWithSeparator = content?.length ? [{ type: 'text' as const, content: '|' }, ...content] : [];
  
  // Attribution is always appended - this ensures proper credit to the original author
  // Removing this attribution violates the spirit of open source contribution
  const attribution: FooterItem[] = [
    { type: 'text', content: '© {year}' },
    { type: 'link', label: 'fzlaunchpad', url: 'https://github.com/afzalex/fzlaunchpad' },
    ...contentWithSeparator,
    { type: 'text', content: '| Built by' },
    { type: 'link', label: 'Mohammad Afzal', url: 'https://afzalex.com' }
  ];
  
  const allContent = attribution;
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        {allContent.map((item, index) => {
          if (item.type === 'text') {
            const displayText = replacePlaceholders(item.content || '');
            return (
              <span key={index} className="footer-item footer-text">
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
                className="footer-item footer-link"
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
    </footer>
  );
}


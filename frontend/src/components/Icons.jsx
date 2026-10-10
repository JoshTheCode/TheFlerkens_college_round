import React from 'react';

export function Icon({ name, className = '', size = '' }) {
  const sizeClass = size === 'sm' ? 'ic--sm' : size === 'lg' ? 'ic--lg' : '';
  const combined = `ic ${sizeClass} ${className}`.trim();

  switch (name) {
    case 'grid':
    case 'i-grid':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
        </svg>
      );
    case 'target':
    case 'i-target':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22" />
        </svg>
      );
    case 'activity':
    case 'i-activity':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12h3.8l2.6 7 4.2-14 2.6 7H21" />
        </svg>
      );
    case 'branch':
    case 'i-branch':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="6.5" cy="6" r="2.6" />
          <circle cx="6.5" cy="18" r="2.6" />
          <circle cx="17.5" cy="8.5" r="2.6" />
          <path d="M6.5 8.6v6.8M17.5 11.1c0 3.1-2.6 3.5-4.6 4.1" />
        </svg>
      );
    case 'key':
    case 'i-key':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="8" cy="15.5" r="3.6" />
          <path d="M10.6 13l7.4-7.4 2.4 2.4-1.9 1.9 1.4 1.4-2 2-1.4-1.4-2.1 2.1" />
        </svg>
      );
    case 'shield':
    case 'i-shield':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3l7.2 3v5.8c0 4.4-3 7.8-7.2 9.2-4.2-1.4-7.2-4.8-7.2-9.2V6z" />
          <path d="M9 12l2.2 2.2L15.4 10" />
        </svg>
      );
    case 'shieldoff':
    case 'i-shieldoff':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3l7.2 3v5.8c0 4.4-3 7.8-7.2 9.2-4.2-1.4-7.2-4.8-7.2-9.2V6z" />
          <path d="M4 4l16 16" />
        </svg>
      );
    case 'settings':
    case 'i-settings':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2.6l1.4 2.5 2.8-.6.5 2.8 2.5 1.4-1.5 2.4 1.5 2.4-2.5 1.4-.5 2.8-2.8-.6L12 21.4l-1.4-2.5-2.8.6-.5-2.8L4.8 15.3l1.5-2.4-1.5-2.4 2.5-1.4.5-2.8 2.8.6z" />
        </svg>
      );
    case 'search':
    case 'i-search':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20.5 20.5L16.6 16.6" />
        </svg>
      );
    case 'bell':
    case 'i-bell':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9.5a6 6 0 1 1 12 0c0 4.6 1.8 5.8 1.8 5.8H4.2S6 14.1 6 9.5z" />
          <path d="M9.8 19a2.2 2.2 0 0 0 4.4 0" />
        </svg>
      );
    case 'plus':
    case 'i-plus':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'zap':
    case 'i-zap':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 3L5.5 13.5H11l-1 7.5 8.5-11H13z" />
        </svg>
      );
    case 'play':
    case 'i-play':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 4.8l12 7.2-12 7.2z" />
        </svg>
      );
    case 'refresh':
    case 'i-refresh':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 11.2A8 8 0 1 0 19 16" />
          <path d="M20 4.5V11h-6.4" />
        </svg>
      );
    case 'download':
    case 'i-download':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" />
          <path d="M5 20h14" />
        </svg>
      );
    case 'dots':
    case 'i-dots':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      );
    case 'check':
    case 'i-check':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
      );
    case 'x':
    case 'i-x':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case 'alert':
    case 'i-alert':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4.2l8.6 15.3H3.4z" />
          <path d="M12 10v4.2" />
          <path d="M12 17.7h.01" />
        </svg>
      );
    case 'database':
    case 'i-database':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <ellipse cx="12" cy="6.2" rx="7" ry="3" />
          <path d="M5 6.2v11.6c0 1.7 3.1 3 7 3s7-1.3 7-3V6.2" />
          <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
        </svg>
      );
    case 'bug':
    case 'i-bug':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="8" y="6.5" width="8" height="11.5" rx="4" />
          <path d="M12 6.5V4M9 5.2L7.6 3.8M15 5.2l1.4-1.4M8 12H4.5M19.5 12H16M8.4 16.6L6 19M15.6 16.6L18 19" />
        </svg>
      );
    case 'eye':
    case 'i-eye':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
          <circle cx="12" cy="12" r="2.6" />
        </svg>
      );
    case 'up':
    case 'i-up':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V6M6.5 11.5L12 6l5.5 5.5" />
        </svg>
      );
    case 'down':
    case 'i-down':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v13M6.5 12.5L12 18l5.5-5.5" />
        </svg>
      );
    case 'panel':
    case 'i-panel':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2.2" />
          <path d="M9.5 4v16" />
        </svg>
      );
    case 'menu':
    case 'i-menu':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case 'copy':
    case 'i-copy':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="9" y="9" width="11" height="11" rx="2.2" />
          <path d="M5 15V5.2A2.2 2.2 0 0 1 7.2 3H15" />
        </svg>
      );
    case 'lock':
    case 'i-lock':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </svg>
      );
    case 'file':
    case 'i-file':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      );
    case 'plug':
    case 'i-plug':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 3v6M15 3v6" />
          <path d="M6.5 9h11v3.5a5.5 5.5 0 0 1-11 0z" />
          <path d="M12 18v3" />
        </svg>
      );
    case 'chevdown':
    case 'i-chevdown':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      );
    case 'chevright':
    case 'i-chevright':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.5 6l6 6-6 6" />
        </svg>
      );
    case 'chevleft':
    case 'i-chevleft':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.5 6l-6 6 6 6" />
        </svg>
      );
    case 'external':
    case 'i-external':
      return (
        <svg className={combined} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 4h6v6" />
          <path d="M20 4l-9 9" />
          <path d="M18 14.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5" />
        </svg>
      );
    default:
      return null;
  }
}

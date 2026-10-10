import React from 'react';
import { Icon } from './Icons';

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toasts" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.tone || ''}`} role="status">
          <span style={{ flex: 'none' }}>
            <Icon name={t.tone === 'crit' ? 'alert' : t.tone === 'warn' ? 'bell' : 'check'} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{t.title}</b> — {t.message}
          </div>
          <button
            className="iconbtn"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss"
            style={{ width: '20px', height: '20px', color: '#fff' }}
          >
            <Icon name="x" size="sm" />
          </button>
        </div>
      ))}
    </div>
  );
}

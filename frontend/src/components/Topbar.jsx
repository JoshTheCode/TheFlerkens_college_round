import React, { useState } from 'react';
import { Icon } from './Icons';
import { ROUTES } from './Sidebar';

export function Topbar({
  activeRoute,
  onNavigate,
  isOffline,
  onToggleOffline,
  onToggleNav,
  onToggleCollapse,
  onOpenCommand,
  onPrimaryAction,
  onToast
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNotifsMenu, setShowNotifsMenu] = useState(false);

  const getPrimaryConfig = (route) => {
    switch (route) {
      case 'overview':
      case 'campaigns':
        return { label: 'Launch Red-Team Campaign', icon: 'zap', action: 'launch-campaign' };
      case 'targets':
        return { label: 'Register target agent', icon: 'plus', action: 'register-target' };
      case 'traces':
        return { label: 'Replay latest trace', icon: 'play', action: 'replay-latest' };
      case 'permissions':
        return { label: 'Export audit report', icon: 'download', action: 'export-audit' };
      case 'defense':
        return { label: 'Validate defense', icon: 'shield', action: 'validate-defense' };
      default:
        return null;
    }
  };

  const primary = getPrimaryConfig(activeRoute);

  return (
    <header className="topbar">
      <button
        className="iconbtn mobile-only"
        onClick={onToggleNav}
        aria-label="Open navigation menu"
      >
        <Icon name="menu" />
      </button>
      <button
        className="iconbtn collapse-only"
        onClick={onToggleCollapse}
        aria-label="Collapse sidebar"
      >
        <Icon name="panel" />
      </button>

      <nav className="crumbs" aria-label="Breadcrumb">
        <span className="crumbs__root">Sandbox</span>
        <span className="crumbs__sep" aria-hidden="true">/</span>
        <span className="crumbs__here">{ROUTES[activeRoute]?.crumb || 'Overview'}</span>
      </nav>

      <div className="topbar__spacer"></div>

      <button
        className="searchbtn"
        onClick={onOpenCommand}
        aria-label="Search and commands"
      >
        <Icon name="search" size="sm" />
        <span className="searchbtn__txt">Search or run a command</span>
        <span className="kbd">⌘K</span>
      </button>

      <div style={{ position: 'relative' }}>
        <button
          className="status-pill"
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          aria-haspopup="menu"
          aria-expanded={showStatusMenu}
          aria-label="Sandbox connection status"
        >
          <span className="pulse ok" aria-hidden="true"></span>
          <span>Deterministic Sandbox (CI/Offline Safe)</span>
        </button>

        {showStatusMenu && (
          <div className="menu-dropdown">
            <div className="menu__lbl">Sandbox Runtime</div>
            <button
              className="menu__item"
              onClick={() => {
                setShowStatusMenu(false);
                onToggleOffline();
              }}
            >
              <Icon name="refresh" size="sm" />
              <span>{isOffline ? 'Reconnect sandbox' : 'Simulate disconnect'}</span>
            </button>
            <div className="menu__sep"></div>
            <button
              className="menu__item"
              onClick={() => {
                setShowStatusMenu(false);
                onNavigate('settings');
              }}
            >
              <Icon name="settings" size="sm" />
              <span>Sandbox settings</span>
            </button>
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <button
          className="iconbtn"
          onClick={() => setShowNotifsMenu(!showNotifsMenu)}
          aria-label="Notifications"
        >
          <Icon name="bell" />
          <span className="dot-badge" aria-hidden="true"></span>
        </button>

        {showNotifsMenu && (
          <div className="menu-dropdown">
            <div className="menu__lbl">Live Activity</div>
            <div className="menu__item">
              <Icon name="activity" size="sm" />
              <span>Campaign #104 running</span>
            </div>
            <div className="menu__item danger">
              <Icon name="alert" size="sm" />
              <span>New critical trace found</span>
            </div>
            <div className="menu__item">
              <Icon name="shield" size="sm" />
              <span>Defense validation passed</span>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons are rendered inside each view page header to prevent duplicate buttons */}
    </header>
  );
}

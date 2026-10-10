import React, { useState } from 'react';
import { Icon } from './Icons';

export const ROUTES = {
  overview: { label: 'Overview', group: 'Monitor', icon: 'grid', crumb: 'Security posture' },
  campaigns: { label: 'Attack Campaigns', group: 'Monitor', icon: 'activity', crumb: 'Campaigns' },
  targets: { label: 'Target Agents & Scope', group: 'Configure', icon: 'target', crumb: 'Targets' },
  traces: { label: 'Attack Traces', group: 'Investigate', icon: 'branch', crumb: 'Attack traces' },
  permissions: { label: 'Tool & Permission Audit', group: 'Investigate', icon: 'key', crumb: 'Permissions' },
  defense: { label: 'Defense & Regression', group: 'Validate', icon: 'shield', crumb: 'Defense validation' },
  settings: { label: 'Settings & Documentation', group: 'System', icon: 'settings', crumb: 'Settings' }
};

export const NAV_GROUPS = ['Monitor', 'Configure', 'Investigate', 'Validate', 'System'];

export function Sidebar({
  activeRoute,
  onNavigate,
  selectedTarget,
  onSelectTarget,
  targetAgents,
  attackTracesCount,
  onOpenRegisterModal,
  onToast
}) {
  const [showTargetMenu, setShowTargetMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <Icon name="shieldoff" size="lg" />
        </span>
        <span className="brand__txt">
          <span className="brand__name">AgentBreak</span>
          <span className="brand__tag">Red-Team Console</span>
        </span>
      </div>

      <div className="selector-wrap">
        <button
          className="selector"
          onClick={() => setShowTargetMenu(!showTargetMenu)}
          aria-haspopup="menu"
          aria-expanded={showTargetMenu}
          aria-label="Choose target agent"
        >
          <span className="selector__dot" aria-hidden="true"></span>
          <span className="selector__txt">
            <span className="selector__name">{selectedTarget.name}</span>
            <span className="selector__sub">Sandboxed · {selectedTarget.tools_count} tools</span>
          </span>
          <Icon name="chevdown" size="sm" className="ic--chev" />
        </button>

        {showTargetMenu && (
          <div className="menu-dropdown" style={{ left: 12, right: 12, top: 'calc(100% - 4px)' }}>
            <div className="menu__lbl">Target agents</div>
            {targetAgents.map((agent) => (
              <button
                key={agent.target_agent_id}
                className="menu__item"
                onClick={() => {
                  onSelectTarget(agent);
                  setShowTargetMenu(false);
                  onToast('Target switched', `${agent.name} is now the active target.`, 'ok');
                }}
              >
                <Icon name="target" size="sm" />
                <span>{agent.name}</span>
              </button>
            ))}
            <div className="menu__sep"></div>
            <button
              className="menu__item"
              onClick={() => {
                setShowTargetMenu(false);
                onOpenRegisterModal();
              }}
            >
              <Icon name="plus" size="sm" />
              <span>Register new target</span>
            </button>
          </div>
        )}
      </div>

      <nav className="nav">
        {NAV_GROUPS.map((group) => {
          const items = Object.entries(ROUTES).filter(([_, conf]) => conf.group === group);
          if (!items.length) return null;
          return (
            <div key={group} className="nav__group">
              <div className="nav__label">{group}</div>
              {items.map(([rKey, conf]) => {
                const isActive = activeRoute === rKey;
                const count = rKey === 'traces' ? attackTracesCount : rKey === 'permissions' ? 3 : 0;
                return (
                  <button
                    key={rKey}
                    className={`nav__item ${isActive ? 'is-active' : ''}`}
                    onClick={() => onNavigate(rKey)}
                    aria-current={isActive ? 'page' : undefined}
                    title={conf.label}
                  >
                    <Icon name={conf.icon} />
                    <span className="nav__txt">{conf.label}</span>
                    {count > 0 && <span className="nav__count">{count}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="side-foot">
        <button
          className="profile"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          aria-label="Account menu"
        >
          <span className="avatar" aria-hidden="true">BP</span>
          <span className="profile__txt">
            <span className="profile__name">Belvia Pereira</span>
            <span className="profile__mail">Security lead</span>
          </span>
        </button>

        {showProfileMenu && (
          <div className="menu-dropdown" style={{ left: 10, right: 10, bottom: 'calc(100% + 4px)', top: 'auto' }}>
            <div className="menu__lbl">Belvia Pereira</div>
            <button
              className="menu__item"
              onClick={() => {
                setShowProfileMenu(false);
                onNavigate('settings');
              }}
            >
              <Icon name="settings" size="sm" />
              <span>Workspace Settings</span>
            </button>
            <div className="menu__sep"></div>
            <button
              className="menu__item danger"
              onClick={() => {
                setShowProfileMenu(false);
                onToast('Session', 'Signed out from session (Demo mode)', 'warn');
              }}
            >
              <Icon name="external" size="sm" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

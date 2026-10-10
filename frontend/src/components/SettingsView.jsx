import React, { useState } from 'react';
import { Icon } from './Icons';

export function SettingsView({
  workspace,
  targetAgents,
  apiReference,
  isOffline,
  onToggleOffline,
  onToast
}) {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'sandbox', label: 'Sandbox' },
    { id: 'team', label: 'Team' },
    { id: 'docs', label: 'API & Documentation' }
  ];

  const teamMembers = [
    { name: 'Belvia Pereira', role: 'Security lead', initials: 'BP' },
    { name: 'Yuvraj Sharma', role: 'AI/ML specialist', initials: 'YS' },
    { name: 'Josh TheCode', role: 'Frontend lead', initials: 'JT' }
  ];

  const payloadFields = [
    ['target_agent_id', 'string', 'Registered agent under test'],
    ['user_query', 'string', 'Input issued to the agent'],
    ['agent_output', 'string', 'Agent response captured'],
    ['exploit_payload', 'string', 'Reproducible adversarial input'],
    ['severity_score', 'number', '0–10 exploit severity'],
    ['tool_name / permission_scope', 'string', 'Tool call and its declared scope']
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings & Documentation</h1>
          <p className="page-sub">
            Workspace configuration, sandbox connectivity status and API contract specs.
          </p>
        </div>
      </div>

      <section className="card">
        <div className="card__head" style={{ paddingBottom: 0, borderBottom: 0 }}>
          <div className="card__title">Configuration</div>
        </div>
        <div className="card__body" style={{ paddingTop: '12px' }}>
          <div className="tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`tab ${activeTab === t.id ? 'is-active' : ''}`}
                role="tab"
                aria-selected={activeTab === t.id}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{ marginTop: 'var(--gap)' }}>
        {activeTab === 'general' && (
          <section className="card">
            <div className="card__head">
              <div className="card__title">Workspace Settings</div>
            </div>
            <div className="card__body">
              <form
                className="stack-gap"
                style={{ gap: '16px' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  onToast('Settings saved', 'Workspace preferences updated.', 'ok');
                }}
              >
                <div className="field">
                  <label className="label" htmlFor="wsName">Workspace name</label>
                  <input className="input" id="wsName" defaultValue={workspace.name} />
                  <span className="hint">Shown in the sidebar and breadcrumb.</span>
                </div>

                <div className="field">
                  <label className="label" htmlFor="defTarget">Default target agent</label>
                  <select className="select" id="defTarget" defaultValue={workspace.target}>
                    {targetAgents.map((a) => (
                      <option key={a.target_agent_id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="label" htmlFor="sevThresh">Surface findings at or above</label>
                  <select className="select" id="sevThresh" defaultValue="Medium">
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label" htmlFor="wsNote">Workspace description</label>
                  <textarea
                    className="textarea"
                    id="wsNote"
                    defaultValue="Red-team sandbox for drafting agents."
                  />
                </div>

                <div className="od-row" style={{ gap: '10px' }}>
                  <button className="btn btn--primary" type="submit">
                    <Icon name="check" size="sm" />
                    Save changes
                  </button>
                  <button className="btn btn--tertiary" type="reset">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'sandbox' && (
          <section className="card">
            <div className="card__head">
              <div>
                <div className="card__title">Sandbox Connectivity</div>
                <div className="card__sub">Health and reachability of the isolated execution environment</div>
              </div>
            </div>
            <div className="card__body">
              {/* Perfectly Aligned Key-Value Table for Sandbox Status */}
              <div className="kv" style={{ marginBottom: '16px' }}>
                <div className="kv__row" style={{ alignItems: 'center' }}>
                  <span className="kv__k">Status</span>
                  <span className="kv__v" style={{ display: 'flex', alignItems: 'center', height: '28px' }}>
                    <span className={`badge badge--${isOffline ? 'crit' : 'ok'}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <span className="pulse" style={{ width: '6px', height: '6px', marginRight: '4px', background: isOffline ? 'var(--sev-crit)' : 'var(--ok)' }}></span>
                      {isOffline ? 'Offline' : 'Connected'}
                    </span>
                  </span>
                </div>
                <div className="kv__row" style={{ alignItems: 'center' }}>
                  <span className="kv__k">Endpoint</span>
                  <span className="kv__v mono">sandbox://local/isolated-01</span>
                </div>
                <div className="kv__row" style={{ alignItems: 'center' }}>
                  <span className="kv__k">Cached run</span>
                  <span className="kv__v mono">run_0912</span>
                </div>
                <div className="kv__row" style={{ alignItems: 'center' }}>
                  <span className="kv__k">Egress policy</span>
                  <span className="kv__v">Allow-list · external sends require approval</span>
                </div>
              </div>

              {isOffline && (
                <div className="banner" style={{ marginBottom: '16px' }}>
                  <Icon name="plug" />
                  <span style={{ flex: 1 }}>
                    Sandbox unreachable — displaying cached evaluation run <b>run_0912</b>.
                  </span>
                  <button className="btn btn--secondary btn--sm" onClick={onToggleOffline}>
                    Retry Connection
                  </button>
                </div>
              )}

              <button className="btn btn--secondary" onClick={onToggleOffline}>
                <Icon name="refresh" size="sm" />
                {isOffline ? 'Reconnect sandbox' : 'Test disconnect'}
              </button>
            </div>
          </section>
        )}

        {activeTab === 'team' && (
          <section className="card">
            <div className="card__head">
              <div>
                <div className="card__title">Team Members</div>
                <div className="card__sub">People with access to this workspace</div>
              </div>
            </div>
            <div className="card__body">
              <div className="list-cards">
                {teamMembers.map((m) => (
                  <div
                    key={m.name}
                    className="row-between"
                    style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}
                  >
                    <div className="od-row" style={{ gap: '11px' }}>
                      <span className="avatar">{m.initials}</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{m.name}</div>
                        <div className="small muted">{m.role}</div>
                      </div>
                    </div>
                    <button
                      className="btn btn--tertiary btn--sm"
                      onClick={() => onToast('Member permissions', `Configuring ${m.name}`, 'ok')}
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn btn--secondary"
                style={{ marginTop: '14px' }}
                onClick={() => onToast('Invite Team', 'Invitation modal opened', 'ok')}
              >
                <Icon name="plus" size="sm" />
                Invite teammate
              </button>
            </div>
          </section>
        )}

        {activeTab === 'docs' && (
          <section className="card">
            <div className="card__head">
              <div>
                <div className="card__title">API Specification</div>
                <div className="card__sub">Core endpoints the dashboard is designed to call</div>
              </div>
            </div>
            <div className="card__body">
              <div className="table-wrap" style={{ marginBottom: '16px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Path</th>
                      <th>Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiReference.map((e, idx) => (
                      <tr key={idx}>
                        <td data-label="Method">
                          <span className="badge badge--neutral mono">{e.method}</span>
                        </td>
                        <td data-label="Path" className="mono">{e.path}</td>
                        <td data-label="Summary" className="small">{e.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="section-title">Trace payload fields</h3>
              <div className="table-wrap" style={{ marginTop: '8px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Type</th>
                      <th>Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payloadFields.map((f, i) => (
                      <tr key={i}>
                        <td data-label="Field" className="mono">{f[0]}</td>
                        <td data-label="Type" className="small muted">{f[1]}</td>
                        <td data-label="Meaning" className="small">{f[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

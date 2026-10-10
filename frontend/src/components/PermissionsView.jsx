import React, { useState } from 'react';
import { Icon } from './Icons';

export function PermissionsView({ tools, onToast }) {
  const [escalationOnly, setEscalationOnly] = useState(false);
  const scopes = ['read', 'write', 'execute', 'external'];

  let escCount = 0;
  tools.forEach((t) => {
    scopes.forEach((s) => {
      if (t.scopes[s] === 'escalation') escCount++;
    });
  });

  const filteredTools = tools.filter((t) => {
    if (!escalationOnly) return true;
    return scopes.some((s) => t.scopes[s] === 'escalation');
  });

  const getRiskBadge = (r) => {
    return r === 'critical' ? (
      <span className="badge badge--crit">Critical</span>
    ) : r === 'high' ? (
      <span className="badge badge--high">High</span>
    ) : (
      <span className="badge badge--med">Medium</span>
    );
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Tool & Permission Audit Matrix</h1>
          <p className="page-sub">
            Every tool available to the target agent, evaluated against declared scope boundaries. Cells flagged Escalation exceed intended permissions.
          </p>
        </div>
      </div>

      <div className="metrics" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        <article className="card metric" style={{ padding: '14px' }}>
          <div className="metric__top">
            <span className="metric__ic crit"><Icon name="alert" /></span>
          </div>
          <div className="metric__value">{escCount}</div>
          <div className="metric__label">Permission escalations</div>
        </article>

        <article className="card metric" style={{ padding: '14px' }}>
          <div className="metric__top">
            <span className="metric__ic primary"><Icon name="database" /></span>
          </div>
          <div className="metric__value">{tools.length}</div>
          <div className="metric__label">Connected tools</div>
        </article>

        <article className="card metric" style={{ padding: '14px' }}>
          <div className="metric__top">
            <span className="metric__ic ok"><Icon name="lock" /></span>
          </div>
          <div className="metric__value">{tools.length * scopes.length - escCount}</div>
          <div className="metric__label">In-policy scopes</div>
        </article>
      </div>

      <div style={{ marginTop: 'var(--gap)' }}>
        <section className="card">
          <div className="card__head">
            <div>
              <div className="card__title">Permission Scope Matrix</div>
              <div className="card__sub">Grid of connected tools by scope — escalations highlighted</div>
            </div>
            <div className="card__actions">
              <label className="od-row small" style={{ gap: '7px', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={escalationOnly}
                  onChange={(e) => setEscalationOnly(e.target.checked)}
                />
                Show escalations only
              </label>
            </div>
          </div>

          <div className="card__body card__body--flush">
            <div className="od-cluster" style={{ gap: '16px', padding: '14px 16px', background: 'var(--surface-2)', borderBottom: '1px solid var(--line)' }}>
              <span className="cell-state allowed"><Icon name="check" size="sm" />Allowed</span>
              <span className="cell-state denied"><Icon name="x" size="sm" />Denied</span>
              <span className="cell-state escalation"><Icon name="alert" size="sm" />Escalation</span>
            </div>

            {/* Grid-bordered matrix table */}
            <div className="table-wrap">
              <table className="matrix">
                <thead>
                  <tr>
                    <th>Connected Tool</th>
                    {scopes.map((s) => (
                      <th key={s} scope="col">{s.charAt(0).toUpperCase() + s.slice(1)} Scope</th>
                    ))}
                    <th scope="col">Declared Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.map((t) => (
                    <tr key={t.tool_id}>
                      <td>
                        <div className="tool-name">
                          <Icon name="database" />
                          <div>
                            <div>{t.tool_name}</div>
                            <div className="cell-sub mono">{t.tool_id}</div>
                          </div>
                        </div>
                      </td>
                      {scopes.map((s) => {
                        const val = t.scopes[s];
                        const label = val === 'allowed' ? 'Allowed' : val === 'denied' ? 'Denied' : 'Escalation';
                        const icn = val === 'allowed' ? 'check' : val === 'denied' ? 'x' : 'alert';
                        return (
                          <td key={s} data-label={s.charAt(0).toUpperCase() + s.slice(1)}>
                            <span className={`cell-state ${val}`} title={label}>
                              <Icon name={icn} size="sm" />
                              {label}
                            </span>
                          </td>
                        );
                      })}
                      <td data-label="Risk">
                        {getRiskBadge(t.risk)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

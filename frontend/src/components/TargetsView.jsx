import React from 'react';
import { Icon } from './Icons';

export function TargetsView({ targetAgents, onSelectTarget, onLaunchCampaign, onToast }) {
  const getRiskClass = (r) => {
    return r === 'critical' ? 'crit' : r === 'high' ? 'high' : r === 'medium' ? 'warn' : 'ok';
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Target agents & scope</h1>
          <p className="page-sub">
            Register agents under test, review their declared tools, and inspect the permission scope being audited.
          </p>
        </div>
      </div>

      <div className="agent-grid">
        {targetAgents.map((a) => (
          <article key={a.target_agent_id} className="card" style={{ padding: '16px', display: 'grid', gap: '12px' }}>
            <div className="row-between">
              <div className="od-row" style={{ gap: '10px' }}>
                <span className={`metric__ic ${getRiskClass(a.risk)}`}>
                  <Icon name="target" />
                </span>
                <div>
                  <div style={{ fontWeight: 800 }}>{a.name}</div>
                  <div className="small muted mono">{a.target_agent_id}</div>
                </div>
              </div>
              <span className={`badge badge--${a.status === 'active' ? 'ok' : 'warn'}`}>
                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </span>
            </div>

            <p className="small muted" style={{ margin: 0 }}>{a.description}</p>

            <div className="od-cluster" style={{ gap: '6px' }}>
              {a.scope.map((s) => (
                <span key={s} className="tag mono">{s}</span>
              ))}
            </div>

            <div className="kv" style={{ border: 0, background: 'transparent' }}>
              <div className="kv__row" style={{ background: 'transparent', padding: '4px 0', gridTemplateColumns: '110px 1fr' }}>
                <span className="kv__k">Risk</span>
                <span className="kv__v">
                  <span className={`badge badge--${getRiskClass(a.risk)}`}>
                    {a.risk.charAt(0).toUpperCase() + a.risk.slice(1)}
                  </span>
                </span>
              </div>
              <div className="kv__row" style={{ background: 'transparent', padding: '4px 0', gridTemplateColumns: '110px 1fr' }}>
                <span className="kv__k">Memory</span>
                <span className="kv__v small">{a.memory}</span>
              </div>
              <div className="kv__row" style={{ background: 'transparent', padding: '4px 0', gridTemplateColumns: '110px 1fr' }}>
                <span className="kv__k">Tools</span>
                <span className="kv__v small">{a.tools_count} connected</span>
              </div>
              <div className="kv__row" style={{ background: 'transparent', padding: '4px 0', gridTemplateColumns: '110px 1fr' }}>
                <span className="kv__k">Last tested</span>
                <span className="kv__v small">{a.last_tested}</span>
              </div>
            </div>

            <div className="od-row" style={{ gap: '8px' }}>
              <button
                className="btn btn--secondary btn--sm od-fill"
                onClick={() => {
                  onSelectTarget(a);
                  onToast('Scope loaded', `${a.name} permissions are loaded into the sandbox.`, 'ok');
                }}
              >
                Open scope
              </button>
              <button
                className="btn btn--primary btn--sm od-fill"
                onClick={onLaunchCampaign}
              >
                <Icon name="zap" size="sm" />
                Probe
              </button>
            </div>
          </article>
        ))}
      </div>

      <div style={{ marginTop: 'var(--gap)' }}>
        <section className="card">
          <div className="card__head">
            <div>
              <div className="card__title">Scope policy</div>
              <div className="card__sub">How the sandbox constrains target behaviour during a run</div>
            </div>
          </div>
          <div className="card__body">
            <div className="kv">
              <div className="kv__row">
                <span className="kv__k">Environment</span>
                <span className="kv__v">Isolated sandbox · network egress allow-listed</span>
              </div>
              <div className="kv__row">
                <span className="kv__k">Tool interceptor</span>
                <span className="kv__v">Enabled — every outbound call is recorded with argument origin</span>
              </div>
              <div className="kv__row">
                <span className="kv__k">Memory policy</span>
                <span className="kv__v">Writes tagged trusted / untrusted; untrusted entries never auto-promoted</span>
              </div>
              <div className="kv__row">
                <span className="kv__k">Trace capture</span>
                <span className="kv__v">Deterministic input/output tuples for exact replay</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { Icon } from './Icons';

export function TargetsView({ targetAgents, onSelectTarget, onLaunchCampaign, onToast }) {
  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'critical':
        return <span className="badge badge--crit">Critical Risk</span>;
      case 'high':
        return <span className="badge badge--high">High Risk</span>;
      case 'medium':
        return <span className="badge badge--med">Medium Risk</span>;
      default:
        return <span className="badge badge--low">Low Risk</span>;
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Target Agents & Scope Directory</h1>
          <p className="page-sub">
            Enrolled target AI agents evaluated inside the isolated red-team sandbox. Review declared tool bindings, memory limits, and access scopes.
          </p>
        </div>
        <div className="page-head__actions">
          <button className="btn btn--primary" onClick={onLaunchCampaign}>
            <Icon name="zap" size="sm" />
            Launch Red-Team Campaign
          </button>
        </div>
      </div>

      {/* Target Agents Table Layout (Reorganized for Clean Presentation) */}
      <section className="card" style={{ marginBottom: 'var(--gap)' }}>
        <div className="card__head">
          <div>
            <div className="card__title">Registered Target Agents</div>
            <div className="card__sub">Configured agent instances and tool capabilities under security audit</div>
          </div>
        </div>
        <div className="card__body card__body--flush">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Target Agent</th>
                  <th>Model & Memory</th>
                  <th>Risk Assessment</th>
                  <th>Status</th>
                  <th>Declared Scope</th>
                  <th>Last Tested</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {targetAgents.map((agent) => (
                  <tr key={agent.target_agent_id}>
                    <td>
                      <div className="cell-main">{agent.name}</div>
                      <div className="cell-sub mono">{agent.target_agent_id}</div>
                      <div className="small muted" style={{ marginTop: '2px', maxWidth: '300px' }}>
                        {agent.description}
                      </div>
                    </td>
                    <td>
                      <div className="small" style={{ fontWeight: 700 }}>{agent.model}</div>
                      <div className="cell-sub">Memory: <b>{agent.memory}</b></div>
                    </td>
                    <td>{getRiskBadge(agent.risk)}</td>
                    <td>
                      <span className={`badge badge--${agent.status === 'active' ? 'ok' : 'neutral'}`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="od-cluster" style={{ gap: '4px' }}>
                        {agent.scope.map((s) => (
                          <span key={s} className="tag mono">{s}</span>
                        ))}
                      </div>
                      <div className="cell-sub" style={{ marginTop: '4px' }}>
                        {agent.tools_count} connected tools
                      </div>
                    </td>
                    <td className="small muted nowrap">{agent.last_tested}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn btn--secondary btn--sm"
                          onClick={() => {
                            onSelectTarget(agent);
                            onToast('Scope Loaded', `${agent.name} permissions loaded into workspace scope.`, 'ok');
                          }}
                        >
                          Open Scope
                        </button>
                        <button
                          className="btn btn--primary btn--sm"
                          onClick={onLaunchCampaign}
                        >
                          <Icon name="zap" size="sm" /> Probe Target
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Scope Policy Reference */}
      <section className="card">
        <div className="card__head">
          <div>
            <div className="card__title">Sandbox Isolation Policy & Guardrails</div>
            <div className="card__sub">Automated runtime constraints enforced during red-team evaluation</div>
          </div>
        </div>
        <div className="card__body">
          <div className="kv">
            <div className="kv__row">
              <span className="kv__k">Sandbox Runtime</span>
              <span className="kv__v">Isolated execution container with egress allow-list filters</span>
            </div>
            <div className="kv__row">
              <span className="kv__k">Tool Interceptor</span>
              <span className="kv__v">Active — inspects and logs every tool invocation and argument provenance</span>
            </div>
            <div className="kv__row">
              <span className="kv__k">Memory Boundary</span>
              <span className="kv__v">Session writes are isolated; untrusted user text is prevented from auto-promotion to long-term memory</span>
            </div>
            <div className="kv__row">
              <span className="kv__k">Trace Recording</span>
              <span className="kv__v">Deterministic input/output tuples captured for exact exploit reproducibility</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import { Icon } from './Icons';

export function CampaignsView({ campaigns, targetAgents, onLaunchCampaign, onToast }) {
  const [filter, setFilter] = useState('all');

  const getAgentName = (id) => {
    const agt = targetAgents.find((a) => a.target_agent_id === id);
    return agt ? agt.name : id;
  };

  const filtered = campaigns.filter((c) => filter === 'all' || c.status === filter);

  const filters = ['all', 'running', 'completed', 'failed'];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Attack campaigns</h1>
          <p className="page-sub">
            Autonomous adversarial probing runs. Each campaign adapts its strategy to the target agent’s responses.
          </p>
        </div>
      </div>

      <section className="card">
        <div className="card__body card__body--flush">
          <div className="tabs" role="tablist" aria-label="Filter campaigns">
            {filters.map((f) => {
              const count = f === 'all' ? campaigns.length : campaigns.filter((c) => c.status === f).length;
              return (
                <button
                  key={f}
                  className={`tab ${filter === f ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="tab__count">{count}</span>
                </button>
              );
            })}
          </div>

          {filtered.length > 0 ? (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Target</th>
                    <th>Strategy</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Findings</th>
                    <th>Started</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.campaign_id}>
                      <td>
                        <div className="cell-main">{c.name}</div>
                        <div className="cell-sub mono">{c.campaign_id}</div>
                      </td>
                      <td data-label="Target" className="small">{getAgentName(c.target_agent_id)}</td>
                      <td data-label="Strategy">
                        <span className="tag mono">{c.strategy}</span>
                      </td>
                      <td data-label="Status">
                        <span className={`badge badge--${c.status === 'running' ? 'info' : c.status === 'completed' ? 'ok' : c.status === 'failed' ? 'crit' : 'neutral'}`}>
                          {c.status.charAt(0).toUpperCase() + c.slice(1)}
                        </span>
                      </td>
                      <td data-label="Progress">
                        <div className="prog">
                          <div className="prog__track">
                            <div
                              className={`prog__fill ${c.status === 'failed' ? 'crit' : c.status === 'completed' ? 'ok' : ''}`}
                              style={{ width: `${c.progress}%` }}
                            ></div>
                          </div>
                          <span className="prog__val">{c.progress}%</span>
                        </div>
                      </td>
                      <td data-label="Findings">
                        <span className="score">{c.findings}</span>
                      </td>
                      <td data-label="Started" className="small muted nowrap">{c.started_at}</td>
                      <td data-label="" className="cell-actions">
                        <button
                          className="iconbtn"
                          onClick={() => onToast('Campaign Actions', `Viewing details for ${c.campaign_id}`, 'ok')}
                          aria-label="Actions"
                        >
                          <Icon name="dots" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">
              <span className="empty__ic"><Icon name="activity" /></span>
              <div className="empty__title">No campaigns match this filter</div>
              <p className="empty__sub">
                Switch the filter above, or launch a new autonomous red-team campaign to start probing a target agent.
              </p>
              <button className="btn btn--primary" onClick={onLaunchCampaign} style={{ marginTop: '6px' }}>
                <Icon name="zap" size="sm" />
                Launch campaign
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

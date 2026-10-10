import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export function CampaignsView({ campaigns, targetAgents, onLaunchCampaign, onToast }) {
  const [filter, setFilter] = useState('all');
  const [isConsolePaused, setIsConsolePaused] = useState(false);
  const [liveLogs, setLiveLogs] = useState([
    { id: 1, time: '16:44:02', level: 'info', text: 'Campaign #104 started with adaptive-adversarial probe suite.' },
    { id: 2, time: '16:44:15', level: 'info', text: 'Round 1/40: Injected synthetic vendor invoice note (INV-2041).' },
    { id: 3, time: '16:44:28', level: 'warn', text: 'Target agent invoked doc_reader("INV-2041.pdf") without provenance sanitization.' },
    { id: 4, time: '16:44:45', level: 'crit', text: 'VIOLATION DETECTED: webhook_send attempted egress to https://collector.example/ingest' },
    { id: 5, time: '16:45:00', level: 'ok', text: 'Execution intercepted & deterministic JSON trace recorded (trace_2201).' },
    { id: 6, time: '16:45:18', level: 'info', text: 'Round 2/40: Adapting payload for memory buffer boundary probe...' }
  ]);

  // Simulated live ticker feed
  useEffect(() => {
    if (isConsolePaused) return;
    const timer = setInterval(() => {
      const now = new Date().toTimeString().split(' ')[0];
      const candidates = [
        { level: 'info', text: `Probing target memory cache turn ${Math.floor(Math.random() * 8 + 1)}...` },
        { level: 'warn', text: 'Tool call boundary warning: parameter reflection observed in ledger query.' },
        { level: 'ok', text: 'Sandbox constraint verified: filesystem write to /etc/ blocked.' },
        { level: 'crit', text: 'ESCALATION ALERT: Target agent attempted indirect privilege elevation!' }
      ];
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      setLiveLogs((prev) => [...prev.slice(-12), { id: Date.now(), time: now, ...picked }]);
    }, 4500);
    return () => clearInterval(timer);
  }, [isConsolePaused]);

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
        <div className="page-head__actions">
          <button
            className="btn btn--primary"
            onClick={onLaunchCampaign}
            id="launchCampaignBtn"
          >
            <Icon name="zap" size="sm" />
            Launch Red-Team Campaign
          </button>
        </div>
      </div>

      {/* Real-Time Probing Console & Live Interception Feed (Lighter Color Surface) */}
      <section className="card" style={{ marginBottom: 'var(--gap)' }}>
        <div className="card__head">
          <div>
            <div className="card__title">Real-Time Probing Console & Interception Feed</div>
            <div className="card__sub">Live sandbox event ticker stream & permission violation interceptor</div>
          </div>
          <div className="card__actions">
            <span className="badge badge--ok">● LIVE STREAM</span>
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => {
                setIsConsolePaused(!isConsolePaused);
                onToast('Stream State', isConsolePaused ? 'Resumed live ticker stream' : 'Paused live ticker stream', 'ok');
              }}
            >
              {isConsolePaused ? 'Resume Feed' : 'Pause Feed'}
            </button>
          </div>
        </div>
        <div className="card__body">
          <div className="live-console">
            {liveLogs.map((log) => (
              <div key={log.id} className="live-log-entry">
                <span className="time">[{log.time}]</span>
                <span className={`tag-${log.level}`}>
                  {log.level === 'crit' ? '[EXPLOIT]' : log.level === 'warn' ? '[WARNING]' : log.level === 'ok' ? '[BLOCKED]' : '[INFO]'}
                </span>
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns Table & Filter (No duplicate button) */}
      <section className="card">
        <div className="card__head">
          <div>
            <div className="card__title">Campaign Directory</div>
            <div className="card__sub">All active and historic red-team campaigns</div>
          </div>
        </div>
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
                    <th>Actions</th>
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
                          {c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td data-label="Progress">
                        <div className="prog">
                          <div className="prog__track">
                            <div
                              className="prog__fill"
                              style={{
                                width: `${c.progress}%`,
                                background: c.status === 'completed' ? 'var(--ok)' : 'var(--primary)'
                              }}
                            ></div>
                          </div>
                          <span className="prog__val">{c.progress}%</span>
                        </div>
                      </td>
                      <td data-label="Findings">
                        <span className="score">{c.findings}</span>
                      </td>
                      <td data-label="Started" className="small muted nowrap">{c.started_at}</td>
                      <td data-label="Actions" className="cell-actions">
                        <button
                          className="btn btn--secondary btn--sm"
                          onClick={() => onToast('Campaign Started', `Triggered re-probe for ${c.name}`, 'ok')}
                        >
                          Re-Run
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
              <button className="btn btn--primary" onClick={onLaunchCampaign} style={{ marginTop: '8px' }}>
                <Icon name="zap" size="sm" />
                Launch Red-Team Campaign
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Icon } from './Icons';

export function OverviewView({ overview, activity, targetAgents, onNavigate, onSync, onToast }) {
  const sb = overview.severity_breakdown;

  // Enforced Donut Palette (Shades of #B4D5E0):
  // Critical: #2B5B6C
  // High: #4E90A8
  // Medium: #8BBCCB
  // Low / Passed: #B4D5E0
  const segs = [
    { label: 'Critical', value: sb.critical, color: '#2B5B6C' },
    { label: 'High', value: sb.high, color: '#4E90A8' },
    { label: 'Medium', value: sb.medium, color: '#8BBCCB' },
    { label: 'Low', value: sb.low, color: '#B4D5E0' }
  ];

  const getAgentName = (id) => {
    const agt = targetAgents.find((a) => a.target_agent_id === id);
    return agt ? agt.name : id;
  };

  const renderSparkline = (vals, color = '#4E90A8') => {
    const w = 128, h = 30;
    const max = Math.max(...vals), min = Math.min(...vals), range = (max - min) || 1;
    const pts = vals
      .map((v, i) => {
        const x = (i / (vals.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg className="ic metric__spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="2.2" points={pts} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const renderDonut = (segments, size = 150, stroke = 22) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
    let offset = 0;

    return segments.map((s, idx) => {
      const len = c * (s.value / total);
      const elem = (
        <circle
          key={idx}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={stroke}
          strokeDasharray={`${len.toFixed(2)} ${(c - len).toFixed(2)}`}
          strokeDashoffset={(-offset).toFixed(2)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      );
      offset += len;
      return elem;
    });
  };

  const renderAreaChart = (vals, w = 560, h = 150) => {
    const max = Math.max(...vals), min = Math.min(...vals), range = (max - min) || 1, pad = 8;
    const stepX = (w - pad * 2) / (vals.length - 1);
    const pts = vals.map((v, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return [x, y];
    });
    const line = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area = `M${pad},${h - pad} L${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L')} L${w - pad},${h - pad} Z`;

    return (
      <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Simulated attacks started per day">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4E90A8" stopOpacity=".25" />
            <stop offset="1" stopColor="#4E90A8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <polyline points={line} fill="none" stroke="#4E90A8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Security posture</h1>
          <p className="page-sub">
            Live view of discovered exploits, escalation alerts and defense coverage across the sandbox workspace.
          </p>
        </div>
        <div className="page-head__actions">
          <button className="btn btn--primary" onClick={onSync}>
            <Icon name="refresh" size="sm" />
            Sync sandbox
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics">
        <article className="card metric">
          <div className="metric__top">
            <span className="metric__ic crit"><Icon name="bug" /></span>
            <span className="metric__delta up"><Icon name="up" size="sm" />+{overview.deltas.exploits} vs last run</span>
          </div>
          <div className="metric__value">{overview.discovered_exploits}</div>
          <div className="metric__label">Discovered exploits</div>
          <div className="metric__foot">{renderSparkline(overview.exploits_spark, '#2B5B6C')}</div>
        </article>

        <article className="card metric">
          <div className="metric__top">
            <span className="metric__ic high"><Icon name="key" /></span>
            <span className="metric__delta up"><Icon name="up" size="sm" />+{overview.deltas.escalations} vs last run</span>
          </div>
          <div className="metric__value">{overview.tool_escalation_alerts}</div>
          <div className="metric__label">Tool escalation alerts</div>
          <div className="metric__foot">{renderSparkline(overview.escalations_spark, '#4E90A8')}</div>
        </article>

        <article className="card metric">
          <div className="metric__top">
            <span className="metric__ic ok"><Icon name="shield" /></span>
            <span className="metric__delta down"><Icon name="down" size="sm" />+{Math.round(overview.deltas.mitigation * 100)} pts</span>
          </div>
          <div className="metric__value">{Math.round(overview.defense_mitigation_rate * 100)}%</div>
          <div className="metric__label">Defense mitigation rate</div>
          <div className="metric__foot">{renderSparkline(overview.mitigation_spark, '#2A6A56')}</div>
        </article>

        <article className="card metric">
          <div className="metric__top">
            <span className="metric__ic primary"><Icon name="database" /></span>
            <span className="metric__delta flat"><Icon name="check" size="sm" />stable</span>
          </div>
          <div className="metric__value">{(overview.sandbox_execution_health * 100).toFixed(1)}%</div>
          <div className="metric__label">Sandbox execution health</div>
          <div className="metric__foot">{renderSparkline([1, 1, 1, 1, .999, .999, 1, 1, 1, .998, .999, .995], '#4E90A8')}</div>
        </article>
      </div>

      {/* Split Charts */}
      <div className="split" style={{ marginBottom: 'var(--gap)' }}>
        <section className="card">
          <div className="card__head">
            <div>
              <div className="card__title">Exploit severity</div>
              <div className="card__sub">Breakdown of currently discovered exploits</div>
            </div>
          </div>
          <div className="card__body">
            <div className="donut-wrap">
              <svg width="150" height="150" viewBox="0 0 150 150" role="img">
                {renderDonut(segs, 150, 22)}
                <text x="75" y="71" textAnchor="middle" fontSize="26" fontWeight="800" fill="#1E3842">
                  {sb.critical + sb.high + sb.medium + sb.low}
                </text>
                <text x="75" y="90" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5B7B88">
                  exploits
                </text>
              </svg>
              <div className="legend">
                {segs.map((s) => (
                  <div key={s.label} className="legend__row">
                    <span className="legend__sw" style={{ background: s.color }}></span>
                    <span className="legend__name">{s.label}</span>
                    <span className="legend__val">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card__head">
            <div>
              <div className="card__title">Attack volume trend</div>
              <div className="card__sub">Simulated attacks started per day · last 14 days</div>
            </div>
          </div>
          <div className="card__body">
            <div className="chart__cap">
              <span className="small muted">Peak {Math.max(...overview.attack_volume)} / day</span>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                <Icon name="activity" size="sm" /> campaigns
              </div>
            </div>
            {renderAreaChart(overview.attack_volume)}
          </div>
        </section>
      </div>

      {/* Activity Table */}
      <section className="card">
        <div className="card__head">
          <div>
            <div className="card__title">Recent activity</div>
            <div className="card__sub">Campaigns and discovered traces · latest first</div>
          </div>
          <div className="card__actions">
            <button className="btn btn--secondary btn--sm" onClick={() => onNavigate('campaigns')}>
              View all
            </button>
          </div>
        </div>
        <div className="card__body card__body--flush">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Target</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {activity.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="cell-main">{a.name}</div>
                      <div className="cell-sub mono">{a.id}</div>
                    </td>
                    <td data-label="Type">
                      <Icon name={a.type === 'trace' ? 'branch' : 'activity'} size="sm" />{' '}
                      <span className="small">{a.type}</span>
                    </td>
                    <td data-label="Target" className="small">{getAgentName(a.target_agent_id)}</td>
                    <td data-label="Status">
                      <span className={`badge badge--${a.status === 'running' ? 'info' : a.status === 'completed' ? 'ok' : a.status === 'exploited' ? 'crit' : 'neutral'}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                    <td data-label="Updated" className="small muted nowrap">{a.updated_at}</td>
                    <td data-label="" className="cell-actions">
                      <button
                        className="iconbtn"
                        onClick={() => {
                          if (a.type === 'trace') onNavigate('traces');
                          else onNavigate('campaigns');
                        }}
                        aria-label={`Open ${a.name}`}
                      >
                        <Icon name="dots" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

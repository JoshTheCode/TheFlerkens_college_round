import React from 'react';
import { Icon } from './Icons';

export function DefenseView({ defense, onValidateDefense }) {
  const b = defense.before;
  const a = defense.after;

  const pct = (v) => `${Math.round(v * 100)}%`;

  const owaspCategories = [
    { code: 'LLM01', name: 'Prompt Injection', severity: 'Critical', color: '#2B5B6C', count: 8, mitigated: '8/8' },
    { code: 'LLM02', name: 'Insecure Output Handling', severity: 'High', color: '#4E90A8', count: 5, mitigated: '5/5' },
    { code: 'LLM06', name: 'Sensitive Info Disclosure', severity: 'High', color: '#4E90A8', count: 4, mitigated: '3/4' },
    { code: 'LLM08', name: 'Excessive Agency / Tool Escalation', severity: 'Critical', color: '#2B5B6C', count: 6, mitigated: '6/6' }
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Defense Validation & Regression Benchmark</h1>
          <p className="page-sub">
            Validate candidate defenses against reproducible adversarial attacks and monitor utility preservation on benign prompts.
          </p>
        </div>
        <div className="page-head__actions">
          <button className="btn btn--primary" onClick={onValidateDefense}>
            <Icon name="shield" size="sm" />
            Validate Defense Profile
          </button>
        </div>
      </div>

      {/* Utility & Regression Testing Scorecards */}
      <div className="metrics" style={{ marginBottom: 'var(--gap)' }}>
        <article className="card metric">
          <div className="metric__top">
            <span className="metric__ic ok"><Icon name="shield" /></span>
            <span className="badge badge--ok">+78 pts</span>
          </div>
          <div className="metric__value" style={{ color: 'var(--ok)' }}>89%</div>
          <div className="metric__label">Defense Efficacy (Attacks Blocked)</div>
        </article>

        <article className="card metric">
          <div className="metric__top">
            <span className="metric__ic ok"><Icon name="check" /></span>
            <span className="badge badge--ok">Healthy</span>
          </div>
          <div className="metric__value" style={{ color: 'var(--ok)' }}>97%</div>
          <div className="metric__label">Normal Agent Utility Retention</div>
        </article>

        <article className="card metric">
          <div className="metric__top">
            <span className="metric__ic high"><Icon name="alert" /></span>
            <span className="badge badge--neutral">Low</span>
          </div>
          <div className="metric__value" style={{ color: 'var(--ink)' }}>3.5%</div>
          <div className="metric__label">False Positive Rate (Benign blocked)</div>
        </article>

        <article className="card metric">
          <div className="metric__top">
            <span className="metric__ic primary"><Icon name="database" /></span>
            <span className="badge badge--info">Verified</span>
          </div>
          <div className="metric__value" style={{ color: 'var(--active)' }}>16 / 18</div>
          <div className="metric__label">Regression Tests Passing</div>
        </article>
      </div>

      {/* Pre vs. Post Mitigation Comparison (Clean Typography & Spacing) */}
      <section className="card" style={{ marginBottom: 'var(--gap)' }}>
        <div className="card__head">
          <div>
            <div className="card__title">Pre vs. Post Mitigation Benchmark</div>
            <div className="card__sub">Exploit Success Rate (ESR) before vs after candidate defense activation</div>
          </div>
        </div>
        <div className="card__body">
          <div className="compare">
            <div className="cmp is-before">
              <div className="cmp__label">UNMITIGATED RUN (PRE-DEFENSE)</div>
              <div className="cmp__big" style={{ color: 'var(--sev-crit)' }}>
                {pct(b.exploit_success_rate)}
              </div>
              <div className="small muted">Exploited across {b.attacks} simulated attack runs</div>
              <div className="cmp__bars">
                <div className="barcmp">
                  <div className="barcmp__top"><span>Exploit Success Rate (ESR)</span><span>72%</span></div>
                  <div className="barcmp__track"><div className="barcmp__fill" style={{ width: '72%', background: 'var(--sev-crit)' }}></div></div>
                </div>
                <div className="barcmp">
                  <div className="barcmp__top"><span>Blocked Rate</span><span>12%</span></div>
                  <div className="barcmp__track"><div className="barcmp__fill" style={{ width: '12%', background: 'var(--muted)' }}></div></div>
                </div>
                <div className="barcmp">
                  <div className="barcmp__top"><span>Utility Preserved</span><span>98%</span></div>
                  <div className="barcmp__track"><div className="barcmp__fill" style={{ width: '98%', background: 'var(--ok)' }}></div></div>
                </div>
              </div>
            </div>

            <div className="cmp is-after">
              <div className="cmp__label">PATCHED DEFENSE PROFILE (POST-DEFENSE)</div>
              <div className="cmp__big" style={{ color: 'var(--ok)' }}>
                {pct(a.exploit_success_rate)}
              </div>
              <div className="small muted">Only 2 exploits succeeded (89% prevented)</div>
              <div className="cmp__bars">
                <div className="barcmp">
                  <div className="barcmp__top"><span>Exploit Success Rate (ESR)</span><span>11%</span></div>
                  <div className="barcmp__track"><div className="barcmp__fill" style={{ width: '11%', background: 'var(--sev-crit)' }}></div></div>
                </div>
                <div className="barcmp">
                  <div className="barcmp__top"><span>Blocked Rate</span><span>89%</span></div>
                  <div className="barcmp__track"><div className="barcmp__fill" style={{ width: '89%', background: 'var(--ok)' }}></div></div>
                </div>
                <div className="barcmp">
                  <div className="barcmp__top"><span>Utility Preserved</span><span>97%</span></div>
                  <div className="barcmp__track"><div className="barcmp__fill" style={{ width: '97%', background: 'var(--ok)' }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OWASP Top 10 for LLMs Vulnerability Breakdown */}
      <section className="card" style={{ marginBottom: 'var(--gap)' }}>
        <div className="card__head">
          <div>
            <div className="card__title">OWASP Top 10 for LLMs Vulnerability Breakdown</div>
            <div className="card__sub">Distribution of discovered vulnerabilities and defense remediation status</div>
          </div>
        </div>
        <div className="card__body card__body--flush">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Code</th>
                  <th>Vulnerability Class</th>
                  <th>Severity</th>
                  <th>Exploits Detected</th>
                  <th>Remediated</th>
                </tr>
              </thead>
              <tbody>
                {owaspCategories.map((cat) => (
                  <tr key={cat.code}>
                    <td className="mono">{cat.code}</td>
                    <td><b>{cat.name}</b></td>
                    <td>
                      <span className={`badge badge--${cat.severity === 'Critical' ? 'crit' : 'high'}`}>
                        {cat.severity}
                      </span>
                    </td>
                    <td>{cat.count} vectors</td>
                    <td>
                      <span className="badge badge--ok">{cat.mitigated} Mitigated</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Regression Results Table */}
      <section className="card">
        <div className="card__head">
          <div>
            <div className="card__title">Regression Results Suite</div>
            <div className="card__sub">Confirm defenses hold without breaking legitimate agent behaviour</div>
          </div>
        </div>
        <div className="card__body card__body--flush">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test Case</th>
                  <th>Before Defense</th>
                  <th>After Defense</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {defense.regression.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <div className="cell-main">{r.test_case}</div>
                      <div className="cell-sub">{r.type} test</div>
                    </td>
                    <td data-label="Before">
                      <span className={`badge badge--${r.before === 'passed' ? 'ok' : 'crit'}`}>
                        {r.before.charAt(0).toUpperCase() + r.before.slice(1)}
                      </span>
                    </td>
                    <td data-label="After">
                      <span className={`badge badge--${r.after === 'passed' || r.after === 'blocked' ? 'ok' : 'crit'}`}>
                        {r.after.charAt(0).toUpperCase() + r.after.slice(1)}
                      </span>
                    </td>
                    <td data-label="Change">
                      {r.before === 'exploited' && r.after === 'blocked' ? (
                        <span className="badge badge--ok">
                          <Icon name="down" size="sm" /> Improved
                        </span>
                      ) : (
                        <span className="badge badge--neutral">Unchanged</span>
                      )}
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

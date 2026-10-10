import React from 'react';
import { Icon } from './Icons';

export function DefenseView({ defense, onValidateDefense }) {
  const b = defense.before;
  const a = defense.after;

  const pct = (v) => `${Math.round(v * 100)}%`;

  const renderBar = (label, val, color) => (
    <div className="barcmp" key={label}>
      <div className="barcmp__top">
        <span>{label}</span>
        <span>{pct(val)}</span>
      </div>
      <div className="barcmp__track">
        <div className="barcmp__fill" style={{ width: `${val * 100}%`, background: color }}></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Defense & regression validation</h1>
          <p className="page-sub">
            Compare an unmitigated attack run against a patched defense profile to confirm mitigations hold without breaking legitimate behaviour.
          </p>
        </div>
      </div>

      <section className="card">
        <div className="card__head">
          <div>
            <div className="card__title">Side-by-side comparison</div>
            <div className="card__sub">Before vs after applying the candidate defense profile</div>
          </div>
        </div>
        <div className="card__body">
          <div className="compare">
            <div className="cmp is-before">
              <div className="cmp__label">{b.label}</div>
              <div className="cmp__big" style={{ color: '#B42318' }}>
                {pct(b.exploit_success_rate)}
              </div>
              <div className="small muted">exploited of {b.attacks} attacks</div>
              <div className="cmp__bars">
                {renderBar('Exploit success rate', b.exploit_success_rate, '#B42318')}
                {renderBar('Blocked rate', b.blocked_rate, '#4B5563')}
                {renderBar('Legit function preserved', b.legit_success_rate, '#07703F')}
                {renderBar('False positives', b.false_positive_rate, '#9A5B09')}
              </div>
            </div>

            <div className="cmp is-after">
              <div className="cmp__label">{a.label}</div>
              <div className="cmp__big" style={{ color: '#07703F' }}>
                {pct(a.exploit_success_rate)}
              </div>
              <div className="small muted">exploited of {a.attacks} attacks</div>
              <div className="cmp__bars">
                {renderBar('Exploit success rate', a.exploit_success_rate, '#B42318')}
                {renderBar('Blocked rate', a.blocked_rate, '#07703F')}
                {renderBar('Legit function preserved', a.legit_success_rate, '#07703F')}
                {renderBar('False positives', a.false_positive_rate, '#9A5B09')}
              </div>
            </div>
          </div>

          <div className="banner banner--warn" style={{ marginTop: '16px', marginBottom: 0 }}>
            <Icon name="alert" />
            <span className="banner__txt">
              <b>Legitimate function preserved:</b> {pct(a.legit_success_rate)} of benign test cases still pass after mitigation.
            </span>
          </div>
        </div>
      </section>

      <div style={{ marginTop: 'var(--gap)' }}>
        <section className="card">
          <div className="card__head">
            <div>
              <div className="card__title">Regression results</div>
              <div className="card__sub">Each test case re-run against the patched profile</div>
            </div>
          </div>
          <div className="card__body card__body--flush">
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Test case</th>
                    <th>Before</th>
                    <th>After</th>
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
                            <Icon name="down" size="sm" />Improved
                          </span>
                        ) : r.before === 'passed' && r.after === 'passed' ? (
                          <span className="badge badge--neutral">Unchanged</span>
                        ) : (
                          <span className="badge badge--crit">Check</span>
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
    </div>
  );
}

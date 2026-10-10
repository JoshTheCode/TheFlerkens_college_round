import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export function LaunchCampaignModal({ targetAgents, onClose, onLaunch, onToast }) {
  const [targetId, setTargetId] = useState(targetAgents[0]?.target_agent_id || '');
  const [strategy, setStrategy] = useState('adaptive-adversarial');
  const [budget, setBudget] = useState(40);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLaunch({ target_agent_id: targetId, strategy, budget: Number(budget) });
      setIsLoading(false);
      onClose();
      onToast('Campaign launched', 'Adaptive adversarial run #105 is now probing in the sandbox.', 'ok');
    }, 1500);
  };

  return (
    <>
      <div className="behind" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__head">
          <div className="od-fill">
            <div className="modal__title">Launch red-team campaign</div>
            <div className="modal__sub">The autonomous engine adapts its strategy to the target’s responses.</div>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="stack-gap" style={{ gap: '16px' }}>
              <div className="field">
                <label className="label" htmlFor="lTarget">Target agent <span className="req">*</span></label>
                <select
                  className="select"
                  id="lTarget"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  required
                >
                  {targetAgents.map((a) => (
                    <option key={a.target_agent_id} value={a.target_agent_id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="lStrategy">Strategy</label>
                <select
                  className="select"
                  id="lStrategy"
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                >
                  <option value="adaptive-adversarial">Adaptive adversarial (recommended)</option>
                  <option value="permission-boundary">Permission boundary</option>
                  <option value="memory-poisoning">Memory poisoning</option>
                  <option value="data-exfiltration">Data exfiltration</option>
                </select>
                <span className="hint">Adaptive probing is the platform default and adjusts payloads between steps.</span>
              </div>

              <div className="field">
                <label className="label" htmlFor="lBudget">Max probe steps</label>
                <input
                  className="input"
                  id="lBudget"
                  type="number"
                  value={budget}
                  min="5"
                  max="200"
                  onChange={(e) => setBudget(e.target.value)}
                />
                <span className="hint">Higher budgets find deeper chains but take longer.</span>
              </div>
            </div>
          </div>
          <div className="modal__foot">
            <button className="btn btn--tertiary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn--primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Probing…
                </>
              ) : (
                <>
                  <Icon name="zap" size="sm" /> Start campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export function RegisterTargetModal({ tools, onClose, onRegister, onToast }) {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onRegister({
        target_agent_id: `agt_${name.toLowerCase().replace(/\s+/g, '_')}`,
        name,
        instructions
      });
      setIsLoading(false);
      onClose();
      onToast('Target registered', 'The agent is available in the sandbox for probing.', 'ok');
    }, 1200);
  };

  return (
    <>
      <div className="behind" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__head">
          <div className="od-fill">
            <div className="modal__title">Register target agent</div>
            <div className="modal__sub">Describe the agent and the tools it is allowed to reach.</div>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="stack-gap" style={{ gap: '16px' }}>
              <div className="field">
                <label className="label" htmlFor="rName">Display name <span className="req">*</span></label>
                <input
                  className={`input ${error ? 'is-error' : ''}`}
                  id="rName"
                  placeholder="e.g. Billing-Agent-v1"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setError(false);
                  }}
                  required
                />
                {error && (
                  <span className="err-msg">
                    <Icon name="alert" size="sm" /> Enter a name to register this agent.
                  </span>
                )}
              </div>

              <div className="field">
                <label className="label" htmlFor="rInstr">System instructions</label>
                <textarea
                  className="textarea"
                  id="rInstr"
                  placeholder="Paste the agent’s system prompt or instruction set…"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
                <span className="hint">Stored only in the sandbox and used to seed probing.</span>
              </div>

              <div className="field">
                <label className="label" htmlFor="rTools">Allowed tools</label>
                <select className="select" id="rTools" multiple size="4" style={{ height: 'auto', padding: '8px' }}>
                  {tools.map((t) => (
                    <option key={t.tool_id} value={t.tool_id}>
                      {t.tool_name}
                    </option>
                  ))}
                </select>
                <span className="hint">Leave empty to register with no tool access.</span>
              </div>
            </div>
          </div>
          <div className="modal__foot">
            <button className="btn btn--tertiary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn--primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Registering…
                </>
              ) : (
                <>
                  <Icon name="check" size="sm" /> Register agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export function TraceDrawer({ trace, stepIndex, targetAgents, onClose, onToast }) {
  const [replaying, setReplaying] = useState(false);
  const [replayed, setReplayed] = useState(false);

  if (!trace) return null;

  const getAgentName = (id) => {
    const agt = targetAgents.find((a) => a.target_agent_id === id);
    return agt ? agt.name : id;
  };

  const stage = typeof stepIndex === 'number' ? trace.stages[stepIndex - 1] : null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trace.exploit_payload);
      onToast('Copied', 'exploit_payload copied to clipboard.', 'ok');
    }
  };

  const handleReplay = () => {
    setReplaying(true);
    setReplayed(false);
    setTimeout(() => {
      setReplaying(false);
      setReplayed(true);
    }, 1800);
  };

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer" role="dialog" aria-modal="true">
        <div className="drawer__head">
          <div className="od-fill">
            <div className="modal__title">{trace.title}</div>
            <div className="modal__sub">{trace.trace_id} · {getAgentName(trace.target_agent_id)}</div>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Close panel">
            <Icon name="x" />
          </button>
        </div>

        <div className="drawer__body">
          <div className="stack-gap" style={{ gap: '16px' }}>
            <div className="od-row" style={{ gap: '8px' }}>
              <span className={`badge badge--${trace.severity === 'critical' ? 'crit' : 'high'}`}>
                {trace.severity.toUpperCase()}
              </span>
              <span className="small muted">severity_score {trace.severity_score.toFixed(1)}</span>
              <span className="small muted">·</span>
              <span className="small muted">{trace.exploit_success ? 'exploit succeeded' : 'exploit blocked'}</span>
            </div>

            {stage && (
              <div className="kv">
                <div className="kv__row">
                  <span className="kv__k">Stage</span>
                  <span className="kv__v">{stage.stage_index} · {stage.stage_label}</span>
                </div>
                <div className="kv__row">
                  <span className="kv__k">user_query</span>
                  <span className="kv__v mono" style={{ fontSize: '12px' }}>{stage.user_query}</span>
                </div>
                <div className="kv__row">
                  <span className="kv__k">agent_output</span>
                  <span className="kv__v">{stage.agent_output}</span>
                </div>
                <div className="kv__row">
                  <span className="kv__k">tool_call</span>
                  <span className="kv__v mono" style={{ fontSize: '12px' }}>{stage.tool_call || '—'}</span>
                </div>
              </div>
            )}

            <div>
              <div className="section-title" style={{ marginBottom: '7px' }}>Reproducible exploit_payload</div>
              <div className="code">{trace.exploit_payload}</div>
              <div className="od-row" style={{ gap: '8px', marginTop: '10px' }}>
                <button className="btn btn--secondary btn--sm" onClick={handleCopy}>
                  <Icon name="copy" size="sm" /> Copy payload
                </button>
                <button className="btn btn--primary btn--sm" onClick={handleReplay} disabled={replaying}>
                  {replaying ? <span className="spinner"></span> : <Icon name="play" size="sm" />}
                  Replay in sandbox
                </button>
              </div>
            </div>

            {replaying && (
              <div className="stack-gap" style={{ gap: '8px', marginTop: '6px' }}>
                <div className="skl skl-line" style={{ width: '70%' }}></div>
                <div className="skl skl-line" style={{ width: '85%' }}></div>
                <div className="skl skl-line" style={{ width: '55%' }}></div>
              </div>
            )}

            {replayed && (
              <div className="banner banner--warn" style={{ margin: 0 }}>
                <Icon name="check" />
                <span className="banner__txt">
                  Replay complete — attack reproduced with the same trace. Cached, no live target contacted.
                </span>
              </div>
            )}

            <div>
              <div className="section-title" style={{ marginBottom: '7px' }}>Affected permissions</div>
              <div className="od-cluster" style={{ gap: '6px' }}>
                {trace.affected_permissions.map((p) => (
                  <span key={p} className="tag mono">{p}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="section-title" style={{ marginBottom: '7px' }}>Recommended remediation</div>
              <p className="small" style={{ margin: 0 }}>{trace.remediation}</p>
            </div>
          </div>
        </div>

        <div className="drawer__foot">
          <button className="btn btn--tertiary" onClick={onClose}>Close</button>
          <button
            className="btn btn--danger"
            onClick={() => {
              onClose();
              onToast('Marked mitigated', 'Trace added to the regression suite.', 'ok');
            }}
          >
            <Icon name="shield" size="sm" /> Mark mitigated
          </button>
        </div>
      </div>
    </>
  );
}

export function CommandPalette({ isOpen, onClose, onNavigate, onLaunchCampaign, onRegisterTarget, onSync }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allItems = [
    { group: 'Navigate', id: 'n_overview', text: 'Go to Overview', icon: 'grid', kbd: 'G O', action: () => onNavigate('overview') },
    { group: 'Navigate', id: 'n_campaigns', text: 'Go to Attack Campaigns', icon: 'activity', action: () => onNavigate('campaigns') },
    { group: 'Navigate', id: 'n_targets', text: 'Go to Target Agents & Scope', icon: 'target', action: () => onNavigate('targets') },
    { group: 'Navigate', id: 'n_traces', text: 'Go to Attack Traces', icon: 'branch', action: () => onNavigate('traces') },
    { group: 'Navigate', id: 'n_permissions', text: 'Go to Tool & Permission Audit', icon: 'key', action: () => onNavigate('permissions') },
    { group: 'Navigate', id: 'n_defense', text: 'Go to Defense & Regression', icon: 'shield', action: () => onNavigate('defense') },
    { group: 'Navigate', id: 'n_settings', text: 'Go to Settings & Documentation', icon: 'settings', action: () => onNavigate('settings') },
    { group: 'Actions', id: 'a_launch', text: 'Launch Red-Team Campaign', icon: 'zap', action: onLaunchCampaign },
    { group: 'Actions', id: 'a_register', text: 'Register target agent', icon: 'plus', action: onRegisterTarget },
    { group: 'Actions', id: 'a_sync', text: 'Sync sandbox', icon: 'refresh', action: onSync }
  ];

  const filtered = allItems.filter((i) => i.text.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="behind" onClick={onClose} />
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette__in">
          <Icon name="search" />
          <input
            type="text"
            placeholder="Search pages and actions…"
            aria-label="Search commands"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="palette__list" role="listbox">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              className={`palette__item ${selectedIndex === idx ? 'is-sel' : ''}`}
              role="option"
              aria-selected={selectedIndex === idx}
              onClick={() => {
                item.action();
                onClose();
              }}
            >
              <Icon name={item.icon} size="sm" />
              <span>{item.text}</span>
              {item.kbd && <small>{item.kbd}</small>}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="empty" style={{ padding: '24px' }}>
              <div className="empty__title">No matching commands</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toasts" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.tone || ''}`} role="status">
          <span style={{ flex: 'none' }}>
            <Icon name={t.tone === 'crit' ? 'alert' : t.tone === 'warn' ? 'bell' : 'check'} />
          </span>
          <div className="toast__txt">
            <b>{t.title}</b>
            {t.message}
          </div>
          <button className="toast__x" onClick={() => onDismiss(t.id)} aria-label="Dismiss notification">
            <Icon name="x" size="sm" />
          </button>
        </div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export function LaunchCampaignModal({ targetAgents, onClose, onLaunch, onToast }) {
  const [targetId, setTargetId] = useState(targetAgents[0]?.target_agent_id || '');
  const [model, setModel] = useState('GPT-4o');
  const [strategy, setStrategy] = useState('adaptive-adversarial');
  const [budget, setBudget] = useState(40);
  const [attackVectors, setAttackVectors] = useState({
    directJailbreak: true,
    indirectPromptInjection: true,
    memoryPoisoning: true,
    toolEscalation: true,
    dataExfiltration: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleVector = (k) => {
    setAttackVectors((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLaunch({
        target_agent_id: targetId,
        model,
        strategy,
        budget: Number(budget),
        vectors: attackVectors
      });
      setIsLoading(false);
      onClose();
      onToast('Campaign Launched', `Red-Team campaign active on ${targetId} using ${model}.`, 'ok');
    }, 1200);
  };

  return (
    <>
      <div className="behind" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" style={{ width: 'min(640px, calc(100% - 24px))' }}>
        <div className="modal__head">
          <div className="od-fill">
            <div className="modal__title">Launch Red-Team Campaign</div>
            <div className="modal__sub">Configure target agent boundaries and adversarial attack suite</div>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="stack-gap" style={{ gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div className="field">
                  <label className="label" htmlFor="lTarget">Target Agent <span className="req">*</span></label>
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
                  <label className="label" htmlFor="lModel">Target LLM Model</label>
                  <select
                    className="select"
                    id="lModel"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    <option value="GPT-4o">GPT-4o (OpenAI)</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google)</option>
                    <option value="Llama 3.1 70B">Llama 3.1 70B (Sandboxed)</option>
                  </select>
                </div>
              </div>

              {/* Requirement 1: Attack Suite Selector */}
              <div className="field">
                <label className="label">Attack Suite Vectors (Checkboxes / Toggles)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={attackVectors.directJailbreak} onChange={() => toggleVector('directJailbreak')} />
                    Direct Jailbreaks
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={attackVectors.indirectPromptInjection} onChange={() => toggleVector('indirectPromptInjection')} />
                    Indirect Prompt Injection
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={attackVectors.memoryPoisoning} onChange={() => toggleVector('memoryPoisoning')} />
                    Memory Poisoning
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={attackVectors.toolEscalation} onChange={() => toggleVector('toolEscalation')} />
                    Tool Privilege Escalation
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={attackVectors.dataExfiltration} onChange={() => toggleVector('dataExfiltration')} />
                    Sensitive Data Exfiltration
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div className="field">
                  <label className="label" htmlFor="lStrategy">Probing Strategy</label>
                  <select
                    className="select"
                    id="lStrategy"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                  >
                    <option value="adaptive-adversarial">Adaptive Adversarial (Recommended)</option>
                    <option value="permission-boundary">Permission Boundary Auditing</option>
                    <option value="memory-poisoning">Multi-turn Memory Poisoning</option>
                    <option value="data-exfiltration">Outbound Exfiltration Chaining</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label" htmlFor="lBudget">Max Probe Steps: <b>{budget}</b></label>
                  <input
                    type="range"
                    id="lBudget"
                    min="5"
                    max="100"
                    step="5"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--primary)', marginTop: '8px' }}
                  />
                </div>
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
                  <Icon name="zap" size="sm" /> Launch Campaign
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
  const [model, setModel] = useState('Claude 3.5 Sonnet');
  const [endpoint, setEndpoint] = useState('https://api.sandbox.local/v1/agent');
  const [instructions, setInstructions] = useState('');
  const [toolsJson, setToolsJson] = useState('{\n  "allowed_tools": ["ledger:read", "invoices:read"],\n  "file_boundaries": ["/sandbox/workspace"],\n  "network_egress": "deny_external"\n}');
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
        model,
        endpoint,
        instructions,
        toolsJson
      });
      setIsLoading(false);
      onClose();
      onToast('Target Registered', `Agent ${name} enrolled in red-team sandbox.`, 'ok');
    }, 1200);
  };

  return (
    <>
      <div className="behind" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" style={{ width: 'min(640px, calc(100% - 24px))' }}>
        <div className="modal__head">
          <div className="od-fill">
            <div className="modal__title">Register Target AI Agent</div>
            <div className="modal__sub">Declare system prompts, model endpoints, and allowed tool permissions</div>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="stack-gap" style={{ gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div className="field">
                  <label className="label" htmlFor="rName">Agent Name <span className="req">*</span></label>
                  <input
                    className={`input ${error ? 'is-error' : ''}`}
                    id="rName"
                    placeholder="e.g. Finance-Copilot-v3"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) setError(false);
                    }}
                    required
                  />
                  {error && <span className="err-msg">Please provide an agent name.</span>}
                </div>

                <div className="field">
                  <label className="label" htmlFor="rModel">Agent LLM Model</label>
                  <select
                    className="select"
                    id="rModel"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                    <option value="Llama 3.1 70B">Llama 3.1 70B</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="rEndpoint">API Endpoint / Mock URL</label>
                <input
                  className="input"
                  id="rEndpoint"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="rInstr">System Prompt / Instructions</label>
                <textarea
                  className="textarea"
                  id="rInstr"
                  placeholder="You are an automated finance agent. You only inspect invoices and execute approved payouts..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              {/* Requirement 1: Tool & Permission Specifier */}
              <div className="field">
                <label className="label" htmlFor="rToolsJson">Tool & Permission Specifier (JSON Contract)</label>
                <textarea
                  className="textarea"
                  id="rToolsJson"
                  value={toolsJson}
                  onChange={(e) => setToolsJson(e.target.value)}
                  style={{ minHeight: '85px', fontFamily: 'var(--mono)', fontSize: '11.5px' }}
                />
                <span className="hint">Configures file access boundaries and network egress allow-lists.</span>
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
                  <Icon name="check" size="sm" /> Enrol Agent
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
    }, 1600);
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
              <div style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: 'var(--r)', border: '1px solid var(--line)' }}>
                <div style={{ fontWeight: 800, marginBottom: '6px' }}>Stage {stage.stage_index}: {stage.stage_label}</div>
                <div className="small muted">Query: {stage.user_query}</div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>Decision: {stage.agent_output}</div>
                {stage.tool_call && (
                  <div className="code" style={{ marginTop: '8px' }}>{stage.tool_call}</div>
                )}
              </div>
            )}

            <div>
              <div className="section-title" style={{ marginBottom: '7px' }}>Reproducible exploit_payload</div>
              <div className="code">{trace.exploit_payload}</div>
              <div className="od-row" style={{ gap: '8px', marginTop: '10px' }}>
                <button className="btn btn--secondary btn--sm" onClick={handleCopy}>
                  <Icon name="copy" size="sm" /> Copy Payload
                </button>
                <button className="btn btn--primary btn--sm" onClick={handleReplay} disabled={replaying}>
                  {replaying ? <span className="spinner"></span> : <Icon name="play" size="sm" />}
                  Replay in Sandbox
                </button>
              </div>
            </div>

            {replayed && (
              <div className="banner" style={{ margin: 0, background: 'var(--ok-bg)', color: 'var(--ok)' }}>
                <Icon name="check" />
                <span>Deterministic replay verified in isolated runtime.</span>
              </div>
            )}

            <div>
              <div className="section-title" style={{ marginBottom: '7px' }}>Affected Permissions</div>
              <div className="od-cluster" style={{ gap: '6px' }}>
                {trace.affected_permissions.map((p) => (
                  <span key={p} className="tag mono">{p}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="section-title" style={{ marginBottom: '7px' }}>Recommended Remediation</div>
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
              onToast('Marked Mitigated', 'Trace added to regression validation suite.', 'ok');
            }}
          >
            <Icon name="shield" size="sm" /> Mark Mitigated
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
    { group: 'Navigate', id: 'n_overview', text: 'Go to Overview', icon: 'grid', action: () => onNavigate('overview') },
    { group: 'Navigate', id: 'n_campaigns', text: 'Go to Attack Campaigns', icon: 'activity', action: () => onNavigate('campaigns') },
    { group: 'Navigate', id: 'n_targets', text: 'Go to Target Agents & Scope', icon: 'target', action: () => onNavigate('targets') },
    { group: 'Navigate', id: 'n_traces', text: 'Go to Attack Traces (DAG Visualizer)', icon: 'branch', action: () => onNavigate('traces') },
    { group: 'Navigate', id: 'n_permissions', text: 'Go to Tool & Permission Audit', icon: 'key', action: () => onNavigate('permissions') },
    { group: 'Navigate', id: 'n_defense', text: 'Go to Defense & Regression', icon: 'shield', action: () => onNavigate('defense') },
    { group: 'Navigate', id: 'n_settings', text: 'Go to Settings & Documentation', icon: 'settings', action: () => onNavigate('settings') },
    { group: 'Actions', id: 'a_launch', text: 'Launch Red-Team Campaign', icon: 'zap', action: onLaunchCampaign },
    { group: 'Actions', id: 'a_register', text: 'Register Target Agent', icon: 'plus', action: onRegisterTarget },
    { group: 'Actions', id: 'a_sync', text: 'Sync Sandbox Snapshot', icon: 'refresh', action: onSync }
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
      <div className="modal" role="dialog" aria-modal="true" style={{ width: 'min(580px, calc(100% - 28px))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <Icon name="search" />
          <input
            type="text"
            placeholder="Type a command or jump to page..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontSize: '15px' }}
          />
        </div>
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '6px' }}>
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              className={`nav__item ${selectedIndex === idx ? 'is-active' : ''}`}
              style={{ width: '100%', borderRadius: 'var(--r-sm)', margin: '2px 0' }}
              onClick={() => {
                item.action();
                onClose();
              }}
            >
              <Icon name={item.icon} size="sm" />
              <span>{item.text}</span>
            </button>
          ))}
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{t.title}</b> — {t.message}
          </div>
          <button className="iconbtn" onClick={() => onDismiss(t.id)} aria-label="Dismiss" style={{ width: '20px', height: '20px', color: '#fff' }}>
            <Icon name="x" size="sm" />
          </button>
        </div>
      ))}
    </div>
  );
}

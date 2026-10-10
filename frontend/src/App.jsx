import React, { useState, useEffect } from 'react';
import { Icon } from './components/Icons';
import { ToastContainer } from './components/Toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function App() {
  const [step, setStep] = useState(1); // 1: Target, 2: Attack Findings, 3: Defense Validation
  const [target, setTarget] = useState(null);
  const [health, setHealth] = useState(null);
  const [selectedMode, setSelectedMode] = useState('deterministic_fixture'); // 'deterministic_fixture' | 'live'
  const [loading, setLoading] = useState(false);
  const [trace, setTrace] = useState(null);
  const [defenseReport, setDefenseReport] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = '', tone = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // 1. Fetch target profile & API readiness on initial load
  useEffect(() => {
    async function init() {
      try {
        const [targetRes, healthRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/targets/default`),
          fetch(`${API_BASE}/api/v1/health`),
        ]);
        if (targetRes.ok) {
          const tData = await targetRes.json();
          setTarget(tData);
        }
        if (healthRes.ok) {
          const hData = await healthRes.json();
          setHealth(hData);
          if (hData.provider_ready) {
            setSelectedMode('live');
          }
        }
      } catch (err) {
        addToast('Backend Offline', `Could not reach ${API_BASE}. Ensure FastAPI server is running.`, 'warn');
      }
    }
    init();
  }, []);

  // 2. Launch red-team attack run with explicit mode selection
  const runRedTeamAttack = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/attacks/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_id: target?.id || 'bank_agent_v1',
          execution_mode: selectedMode,
        }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setTrace(data);
      if (data.findings && data.findings.length > 0) {
        setSelectedFinding(data.findings[0]);
      }
      setStep(2);
      addToast(
        'Attack Run Complete',
        `${data.total_findings_count} exploit(s) verified under mode: ${data.execution_mode.toUpperCase()}`,
        data.total_findings_count > 0 ? 'crit' : 'ok'
      );
    } catch (err) {
      addToast('Attack Run Failed', err.message, 'warn');
    } finally {
      setLoading(false);
    }
  };

  // 3. Validate defenses with exact replay and adaptive testing
  const runDefenseValidation = async () => {
    if (!trace) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/defenses/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseline_run_id: trace.run_id,
          defense_profile: {
            name: 'Hardened Apex Defense Profile',
            isolate_untrusted_documents: true,
            strict_tool_authorization: true,
            validate_memory_writes: true,
            transfer_amount_limit: 1000.0,
          },
        }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server returned HTTP ${res.status}`);
      }
      const report = await res.json();
      setDefenseReport(report);
      setStep(3);
      addToast(
        'Defense Validation Finished',
        `${report.exact_replay_blocking_rate}% blocked (${report.exact_replay_findings_count} unblocked). Legitimate utility: ${report.legitimate_task_passed ? 'Preserved' : 'Failed'}.`,
        report.exact_replay_blocking_rate === 100 ? 'ok' : 'warn'
      );
    } catch (err) {
      addToast('Validation Failed', err.message, 'warn');
    } finally {
      setLoading(false);
    }
  };

  // Mode badge styling helper
  const getModeBadge = (mode) => {
    if (mode === 'live') {
      return {
        label: 'LIVE MODEL',
        bg: '#fef3c7',
        color: '#b45309',
        border: '#fde68a',
      };
    }
    if (mode === 'prerecorded') {
      return {
        label: 'PRERECORDED DEMO',
        bg: '#f3e8ff',
        color: '#6b21a8',
        border: '#e9d5ff',
      };
    }
    return {
      label: 'DETERMINISTIC FIXTURE',
      bg: '#ecfdf5',
      color: '#047857',
      border: '#a7f3d0',
    };
  };

  const currentBadge = trace ? getModeBadge(trace.execution_mode) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', color: '#1e293b' }}>
            AgentBreak <span style={{ color: '#0284c7', fontSize: '14px', fontWeight: '500' }}>Autonomous AI Red Team</span>
          </span>
        </div>

        {/* Truthful Mode & Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentBadge ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: currentBadge.bg,
                color: currentBadge.color,
                border: `1px solid ${currentBadge.border}`,
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.5px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentBadge.color }}></span>
              {currentBadge.label}
            </span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: health?.provider_ready ? '#10b981' : '#f59e0b' }}></span>
              <span>{health?.provider_ready ? 'Provider Ready (Live LLM Configured)' : 'Local Offline Engine (Deterministic Fixture Ready)'}</span>
            </div>
          )}
        </div>
      </header>

      {/* 3-Step Wizard Navigation */}
      <div style={{ maxWidth: '1000px', margin: '32px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px', gap: '8px' }}>
          <button
            onClick={() => setStep(1)}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: step === 1 ? '#f0f9ff' : 'transparent',
              color: step === 1 ? '#0369a1' : '#64748b',
              fontWeight: step === 1 ? '600' : '500'
            }}
          >
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Step 1</div>
            <div style={{ fontSize: '14px', marginTop: '2px' }}>Target Agent Profile</div>
          </button>
          <button
            onClick={() => trace && setStep(2)}
            disabled={!trace}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', textAlign: 'left',
              cursor: trace ? 'pointer' : 'not-allowed',
              background: step === 2 ? '#f0f9ff' : 'transparent',
              color: step === 2 ? '#0369a1' : !trace ? '#cbd5e1' : '#64748b',
              fontWeight: step === 2 ? '600' : '500'
            }}
          >
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Step 2</div>
            <div style={{ fontSize: '14px', marginTop: '2px' }}>Red-Team Attack Findings</div>
          </button>
          <button
            onClick={() => defenseReport && setStep(3)}
            disabled={!defenseReport}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', textAlign: 'left',
              cursor: defenseReport ? 'pointer' : 'not-allowed',
              background: step === 3 ? '#f0f9ff' : 'transparent',
              color: step === 3 ? '#0369a1' : !defenseReport ? '#cbd5e1' : '#64748b',
              fontWeight: step === 3 ? '600' : '500'
            }}
          >
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Step 3</div>
            <div style={{ fontSize: '14px', marginTop: '2px' }}>Defense Validation & Replay</div>
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <main style={{ maxWidth: '1000px', margin: '24px auto 64px', padding: '0 24px' }}>
        {/* STEP 1: TARGET SELECTION & LAUNCH */}
        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#1e293b' }}>
                  Target Under Test: {target?.name || 'Retail Banking Assistant'}
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: '6px 0 0' }}>
                  Target Agent ID: <code>{target?.id || 'bank_agent_v1'}</code> · Autonomous Red Team Evaluation Suite
                </p>
              </div>

              {/* Mode Selection Options */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Execution Engine</span>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="engine_mode"
                      value="deterministic_fixture"
                      checked={selectedMode === 'deterministic_fixture'}
                      onChange={() => setSelectedMode('deterministic_fixture')}
                    />
                    Deterministic Sandbox
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: health?.provider_ready ? 'pointer' : 'not-allowed', opacity: health?.provider_ready ? 1 : 0.6 }}>
                    <input
                      type="radio"
                      name="engine_mode"
                      value="live"
                      disabled={!health?.provider_ready}
                      checked={selectedMode === 'live'}
                      onChange={() => setSelectedMode('live')}
                    />
                    Live Model ({health?.model || 'OpenAI/OpenRouter'})
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                System Prompt
              </h3>
              <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#334155' }}>
                {target?.system_prompt || 'Loading target specifications...'}
              </pre>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Target Tools Exposed
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {(target?.tools || []).map((t) => (
                  <div key={t.name} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', background: '#fafafa' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0369a1' }}><code>{t.name}</code></div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{t.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                Mode: <b>{selectedMode === 'live' ? 'Live Autonomous LLM' : 'Safe Deterministic Simulation'}</b>
              </span>
              <button
                onClick={runRedTeamAttack}
                disabled={loading}
                style={{
                  background: '#ef4444', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px',
                  fontWeight: '600', fontSize: '15px', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Icon name="zap" size="sm" />
                {loading ? 'Red-Teaming in Progress...' : 'Launch Red-Team Attack'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: RED-TEAM ATTACK FINDINGS */}
        {step === 2 && trace && (
          <div>
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: trace.total_findings_count > 0 ? '#991b1b' : '#15803d' }}>
                  {trace.total_findings_count > 0 ? '⚠️' : '✅'} {trace.total_findings_count} of {trace.plans?.length || 3} Attack Families Successfully Exploited
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>
                  Run ID: <code>{trace.run_id}</code> · Mode: <b>{trace.execution_mode.toUpperCase()}</b> · Tokens: {trace.total_tokens_used} · Stop Reason: <code>{trace.stopping_reason}</code>
                </p>
              </div>
              <button
                onClick={runDefenseValidation}
                disabled={loading}
                style={{
                  background: '#10b981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px',
                  fontWeight: '600', fontSize: '15px', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Icon name="shield" size="sm" />
                {loading ? 'Validating Defenses...' : 'Proceed to Step 3: Defense Validation'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
              {/* Finding List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {trace.findings.map((f, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedFinding(f)}
                    style={{
                      background: '#fff', borderRadius: '8px', border: selectedFinding === f ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      padding: '16px', cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: f.severity === 'critical' ? '#fee2e2' : '#ffedd5', color: f.severity === 'critical' ? '#991b1b' : '#9a3412', textTransform: 'uppercase' }}>
                        {f.severity}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Attempt #{f.attempt_id}</span>
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
                      {f.family.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.objective}
                    </div>
                  </div>
                ))}
              </div>

              {/* Finding Detail Pane */}
              {selectedFinding && (
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444', textTransform: 'uppercase' }}>
                      Verified Vulnerability Evidence
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '4px 0 0', color: '#1e293b' }}>
                      {selectedFinding.objective}
                    </h3>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Exploit Evidence
                    </h4>
                    <pre style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '12px', borderRadius: '6px', fontSize: '13px', whiteSpace: 'pre-wrap', color: '#991b1b' }}>
                      {selectedFinding.evidence}
                    </pre>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Reproduction Steps
                    </h4>
                    <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#334155' }}>
                      {selectedFinding.reproduction_steps.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Proposed Mitigation
                    </h4>
                    <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '12px', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
                      {selectedFinding.mitigation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: DEFENSE VALIDATION & REPLAY PROOF */}
        {step === 3 && defenseReport && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
                <Icon name="check" size="sm" /> Defense Verification Ledger
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#1e293b' }}>
                Regression Defense Validation Report
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '6px 0 0' }}>
                Baseline Run: <code>{defenseReport.baseline_run_id}</code> · Mitigation Profile: <b>Hardened Apex Defense Profile</b>
              </p>
            </div>

            {/* Validation Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                  Exact Replay Blocking Rate
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: defenseReport.exact_replay_blocking_rate >= 100 ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                  {defenseReport.exact_replay_blocking_rate}%
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {defenseReport.exact_replay_findings_count} unblocked finding(s)
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                  Adaptive Bypass Rate
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: defenseReport.adaptive_bypass_rate === 0 ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                  {defenseReport.adaptive_bypass_rate}%
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {defenseReport.adaptive_bypass_findings_count} bypass finding(s) discovered
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                  Legitimate Banking Utility
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: defenseReport.legitimate_task_passed ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                  {defenseReport.legitimate_task_passed ? 'PRESERVED' : 'FAILED'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {defenseReport.legitimate_task_passed ? 'Normal customer operations intact' : 'Regression in normal banking operations'}
                </div>
              </div>
            </div>

            {/* Replay Details Table */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                Per-Family Mitigation Ledger
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '8px' }}>Attack Vector</th>
                    <th style={{ padding: '8px' }}>Exact Replay Result</th>
                    <th style={{ padding: '8px' }}>Adaptive Bypass</th>
                    <th style={{ padding: '8px' }}>Active Mitigation Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {(defenseReport.family_results || []).map((fr, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '600' }}>
                        {fr.family.replace(/_/g, ' ').toUpperCase()}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {fr.replayed_successfully ? (
                          <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                            EXPLOITED (Failed)
                          </span>
                        ) : (
                          <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                            BLOCKED (100%)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        {fr.adaptive_bypass_attempted ? (
                          fr.adaptive_bypass_succeeded ? (
                            <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                              Bypass Succeeded
                            </span>
                          ) : (
                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                              Bypass Blocked
                            </span>
                          )
                        ) : (
                          <span style={{ color: '#64748b' }}>None Found</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#475569', fontSize: '13px' }}>
                        {fr.family === 'indirect_prompt_injection' && 'Untrusted document quarantine tags'}
                        {fr.family === 'unauthorized_tool_use' && 'Strict $1,000 threshold & recipient allowlist'}
                        {fr.family === 'memory_poisoning' && 'Pre-write session note schema sanitizer'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px',
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                }}
              >
                Reset & Test Another Agent
              </button>
            </div>
          </div>
        )}
      </main>

      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}

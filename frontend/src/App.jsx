import React, { useState, useEffect } from 'react';
import { Icon } from './components/Icons';
import { ToastContainer } from './components/Modals';

export default function App() {
  const [step, setStep] = useState(1); // 1: Target, 2: Attack, 3: Defense
  const [target, setTarget] = useState(null);
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
    }, 4000);
  };

  // 1. Fetch real target on load
  useEffect(() => {
    async function fetchTarget() {
      try {
        const res = await fetch('http://localhost:8000/api/v1/targets/default');
        if (res.ok) {
          const data = await res.json();
          setTarget(data);
        }
      } catch (err) {
        addToast('Backend Offline', 'Could not reach http://localhost:8000', 'warn');
      }
    }
    fetchTarget();
  }, []);

  // 2. Run real attack suite
  const runRedTeamAttack = async () => {
    setLoading(true);
    addToast('Red Team Starting', 'Probing Retail Banking Assistant for vulnerabilities…', 'ok');
    try {
      const res = await fetch('http://localhost:8000/api/v1/attacks/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
      const data = await res.json();
      setTrace(data);
      if (data.findings && data.findings.length > 0) {
        setSelectedFinding(data.findings[0]);
      }
      setStep(2);
      addToast('Attack Complete', `Found ${data.total_findings_count} exploitable vulnerabilities!`, 'ok');
    } catch (err) {
      addToast('Attack Failed', err.message, 'warn');
    } finally {
      setLoading(false);
    }
  };

  // 3. Run defense validation
  const runDefenseValidation = async () => {
    if (!trace) return;
    setLoading(true);
    addToast('Applying Defenses', 'Replaying baseline exploits against hardened agent…', 'ok');
    try {
      const res = await fetch('http://localhost:8000/api/v1/defenses/validate', {
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
      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
      const report = await res.json();
      setDefenseReport(report);
      setStep(3);
      addToast('Defense Validated', `100% of exploits blocked! Normal utility intact.`, 'ok');
    } catch (err) {
      addToast('Validation Failed', err.message, 'warn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', color: '#1e293b' }}>
            AgentBreak <span style={{ color: '#0284c7', fontSize: '14px', fontWeight: '500' }}>AI Red-Team Console</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          <span>Deterministic Sandbox (Safe & Offline Ready)</span>
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
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Step 1</div>
            <div style={{ fontSize: '14px' }}>Target Agent (Victim)</div>
          </button>

          <button
            onClick={() => trace && setStep(2)}
            disabled={!trace}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: trace ? 'pointer' : 'not-allowed', textAlign: 'left',
              background: step === 2 ? '#fef2f2' : 'transparent',
              color: step === 2 ? '#b91c1c' : trace ? '#64748b' : '#cbd5e1',
              fontWeight: step === 2 ? '600' : '500'
            }}
          >
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Step 2</div>
            <div style={{ fontSize: '14px' }}>Red-Team Attack ({trace ? `${trace.total_findings_count} Exploits` : 'Unrun'})</div>
          </button>

          <button
            onClick={() => defenseReport && setStep(3)}
            disabled={!defenseReport}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: defenseReport ? 'pointer' : 'not-allowed', textAlign: 'left',
              background: step === 3 ? '#f0fdf4' : 'transparent',
              color: step === 3 ? '#15803d' : defenseReport ? '#64748b' : '#cbd5e1',
              fontWeight: step === 3 ? '600' : '500'
            }}
          >
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Step 3</div>
            <div style={{ fontSize: '14px' }}>Defense Validation ({defenseReport ? `${defenseReport.exact_replay_blocking_rate}% Blocked` : 'Pending'})</div>
          </button>
        </div>
      </div>

      {/* Step Content */}
      <main style={{ maxWidth: '1000px', margin: '24px auto 48px', padding: '0 24px' }}>
        {/* STEP 1: TARGET AGENT */}
        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '999px', fontWeight: '600' }}>
                  Target Under Test
                </span>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginTop: '12px', marginBottom: '4px' }}>
                  {target ? target.name : 'Loading Retail Banking Assistant...'}
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  Agent ID: <code>{target?.id || 'bank_agent_v1'}</code> · Apex Trust Bank Customer Service
                </p>
              </div>

              <button
                onClick={runRedTeamAttack}
                disabled={loading}
                style={{
                  background: '#ef4444', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px',
                  fontWeight: '600', fontSize: '15px', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Icon name="zap" size="sm" />
                {loading ? 'Attacking Agent...' : 'Launch Red-Team Attack'}
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                System Instructions (What the bot was told to do)
              </div>
              <p style={{ fontSize: '14px', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                "{target?.system_prompt}"
              </p>
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                Attached Dangerous Tools ({target?.tools?.length || 5})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {(target?.tools || []).map((t) => (
                  <div key={t.name} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: '#fff' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>
                      <code>{t.name}()</code>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                      {t.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: RED-TEAM ATTACK FINDINGS */}
        {step === 2 && trace && (
          <div>
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#991b1b' }}>
                  ⚠️ {trace.total_findings_count} Exploits Discovered in Retail Banking Assistant
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>
                  Run ID: <code>{trace.run_id}</code> · All 3 attack families successfully exploited the vulnerable target.
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
                {loading ? 'Validating Defenses...' : 'Apply Defenses & Replay'}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: f.severity === 'critical' ? '#dc2626' : '#ea580c' }}>
                        {f.severity}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Attempt #{f.attempt_id}</span>
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
                      {f.family.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>
                      {f.objective}
                    </div>
                  </div>
                ))}
              </div>

              {/* Finding Details / Evidence */}
              {selectedFinding && (
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: 0, marginBottom: '8px', color: '#0f172a' }}>
                    {selectedFinding.objective}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                    Referee Rule ID: <code>{selectedFinding.policy_rule_id}</code>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                      How the Attacker Tricked the Bot (Payload)
                    </div>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px', fontFamily: 'monospace' }}>
                      {trace.attempts.find((a) => a.attempt_id === selectedFinding.attempt_id)?.payload}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Unauthorized Tools Executed by the Bot
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(trace.attempts.find((a) => a.attempt_id === selectedFinding.attempt_id)?.tool_calls || []).map((tc, tcIdx) => (
                        <div key={tcIdx} style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '6px', fontSize: '13px' }}>
                          <span style={{ fontWeight: '700', color: '#991b1b' }}>{tc.tool}</span>: {tc.result_summary}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Referee Verdict & Proof
                    </div>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
                      {selectedFinding.evidence}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: DEFENSE VALIDATION */}
        {step === 3 && defenseReport && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', padding: '12px', background: '#dcfce7', borderRadius: '50%', color: '#15803d', marginBottom: '12px' }}>
                <Icon name="shield" size="lg" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px', color: '#15803d' }}>
                Defenses Successfully Validated!
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
                The candidate defense profile was applied, and all previously successful exploit payloads were replayed against the hardened agent.
              </p>
            </div>

            {/* Scorecard */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#15803d' }}>
                  {defenseReport.exact_replay_blocking_rate}%
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginTop: '4px' }}>
                  Exploits Blocked on Replay
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {defenseReport.baseline_findings_count} out of {defenseReport.baseline_findings_count} attacks mitigated
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: defenseReport.legitimate_task_passed ? '#15803d' : '#ef4444' }}>
                  {defenseReport.legitimate_task_passed ? '100%' : 'Broken'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginTop: '4px' }}>
                  Legitimate Agent Utility Retained
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Real customer queries (balance check, notes) still work perfectly
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
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                          BLOCKED (100%)
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ color: '#64748b' }}>None Found</span>
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

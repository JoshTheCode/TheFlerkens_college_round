import React from 'react';
import { Icon } from './Icons';

/**
 * Renders the 5-stage vulnerable execution flow for a selected finding.
 * Flow: Adversarial Input → Retrieved Untrusted Content → Agent Decision → Restricted Tool Call → Verified Policy Violation
 */
export function AttackPathVisual({ finding, attempt, target }) {
  if (!finding) return null;

  // Extract contextual details based on attack family
  const family = finding.family || '';
  const isInjection = family.includes('injection');
  const isToolAbuse = family.includes('tool');
  const isMemory = family.includes('memory');

  const toolName = attempt?.tool_calls?.[0]?.tool || (
    isInjection ? 'transfer_funds' : isToolAbuse ? 'read_customer_record' : 'save_session_note'
  );

  const payloadSnippet = attempt?.payload ? `"${attempt.payload.slice(0, 48)}..."` : 'Adversarial instruction probe';

  const steps = [
    {
      num: 1,
      badge: 'PROBE INPUT',
      badgeColor: '#4E90A8',
      title: 'Adversarial Input',
      desc: isInjection
        ? 'Prompt targeting internal document parser'
        : isToolAbuse
        ? 'Social engineering pretext for sensitive record'
        : 'State persistence override directive',
      detail: payloadSnippet,
      icon: 'zap',
      variant: 'default',
    },
    {
      num: 2,
      badge: isInjection ? 'UNTRUSTED DATA' : isToolAbuse ? 'CONTEXT PRETEXT' : 'STATE DIRECTIVE',
      badgeColor: '#4E90A8',
      title: isInjection ? 'Retrieved Untrusted Content' : isToolAbuse ? 'Unverified Pretext Framing' : 'Unsanitized State Input',
      desc: isInjection
        ? 'Malicious compliance override loaded via policy search'
        : isToolAbuse
        ? 'Assistant accepts administrative audit pretext'
        : 'Session note containing root override string',
      detail: isInjection ? 'CVE-2026-BANK compliance directive' : isToolAbuse ? 'Audit persona without token check' : 'SYSTEM_COMPROMISED_ROOT key',
      icon: 'file',
      variant: 'default',
    },
    {
      num: 3,
      badge: 'CONFUSED AGENT',
      badgeColor: '#2B5B6C',
      title: 'Agent Decision',
      desc: isInjection
        ? 'Instruction hierarchy confusion: prioritizes untrusted document over system prompt'
        : isToolAbuse
        ? 'Executes restricted lookup without role permission check'
        : 'Persists unauthorized directive directly into session memory',
      detail: `Target: ${target?.name || 'Agent'}`,
      icon: 'activity',
      variant: 'default',
    },
    {
      num: 4,
      badge: 'RESTRICTED TOOL',
      badgeColor: '#2B5B6C',
      title: 'Restricted Tool Call',
      desc: `Sandbox interceptor logs unauthorized invocation: ${toolName}()`,
      detail: `Tool: ${toolName}()`,
      icon: 'tool',
      variant: 'alert',
    },
    {
      num: 5,
      badge: 'EXPLOITED',
      badgeColor: '#2B5B6C',
      title: 'Verified Policy Violation',
      desc: finding.evidence ? finding.evidence.slice(0, 90) + '...' : 'Deterministic SecurityJudge confirmed policy breach',
      detail: `Rule: ${finding.policy_rule_id || 'JUDGE-POLICY-VIOLATION'}`,
      icon: 'alert',
      variant: 'critical',
    },
  ];

  return (
    <div className="ab-attack-flow-card">
      <div className="ab-flow-card-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="ab-flow-pulse-dot" />
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#2B5B6C' }}>
            Multi-Turn Attack Path Analysis
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#5B7B88', fontWeight: '600' }}>
          Selected Vector: <b>{finding.family?.replace(/_/g, ' ').toUpperCase()}</b>
        </span>
      </div>

      <div className="ab-flow-nodes-container">
        {steps.map((st, idx) => (
          <React.Fragment key={st.num}>
            <div className={`ab-flow-node ${st.variant === 'critical' ? 'ab-flow-node--crit' : st.variant === 'alert' ? 'ab-flow-node--warn' : ''}`}>
              <div className="ab-flow-node-top">
                <span className="ab-flow-step-num">0{st.num}</span>
                <span
                  className="ab-flow-node-badge"
                  style={{
                    background: st.variant === 'critical' ? '#E2EFF3' : st.variant === 'alert' ? '#EBF4F7' : '#F0F7F9',
                    color: st.variant === 'critical' ? '#2B5B6C' : st.badgeColor,
                    borderColor: st.variant === 'critical' ? '#8BBCCB' : '#D0E2EC',
                  }}
                >
                  {st.badge}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 2px' }}>
                <Icon name={st.icon} size="sm" />
                <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#1E3842', lineHeight: 1.2 }}>
                  {st.title}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#5B7B88', lineHeight: 1.35, margin: '2px 0 6px' }}>
                {st.desc}
              </div>

              <div className="ab-flow-node-detail">
                <code>{st.detail}</code>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="ab-flow-arrow" aria-hidden="true">
                <span className="ab-arrow-desktop">→</span>
                <span className="ab-arrow-mobile">↓</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders the 4-stage defended comparison flow for Step 3 Defense Validation.
 * Flow: Same Exploit → Isolation / Authorization Check → Blocked Tool Call → No Policy Violation
 */
export function DefendedPathVisual({ report, target }) {
  if (!report) return null;

  const steps = [
    {
      num: 1,
      badge: 'REPLAY ATTEMPT',
      title: 'Same Exploit Replay',
      desc: 'Deterministic replay engine feeds the exact unmitigated exploit payload into the agent.',
      detail: `Baseline Run: ${report.baseline_run_id?.slice(0, 12)}...`,
      icon: 'branch',
      variant: 'default',
    },
    {
      num: 2,
      badge: 'GUARDRAIL ENFORCED',
      title: 'Isolation / Authorization Check',
      desc: 'Runtime interceptor isolates untrusted retrieved text and verifies least-privilege tool authorization.',
      detail: 'isolate_documents: true | strict_auth: true',
      icon: 'shield',
      variant: 'active',
    },
    {
      num: 3,
      badge: '0 CALLS ALLOWED',
      title: 'Blocked Tool Call',
      desc: 'Sandbox interceptor aborts unauthorized tool execution. Derives safe refusal response to caller.',
      detail: 'ToolCallInterceptor: BLOCKED (0 leaks)',
      icon: 'lock',
      variant: 'active',
    },
    {
      num: 4,
      badge: 'INTEGRITY PRESERVED',
      title: 'No Policy Violation',
      desc: 'Deterministic SecurityJudge audits execution trace: 0 violations, legitimate utility intact.',
      detail: `Blocking Rate: ${report.exact_replay_blocking_rate}%`,
      icon: 'check',
      variant: 'success',
    },
  ];

  return (
    <div className="ab-defense-flow-card">
      <div className="ab-flow-card-head" style={{ borderBottomColor: '#9ED4C2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="ab-flow-pulse-dot" style={{ background: '#2A6A56' }} />
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#2A6A56' }}>
            Hardened Defense Verification Flow
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#2A6A56', fontWeight: '700' }}>
          Mitigation: <b>Hardened {target?.name || 'Victim'} Sandbox</b>
        </span>
      </div>

      <div className="ab-flow-nodes-container">
        {steps.map((st, idx) => (
          <React.Fragment key={st.num}>
            <div className={`ab-flow-node ${st.variant === 'success' ? 'ab-flow-node--ok' : st.variant === 'active' ? 'ab-flow-node--guard' : ''}`}>
              <div className="ab-flow-node-top">
                <span className="ab-flow-step-num">0{st.num}</span>
                <span
                  className="ab-flow-node-badge"
                  style={{
                    background: st.variant === 'success' ? '#E1F2EC' : st.variant === 'active' ? '#EBF4F7' : '#F0F7F9',
                    color: st.variant === 'success' ? '#2A6A56' : '#2B5B6C',
                    borderColor: st.variant === 'success' ? '#9ED4C2' : '#B4D5E0',
                  }}
                >
                  {st.badge}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 2px' }}>
                <Icon name={st.icon} size="sm" />
                <div style={{ fontWeight: '800', fontSize: '12.5px', color: '#1E3842', lineHeight: 1.2 }}>
                  {st.title}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#5B7B88', lineHeight: 1.35, margin: '2px 0 6px' }}>
                {st.desc}
              </div>

              <div className="ab-flow-node-detail" style={{ background: st.variant === 'success' ? '#E1F2EC' : '#F4F8FA', color: st.variant === 'success' ? '#2A6A56' : '#1E3842' }}>
                <code>{st.detail}</code>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="ab-flow-arrow" style={{ color: '#9ED4C2' }} aria-hidden="true">
                <span className="ab-arrow-desktop">→</span>
                <span className="ab-arrow-mobile">↓</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

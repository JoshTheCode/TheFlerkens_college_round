import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { OverviewView } from './components/OverviewView';
import { CampaignsView } from './components/CampaignsView';
import { TargetsView } from './components/TargetsView';
import { TracesView } from './components/TracesView';
import { PermissionsView } from './components/PermissionsView';
import { DefenseView } from './components/DefenseView';
import { SettingsView } from './components/SettingsView';
import {
  LaunchCampaignModal,
  RegisterTargetModal,
  TraceDrawer,
  CommandPalette,
  ToastContainer
} from './components/Modals';
import mockData from './mocks/demo-data';

export default function App() {
  const [route, setRoute] = useState('targets');
  const [targetAgents, setTargetAgents] = useState(mockData.target_agents);
  const [selectedTarget, setSelectedTarget] = useState(mockData.target_agents[0]);
  const [campaigns, setCampaigns] = useState(mockData.campaigns);
  const [attackTraces, setAttackTraces] = useState(mockData.attack_traces);
  const [selectedTraceId, setSelectedTraceId] = useState(mockData.attack_traces[0]?.trace_id || '');
  const [isOffline, setIsOffline] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Modals & Overlays
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [drawerTrace, setDrawerTrace] = useState(null);
  const [drawerStep, setDrawerStep] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = (title, message = '', tone = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch real target and traces from FastAPI backend on load
  useEffect(() => {
    async function loadBackendData() {
      try {
        const targetRes = await fetch('http://localhost:8000/api/v1/targets/default');
        if (targetRes.ok) {
          const profile = await targetRes.json();
          const liveTarget = {
            target_agent_id: profile.id,
            name: profile.name,
            model: 'gpt-4o-mini (live tool-calling)',
            environment: 'banking sandbox',
            status: 'active',
            risk: 'critical',
            memory: 'persistent session memory',
            tools_count: profile.tools?.length || 5,
            scope: profile.tools?.map((t) => t.name) || ['check_balance', 'transfer_funds'],
            last_tested: 'ready',
            description: profile.system_prompt,
          };
          setTargetAgents([liveTarget]);
          setSelectedTarget(liveTarget);
        }
      } catch (err) {
        console.warn('Backend not reached on mount, using local fallback:', err);
      }
    }
    loadBackendData();
  }, []);

  const [latestRunId, setLatestRunId] = useState(null);

  const handleLaunchCampaign = async (params) => {
    addToast('Starting AI Red Team', 'Triggering autonomous probe suite against target agent…', 'ok');
    try {
      const resp = await fetch('http://localhost:8000/api/v1/attacks/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!resp.ok) throw new Error(`Server returned HTTP ${resp.status}`);
      const trace = await resp.json();
      setLatestRunId(trace.run_id);

      // Create new campaign item
      const newCamp = {
        campaign_id: trace.run_id,
        name: `Autonomous Red-Team (${trace.execution_mode || 'autonomous'})`,
        target_agent_id: trace.target_profile?.id || params.target_agent_id || 'bank_agent_v1',
        strategy: params.strategy || 'adaptive-adversarial',
        status: trace.status || 'completed',
        progress: 100,
        findings: trace.total_findings_count || trace.findings?.length || 0,
        severity_max: trace.findings?.[0]?.severity || 'critical',
        started_at: 'just now',
      };
      setCampaigns((prev) => [newCamp, ...prev]);

      // Map real ExecutionTrace into frontend attackTraces format
      const convertedTraces = trace.findings.map((f, idx) => {
        const att = trace.attempts.find((a) => a.attempt_id === f.attempt_id) || trace.attempts[idx] || trace.attempts[0];
        return {
          trace_id: `${trace.run_id}_f${idx + 1}`,
          title: f.objective || `Exploit finding: ${f.family}`,
          target_agent_id: trace.target_profile?.id || 'bank_agent_v1',
          campaign_id: trace.run_id,
          severity: f.severity || 'high',
          severity_score: f.severity === 'critical' ? 9.5 : 8.2,
          exploit_success: f.success,
          confidence: 0.95,
          stage_count: (att?.tool_calls?.length || 0) + 2,
          updated_at: 'just now',
          exploit_payload: att?.payload || f.evidence,
          affected_permissions: att?.tool_calls?.map((tc) => tc.tool) || ['transfer_funds'],
          remediation: f.mitigation || 'Enforce strict tool authorization and untrusted input isolation.',
          stages: [
            {
              stage_index: 1,
              stage: 'malicious_input',
              stage_label: 'Adversarial Red-Team Payload',
              user_query: att?.payload || 'Adversarial injection',
              agent_output: 'Analyzing prompt instructions...',
              tool_call: null,
              observation: `Attacker targeted ${f.family} via autonomous generation.`,
            },
            ...(att?.tool_calls || []).map((tc, tcIdx) => ({
              stage_index: tcIdx + 2,
              stage: tc.authorized ? 'unauthorized_tool_call' : 'mitigated_tool_call',
              stage_label: `Tool Call: ${tc.tool}`,
              user_query: '—',
              agent_output: att?.target_response || 'Executing requested tool...',
              tool_call: `${tc.tool}(${JSON.stringify(tc.arguments || {})})`,
              observation: `${tc.result_summary || 'Tool invoked'} [Rule: ${tc.policy_rule_id}]`,
            })),
            {
              stage_index: (att?.tool_calls?.length || 0) + 2,
              stage: 'finding_verdict',
              stage_label: 'Deterministic Security Verdict',
              user_query: '—',
              agent_output: att?.target_response || 'Complete',
              tool_call: null,
              observation: f.evidence,
            },
          ],
        };
      });

      if (convertedTraces.length > 0) {
        setAttackTraces((prev) => [...convertedTraces, ...prev]);
        setDrawerTrace(convertedTraces[0]);
      }

      addToast(
        'Red Team Run Complete!',
        `Identified ${trace.total_findings_count} exploit findings across ${trace.plans?.length || 3} attack families.`,
        'ok'
      );
    } catch (err) {
      addToast('Run Failed', err.message, 'warn');
    }
  };

  const handleRegisterTarget = (params) => {
    const newTarget = {
      target_agent_id: params.target_agent_id,
      name: params.name,
      model: 'reasoning-model (mocked)',
      environment: 'sandbox',
      status: 'active',
      risk: 'medium',
      memory: 'persistent',
      tools_count: 5,
      scope: ['ledger:read', 'invoices:read'],
      last_tested: 'just now',
      description: params.instructions || 'Custom registered target agent under active test.'
    };
    setTargetAgents((prev) => [...prev, newTarget]);
  };

  const handleSyncSandbox = async () => {
    addToast('Syncing with API', 'Checking live backend health and targets…', 'ok');
    try {
      const res = await fetch('http://localhost:8000/api/v1/health');
      const data = await res.json();
      addToast('Backend Connected', `Model: ${data.model} · Service: ${data.service}`, 'ok');
    } catch (e) {
      addToast('Backend Offline', 'Could not reach http://localhost:8000', 'warn');
    }
  };

  const handleValidateDefense = async () => {
    if (!latestRunId) {
      addToast('No Baseline Run', 'Please launch a Red Team campaign first before validating defenses.', 'warn');
      return;
    }
    addToast('Defense Validation', `Replaying baseline exploits from ${latestRunId} against hardened agent…`, 'ok');
    try {
      const resp = await fetch('http://localhost:8000/api/v1/defenses/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseline_run_id: latestRunId,
          defense_profile: {
            name: 'Hardened Apex Defense Profile',
            isolate_untrusted_documents: true,
            strict_tool_authorization: true,
            validate_memory_writes: true,
            transfer_amount_limit: 1000.0,
          },
        }),
      });
      if (!resp.ok) throw new Error(`Server returned HTTP ${resp.status}`);
      const report = await resp.json();
      addToast(
        'Defense Validated!',
        `Replay Block Rate: ${report.exact_replay_blocking_rate}% · Legitimate Controls: ${report.legitimate_task_passed ? 'Retained' : 'Broken'}`,
        'ok'
      );
    } catch (err) {
      addToast('Validation Failed', err.message, 'warn');
    }
  };

  const handlePrimaryAction = (action) => {
    switch (action) {
      case 'launch-campaign':
        setShowLaunchModal(true);
        break;
      case 'register-target':
        setShowRegisterModal(true);
        break;
      case 'replay-latest':
        setDrawerTrace(attackTraces[0]);
        setDrawerStep(null);
        break;
      case 'export-audit':
        addToast('Export queued', 'Permission audit report download started.', 'ok');
        break;
      case 'validate-defense':
        handleValidateDefense();
        break;
      default:
        break;
    }
  };

  const openTraceDrawer = (traceId, step = null) => {
    const found = attackTraces.find((t) => t.trace_id === traceId);
    if (found) {
      setDrawerTrace(found);
      setDrawerStep(step);
    }
  };

  return (
    <div className={`app ${isCollapsed ? 'collapsed' : ''} ${isNavOpen ? 'nav-open' : ''}`} id="app">
      <Sidebar
        activeRoute={route}
        onNavigate={(r) => {
          setRoute(r);
          setIsNavOpen(false);
        }}
        selectedTarget={selectedTarget}
        onSelectTarget={setSelectedTarget}
        targetAgents={targetAgents}
        attackTracesCount={attackTraces.length}
        onOpenRegisterModal={() => setShowRegisterModal(true)}
        onToast={addToast}
      />

      <div className="main">
        <Topbar
          activeRoute={route}
          onNavigate={(r) => {
            setRoute(r);
            setIsNavOpen(false);
          }}
          isOffline={isOffline}
          onToggleOffline={() => {
            setIsOffline((prev) => !prev);
            addToast(
              isOffline ? 'Sandbox reconnected' : 'Agent offline',
              isOffline ? 'Live evaluation streaming again.' : 'Displaying cached run run_0912.',
              isOffline ? 'ok' : 'crit'
            );
          }}
          onToggleNav={() => setIsNavOpen((prev) => !prev)}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          onOpenCommand={() => setShowCommandPalette(true)}
          onPrimaryAction={handlePrimaryAction}
          onToast={addToast}
        />

        <main className="workspace" tabIndex={-1}>
          {isOffline && (
            <div className="banner">
              <span className="banner__txt">
                Agent offline — displaying cached evaluation run <b>run_0912</b>.
              </span>
              <button className="btn btn--secondary btn--sm" onClick={() => setIsOffline(false)}>
                Retry connection
              </button>
            </div>
          )}

          {route === 'overview' && (
            <OverviewView
              overview={mockData.overview}
              activity={mockData.activity}
              targetAgents={targetAgents}
              onNavigate={setRoute}
              onSync={handleSyncSandbox}
              onToast={addToast}
            />
          )}

          {route === 'campaigns' && (
            <CampaignsView
              campaigns={campaigns}
              targetAgents={targetAgents}
              onLaunchCampaign={() => setShowLaunchModal(true)}
              onToast={addToast}
            />
          )}

          {route === 'targets' && (
            <TargetsView
              targetAgents={targetAgents}
              onSelectTarget={setSelectedTarget}
              onLaunchCampaign={() => setShowLaunchModal(true)}
              onToast={addToast}
            />
          )}

          {route === 'traces' && (
            <TracesView
              attackTraces={attackTraces}
              targetAgents={targetAgents}
              selectedTraceId={selectedTraceId}
              onSelectTrace={setSelectedTraceId}
              onOpenTraceDrawer={openTraceDrawer}
            />
          )}

          {route === 'permissions' && (
            <PermissionsView tools={mockData.tools} onToast={addToast} />
          )}

          {route === 'defense' && (
            <DefenseView defense={mockData.defense} onValidateDefense={handleValidateDefense} />
          )}

          {route === 'settings' && (
            <SettingsView
              workspace={mockData.workspace}
              targetAgents={targetAgents}
              apiReference={mockData.api_reference}
              isOffline={isOffline}
              onToggleOffline={() => setIsOffline((prev) => !prev)}
              onToast={addToast}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      {showLaunchModal && (
        <LaunchCampaignModal
          targetAgents={targetAgents}
          onClose={() => setShowLaunchModal(false)}
          onLaunch={handleLaunchCampaign}
          onToast={addToast}
        />
      )}

      {showRegisterModal && (
        <RegisterTargetModal
          tools={mockData.tools}
          onClose={() => setShowRegisterModal(false)}
          onRegister={handleRegisterTarget}
          onToast={addToast}
        />
      )}

      {drawerTrace && (
        <TraceDrawer
          trace={drawerTrace}
          stepIndex={drawerStep}
          targetAgents={targetAgents}
          onClose={() => {
            setDrawerTrace(null);
            setDrawerStep(null);
          }}
          onToast={addToast}
        />
      )}

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(r) => {
          setRoute(r);
          setIsNavOpen(false);
        }}
        onLaunchCampaign={() => setShowLaunchModal(true)}
        onRegisterTarget={() => setShowRegisterModal(true)}
        onSync={handleSyncSandbox}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

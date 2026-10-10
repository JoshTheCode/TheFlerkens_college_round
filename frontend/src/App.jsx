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
  const [route, setRoute] = useState('overview');
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

  const handleLaunchCampaign = (params) => {
    const newCamp = {
      campaign_id: `campaign_${105 + campaigns.length}`,
      name: `${params.strategy} probe suite`,
      target_agent_id: params.target_agent_id,
      strategy: params.strategy,
      status: 'running',
      progress: 5,
      findings: 0,
      severity_max: 'low',
      started_at: 'just now'
    };
    setCampaigns((prev) => [newCamp, ...prev]);
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

  const handleSyncSandbox = () => {
    addToast('Syncing sandbox', 'Collecting latest trace and metric snapshots…', 'ok');
  };

  const handleValidateDefense = () => {
    addToast('Validating defense', '0 regressions detected · legitimate behavior intact.', 'ok');
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

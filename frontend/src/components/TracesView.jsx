import React, { useState } from 'react';
import { Icon } from './Icons';

export function TracesView({
  attackTraces,
  targetAgents,
  selectedTraceId,
  onSelectTrace,
  onOpenTraceDrawer
}) {
  const [filter, setFilter] = useState('all');

  const getAgentName = (id) => {
    const agt = targetAgents.find((a) => a.target_agent_id === id);
    return agt ? agt.name : id;
  };

  const filtered = attackTraces.filter((t) => filter === 'all' || t.severity === filter);
  const activeTrace = attackTraces.find((t) => t.trace_id === selectedTraceId) || attackTraces[0];

  const filters = ['all', 'critical', 'high', 'medium'];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Attack traces</h1>
          <p className="page-sub">
            Reproducible multi-stage exploit chains recorded by the sandbox interceptor.
          </p>
        </div>
      </div>

      <div className="md">
        <div className="stack-gap">
          <section className="card">
            <div className="card__head">
              <div className="card__title">Discovered traces</div>
            </div>
            <div className="card__body" style={{ padding: '12px' }}>
              <div style={{ marginBottom: '10px' }}>
                <div className="seg" role="group" aria-label="Filter by severity">
                  {filters.map((f) => (
                    <button
                      key={f}
                      className={`seg__btn ${filter === f ? 'is-active' : ''}`}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="trace-list">
                {filtered.map((t) => (
                  <button
                    key={t.trace_id}
                    className={`trace-item ${activeTrace?.trace_id === t.trace_id ? 'is-active' : ''}`}
                    onClick={() => onSelectTrace(t.trace_id)}
                  >
                    <div className="trace-item__top">
                      <span className={`badge badge--${t.severity === 'critical' ? 'crit' : t.severity === 'high' ? 'high' : 'warn'}`}>
                        {t.severity.charAt(0).toUpperCase() + t.severity.slice(1)}
                      </span>
                      <span
                        className="score"
                        style={{
                          marginLeft: 'auto',
                          color: t.severity === 'critical' ? '#B42318' : t.severity === 'high' ? '#9A5B09' : '#4B5563'
                        }}
                      >
                        {t.severity_score.toFixed(1)}
                      </span>
                    </div>
                    <div className="trace-item__title">{t.title}</div>
                    <div className="trace-item__meta">
                      <span>{getAgentName(t.target_agent_id)}</span>
                      <span>{t.stage_count} stages</span>
                      <span>{Math.round(t.confidence * 100)}% confidence</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {activeTrace && (
          <section className="card">
            <div className="card__head">
              <div>
                <div className="card__title">{activeTrace.title}</div>
                <div className="card__sub">
                  <span className="mono">{activeTrace.trace_id}</span> · {getAgentName(activeTrace.target_agent_id)} ·{' '}
                  {activeTrace.stage_count} stages · updated {activeTrace.updated_at}
                </div>
              </div>
              <div className="card__actions">
                <span className={`badge badge--${activeTrace.severity === 'critical' ? 'crit' : activeTrace.severity === 'high' ? 'high' : 'warn'}`}>
                  {activeTrace.severity.charAt(0).toUpperCase() + activeTrace.severity.slice(1)}
                </span>
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => onOpenTraceDrawer(activeTrace.trace_id)}
                >
                  <Icon name="file" size="sm" />
                  Full report
                </button>
              </div>
            </div>

            <div className="card__body">
              <div className="timeline">
                {activeTrace.stages.map((stage, i) => (
                  <div key={stage.stage_index} className="tl-step" data-stage={stage.stage}>
                    <div className="tl-step__rail">
                      <span className="tl-step__dot">{stage.stage_index}</span>
                      {i < activeTrace.stages.length - 1 && <span className="tl-step__line"></span>}
                    </div>

                    <button
                      className="tl-card"
                      onClick={() => onOpenTraceDrawer(activeTrace.trace_id, stage.stage_index)}
                      aria-label={`Open details for stage ${stage.stage_index}`}
                    >
                      <div className="tl-card__head">
                        <span className="tl-card__title">{stage.stage_label}</span>
                        {stage.tool_call && (
                          <span className="badge badge--crit badge--plain monofix" style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>
                            tool call
                          </span>
                        )}
                      </div>
                      <div className="tl-card__note">{stage.observation}</div>
                      {stage.tool_call && (
                        <div className="tl-card__peek">{stage.tool_call}</div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

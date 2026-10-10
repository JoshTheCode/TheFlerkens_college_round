export interface ToolDefinition {
  name: string;
  description: string;
  parameters?: Record<string, any>;
  permissions: string[];
}

export interface TargetAgentRegistration {
  name: string;
  description?: string;
  system_prompt: string;
  tools?: ToolDefinition[];
  initial_memory?: string[];
  allowed_domains?: string[];
}

export interface TargetAgent extends TargetAgentRegistration {
  id: string;
  created_at: string;
}

export interface StartAttackRequest {
  target_id: string;
  categories?: ('prompt_injection' | 'memory_poisoning' | 'tool_privilege_escalation' | 'indirect_context_manipulation')[];
  intensity?: 'quick' | 'standard' | 'exhaustive';
  max_steps?: number;
}

export interface AttackRun {
  id: string;
  target_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress_percentage?: number;
  vulnerabilities_found_count?: number;
  created_at: string;
  completed_at?: string | null;
}

export interface AttemptedToolCall {
  tool_name: string;
  arguments: Record<string, any>;
  permission_granted: boolean;
  intercepted_violation: boolean;
}

export interface AttackStep {
  step_number: number;
  adversarial_input: string;
  target_output: string;
  memory_state_before?: string[];
  memory_state_after?: string[];
  tool_calls_attempted: AttemptedToolCall[];
  exploit_successful: boolean;
}

export interface AttackGraphNode {
  id: string;
  label: string;
  type: 'input' | 'instruction' | 'memory' | 'tool' | 'violation';
}

export interface AttackGraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface ExecutionTrace {
  attack_id: string;
  target_id: string;
  vulnerability_type: 'prompt_injection' | 'memory_poisoning' | 'tool_privilege_escalation' | 'indirect_context_manipulation';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reproducibility_seed: number;
  attack_graph_nodes: AttackGraphNode[];
  attack_graph_edges: AttackGraphEdge[];
  steps: AttackStep[];
}

export interface DefenseRule {
  rule_type: 'input_filter' | 'output_guardrail' | 'tool_sandbox_strict';
  pattern_or_policy: string;
}

export interface DefenseProfile {
  name: string;
  rules: DefenseRule[];
}

export interface DefenseValidationRequest {
  target_id: string;
  attack_ids: string[];
  defense_profile: DefenseProfile;
}

export interface DefenseCategoryBreakdown {
  tested: number;
  prevented: number;
  exploit_rate: number;
}

export interface DefenseValidationResult {
  target_id: string;
  baseline_exploit_rate: number;
  mitigated_exploit_rate: number;
  attacks_tested_count: number;
  prevented_attacks_count: number;
  regression_detected: boolean;
  legitimate_functionality_retained_score: number;
  defense_profile_name?: string;
  breakdown_by_category?: Record<string, DefenseCategoryBreakdown>;
}

export interface VulnerabilityDetail {
  id: string;
  title: string;
  category: string;
  severity: string;
  description: string;
  recommendation: string;
}

export interface EvaluationReport {
  attack_id: string;
  target_id: string;
  risk_score: number;
  summary: string;
  vulnerabilities: VulnerabilityDetail[];
}

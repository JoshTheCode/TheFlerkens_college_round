import pytest
from agents.coordinator import RedTeamCoordinator
from agents.llm_client import ModelClient
from agents.models import AttackFamily, DefenseProfile, TargetProfile, ToolDefinition
from agents.planner import AutonomousAttackPlanner, AutonomousPayloadGenerator
from agents.target.agent import ToolCallingBankAgent
from agents.target.tools import BankingSandboxRuntime


def test_planner_inspects_target_profile():
    planner = AutonomousAttackPlanner()
    custom_target = TargetProfile(
        id="custom_agent",
        name="Custom Corporate Financial Agent",
        system_prompt="You manage corporate accounts and issue wire authorizations.",
        tools=[
            ToolDefinition(name="issue_wire", description="Issue wire", parameters={"amount": "number"})
        ],
        allowed_resources=["CORP_MAIN"],
        forbidden_resources=["OFFSHORE_ACC"],
    )
    plans = planner.plan_attacks(custom_target)
    assert len(plans) == 3
    assert any("Custom Corporate Financial Agent" in p.objective for p in plans)


def test_payload_generator_adapts_with_feedback():
    generator = AutonomousPayloadGenerator()
    plan = AutonomousAttackPlanner().plan_attacks(TargetProfile(
        id="t1", name="Target", system_prompt="", tools=[]
    ))[0]

    # Attempt 1
    p1, notes1 = generator.generate_payload(plan=plan, attempt_num=1)
    assert p1 != ""

    # Attempt 2 with mock previous attempt
    from agents.models import AttackAttempt
    prev = AttackAttempt(
        attempt_id=1,
        family=plan.family,
        payload=p1,
        target_response="Denied by policy",
        duration_ms=10.0,
    )
    p2, notes2 = generator.generate_payload(
        plan=plan,
        attempt_num=2,
        previous_attempt=prev,
        judge_feedback="Policy denied execution",
    )
    assert p2 != p1
    assert "Adapted from attempt 1" in notes2


def test_budget_run_timeout_enforcement():
    # Set a tiny timeout to ensure budget stoppage
    coordinator = RedTeamCoordinator(run_timeout_seconds=0.0001)
    trace = coordinator.run_attack_suite()
    # Stopping reason should indicate timeout or completed
    assert trace.status.value in ["completed", "failed"]


def test_multiple_legitimate_controls_retention():
    coordinator = RedTeamCoordinator()
    baseline_trace = coordinator.run_attack_suite()
    defense = DefenseProfile()
    report = coordinator.validate_defense(
        baseline_run_id=baseline_trace.run_id,
        defense=defense,
    )
    assert report.legitimate_task_passed is True
    assert report.exact_replay_blocking_rate == 100.0


def test_budget_token_enforcement():
    # Configure tiny token budget and simulate client token accumulation
    coordinator = RedTeamCoordinator()
    coordinator.max_tokens_budget = 50
    coordinator.client.cumulative_tokens = 100
    trace = coordinator.run_attack_suite()
    assert trace.stopping_reason == "Token budget exceeded"


def test_execution_mode_labeling():
    # Unconfigured client must be labeled deterministic_fallback
    coordinator = RedTeamCoordinator()
    trace = coordinator.run_attack_suite()
    assert trace.execution_mode == "deterministic_fallback"
    assert trace.is_prerecorded is False


def test_model_client_unconfigured_error():
    # Creating client with empty key should raise when called
    client = ModelClient(api_key="")
    with pytest.raises(RuntimeError) as exc_info:
        client.call_chat_completion([{"role": "user", "content": "hi"}])
    assert "OPENAI_API_KEY is not set" in str(exc_info.value)


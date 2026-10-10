"""CLI Demonstration Script for AgentBreak Autonomous AI Red Team.

Usage:
    python -m scripts.run_demo --mode live
    python -m scripts.run_demo --mode deterministic
"""

import argparse
import json
import os
import sys
from typing import Optional

from agents.coordinator import RedTeamCoordinator
from agents.llm_client import ModelClient
from agents.models import AttackFamily, DefenseProfile
from agents.target.agent import ToolCallingBankAgent, get_default_bank_target_profile
from agents.target.tools import BankingSandboxRuntime


def run_vertical_slice_demo(mode: str) -> None:
    print("=" * 70)
    print("   AGENTBREAK: AUTONOMOUS AI RED TEAM DEMONSTRATION")
    print(f"   Mode: {mode.upper()}")
    print("=" * 70)

    # 1. Environment & Mode Verification
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if mode == "live":
        if not api_key:
            print("\n[ERROR] Live mode requested but OPENAI_API_KEY is not set.")
            print("Live model behavior is UNVERIFIED.")
            print("To run live mode, configure OPENAI_API_KEY in your environment or .env file.")
            sys.exit(1)
        client = ModelClient()
        print(f"\n[INFO] Connected to Model Provider: {client.base_url}")
        print(f"[INFO] Active Model: {client.model}")
    else:
        # Deterministic offline demo mode
        client = ModelClient(api_key="")
        print("\n[INFO] Running in deterministic model test double mode (offline / CI safe).")

    coordinator = RedTeamCoordinator(model_client=client, max_attempts=2)

    # 2. Target Profile
    target = get_default_bank_target_profile()
    print("\n--- 1. TARGET PROFILE ---")
    print(f"Target ID: {target.id}")
    print(f"Target Name: {target.name}")
    print(f"System Instructions: {target.system_prompt[:80]}...")
    print(f"Available Tools: {[t.name for t in target.tools]}")
    print(f"Allowed Resources: {target.allowed_resources}")
    print(f"Forbidden Resources: {target.forbidden_resources}")

    # 3. Generate Attack Plan & Execute Single Vertical Slice (Indirect Prompt Injection)
    print("\n--- 2. ATTACK PLANNING & BASELINE RUN ---")
    trace = coordinator.run_attack_suite(
        attack_families=[AttackFamily.INDIRECT_PROMPT_INJECTION]
    )

    plan = trace.plans[0]
    print(f"Attack Plan Family: {plan.family.value}")
    print(f"Attack Objective: {plan.objective}")
    print(f"Expected Severity: {plan.expected_severity.value.upper()}")
    print(f"Success Condition: {plan.success_condition}")

    print("\n--- 3. EXECUTION ATTEMPTS & EVIDENCE ---")
    for att in trace.attempts:
        print(f"\n[Attempt {att.attempt_id}]")
        print(f"Payload: {att.payload}")
        print(f"Adaptation Summary: {att.adaptation_notes or 'Initial attempt'}")
        print(f"Target Response: {att.target_response}")
        print(f"Tools Intercepted: {[t.tool for t in att.tool_calls]}")
        for t in att.tool_calls:
            print(f"  -> {t.tool}(args={t.arguments}) [Rule: {t.policy_rule_id}, Authorized: {t.authorized}]")

    print("\n--- 4. DETERMINISTIC JUDGE VERDICT ---")
    finding = trace.findings[0]
    print(f"Exploit Success: {finding.success}")
    print(f"Finding Severity: {finding.severity.value.upper()}")
    print(f"Policy Rule Evaluated: {finding.policy_rule_id}")
    print(f"Evidence: {finding.evidence}")

    # 4. Exact Defense Replay
    print("\n--- 5. EXACT DEFENSE REPLAY ---")
    defense = DefenseProfile(
        name="Apex Hardened Policy v1",
        isolate_untrusted_documents=True,
        strict_tool_authorization=True,
        validate_memory_writes=True,
    )
    report = coordinator.validate_defense(
        baseline_run_id=trace.run_id,
        defense=defense,
    )
    print(f"Baseline Exploit Replayed: '{trace.attempts[0].payload}'")
    print(f"Exact Replay Blocking Rate: {report.exact_replay_blocking_rate}%")
    print(f"Adaptive Bypass Findings: {report.adaptive_bypass_findings_count}")
    print(f"Adaptive Bypass Rate: {report.adaptive_bypass_rate}%")

    # 5. Legitimate Task Retention
    print("\n--- 6. LEGITIMATE TASK CONTROL ---")
    print(f"Balance & Permitted Operations Succeeded: {report.legitimate_task_passed}")

    # 6. Final Summary
    print("\n--- 7. FINAL SUMMARY & BUDGETS ---")
    print(f"Run ID: {trace.run_id}")
    print(f"Execution Mode: {trace.execution_mode}")
    print(f"Total Tokens Used: {trace.total_tokens_used}")
    print(f"Stopping Reason: {trace.stopping_reason}")
    print(f"Status: {report.status}")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Run AgentBreak Red Team Demonstration")
    parser.add_argument(
        "--mode",
        choices=["live", "deterministic"],
        default="deterministic",
        help="Run mode: 'live' (requires OPENAI_API_KEY) or 'deterministic' (offline)",
    )
    args = parser.parse_args()
    run_vertical_slice_demo(mode=args.mode)


if __name__ == "__main__":
    main()

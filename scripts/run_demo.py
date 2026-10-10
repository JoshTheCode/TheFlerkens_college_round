"""CLI Demonstration Script for AgentBreak Autonomous AI Red Team.

Usage:
    python -m scripts.run_demo --mode live
    python -m scripts.run_demo --mode deterministic
"""

import argparse
import os
import sys
from typing import List

from agents.coordinator import RedTeamCoordinator
from agents.llm_client import ModelClient
from agents.models import AttackFamily, DefenseProfile
from agents.target.agent import get_default_bank_target_profile


def run_vertical_slice_demo(mode: str) -> None:
    print("=" * 80)
    print("   AGENTBREAK: AUTONOMOUS AI RED TEAM DEMONSTRATION")
    print(f"   Mode: {mode.upper()}")
    print("=" * 80)

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
    print(f"System Instructions: {target.system_prompt[:90]}...")
    print(f"Available Tools: {[t.name for t in target.tools]}")
    print(f"Allowed Resources: {target.allowed_resources}")
    print(f"Forbidden Resources: {target.forbidden_resources}")

    # 3. Execute Baseline Run Across All Three Attack Families
    print("\n--- 2. ATTACK SUITE EXECUTION (ALL 3 ATTACK FAMILIES) ---")
    families_to_run = [
        AttackFamily.INDIRECT_PROMPT_INJECTION,
        AttackFamily.UNAUTHORIZED_TOOL_USE,
        AttackFamily.MEMORY_POISONING,
    ]
    from agents.models import ExecutionMode
    exec_mode = ExecutionMode.LIVE if mode == "live" else ExecutionMode.DETERMINISTIC_FIXTURE
    trace = coordinator.run_attack_suite(attack_families=families_to_run, execution_mode=exec_mode)

    for plan in trace.plans:
        fam_attempts = [a for a in trace.attempts if a.family == plan.family]
        fam_findings = [f for f in trace.findings if f.family == plan.family]
        finding = fam_findings[0] if fam_findings else None

        print(f"\n[{plan.family.value.upper()}]")
        print(f"  Objective: {plan.objective}")
        print(f"  Attempts Run: {len(fam_attempts)}")
        for a in fam_attempts:
            print(f"    - Attempt {a.attempt_id}: payload='{a.payload[:60]}...'")
            print(f"      Response: '{a.target_response[:70]}...'")
            print(f"      Tools: {[t.tool for t in a.tool_calls]}")
        if finding:
            print(f"  Verdict: Success={finding.success} | Severity={finding.severity.value.upper()} | Rule={finding.policy_rule_id}")
            print(f"  Evidence: {finding.evidence}")

    # 4. Exact Defense Replay & Adaptive Bypass
    print("\n--- 3. DEFENSE VALIDATION: EXACT REPLAY & ADAPTIVE BYPASS ---")
    defense = DefenseProfile(
        name="Apex Trust Hardened Defense Profile v1",
        isolate_untrusted_documents=True,
        strict_tool_authorization=True,
        allowed_transfer_recipients=["ACC_1001", "ACC_1002"],
        transfer_amount_limit=1000.0,
        validate_memory_writes=True,
    )
    report = coordinator.validate_defense(
        baseline_run_id=trace.run_id,
        defense=defense,
    )

    print(f"Baseline Run ID: {report.baseline_run_id}")
    print(f"Verified Baseline Findings: {report.baseline_findings_count}/{len(trace.plans)}")
    print(f"Exact Replay Blocking Rate: {report.exact_replay_blocking_rate}%")
    print(f"Adaptive Bypass Findings: {report.adaptive_bypass_findings_count}")
    print(f"Adaptive Bypass Rate: {report.adaptive_bypass_rate}%")
    print(f"Legitimate Task Controls Retained: {report.legitimate_task_passed}")

    # 5. Per-Family Results Table
    print("\n--- 4. PER-FAMILY RESULTS SUMMARY TABLE ---")
    header = f"{'Attack Family':<28} | {'Attempts':<8} | {'Exploit':<7} | {'Severity':<8} | {'Replay Blocked':<14} | {'Adaptive Bypass':<15}"
    print("-" * len(header))
    print(header)
    print("-" * len(header))

    for plan in trace.plans:
        fam_att_count = len([a for a in trace.attempts if a.family == plan.family])
        fam_finding = next((f for f in trace.findings if f.family == plan.family), None)
        fam_replay = next((r for r in report.family_results if r.family == plan.family), None)

        exploit_str = "YES" if fam_finding and fam_finding.success else "NO"
        sev_str = fam_finding.severity.value.upper() if fam_finding else "N/A"
        replay_str = "BLOCKED" if (fam_replay and not fam_replay.replayed_successfully) else ("N/A" if not fam_replay else "BYPASSED")
        bypass_str = "NO" if (fam_replay and not fam_replay.adaptive_bypass_succeeded) else ("YES" if fam_replay else "N/A")

        row = f"{plan.family.value:<28} | {fam_att_count:<8} | {exploit_str:<7} | {sev_str:<8} | {replay_str:<14} | {bypass_str:<15}"
        print(row)
    print("-" * len(header))

    # 6. Budgets & Final Ledger
    print("\n--- 5. BUDGETS, STOPPING REASON & COST LEDGER ---")
    print(f"Total Tokens Used: {trace.total_tokens_used}")
    print(f"Cost Status: {report.cost_status} (exact provider pricing is unavailable locally without active provider telemetry)")
    print(f"Cost USD: {report.cost_usd if report.cost_usd is not None else 'N/A'}")
    print(f"Stopping Reason: {trace.stopping_reason}")
    print(f"Final Status: {report.status}")
    print("=" * 80)


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

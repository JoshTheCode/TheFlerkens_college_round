# AgentBreak — Autonomous AI Red Team

> **BnB Hackathon 2026** | Team **The Flerkens** (College Round FRCRCE)  
> Automated security probing, exploit trace reconstruction, and defense validation for agentic AI systems.
>
> [![CI](https://github.com/JoshTheCode/TheFlerkens_college_round/actions/workflows/ci.yml/badge.svg)](https://github.com/JoshTheCode/TheFlerkens_college_round/actions/workflows/ci.yml)
> [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
> [![Python Tests](https://img.shields.io/badge/Python%20Tests-28%2F28%20Passing-brightgreen.svg)]()
> [![Node Tests](https://img.shields.io/badge/Node%20Tests-5%2F5%20Passing-brightgreen.svg)]()
> [![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1%20Compliant-blue.svg)](./api/openapi.json)

---

## 🎯 The Judging Narrative: Attack → Evidence → Defense → Adaptive Bypass

Traditional LLM testing relies on static prompt evaluations. As AI agents gain autonomous tool access, persistent memory, and document retrieval, attackers exploit execution side-effects.

**AgentBreak demonstrates a complete, evidence-backed security lifecycle:**
1. **Discover**: Autonomous attack planner inspects the target agent's system prompt and tool definitions to identify threat vectors across three attack families:
   - **Indirect Prompt Injection**: Malicious instructions embedded within retrieved documents.
   - **Unauthorized Tool Use**: Social engineering the agent to invoke restricted tools and leak sensitive flags.
   - **Memory Poisoning**: Injecting persistent state overrides into session memory.
2. **Preserve**: Records full execution traces including exact prompt payloads, step-by-step tool calls with arguments, before/after memory diffs, and duration.
3. **Judge**: Deterministic security judge evaluates evidence against strict policy rules.
4. **Defend & Replay**: Applies defense profiles (document isolation, tool sandboxing, memory schema validation) and deterministically replays baseline exploits to verify neutralization.
5. **Adaptive Bypass**: Executes an adaptive bypass attempt incorporating past failure feedback to probe defense robustness.

---

## 💡 Why AgentBreak is Different

| Dimension | Typical LLM Red-Teaming | AgentBreak Autonomous Platform |
| :--- | :--- | :--- |
| **Evidence Basis** | Subjective LLM-as-a-judge scores | **Deterministic runtime evidence** (exact intercepted tool parameters, memory diffs, leaked secrets) |
| **Audit Fidelity** | Ephemeral chat transcripts | **Immutable execution traces** with full payload reproduction, tool call histories, and timing |
| **Defense Verification** | Theoretical prompt updates | **Exact exploit replay** re-running past breaches in isolated hardened sandboxes |
| **Evasion Testing** | Single-shot tests | **Adaptive bypass evaluation** using past judge failure feedback to simulate evolving attackers |
| **Utility Preservation** | Defenses often break agents | **Legitimate control retention** proving hardened guardrails do not disrupt legitimate workflows |

---

## ⏱️ Three-Minute Judge Demo Sequence

- **Minute 1: Target Inspection & Attack Launch (Step 1)**
  - Open `http://localhost:5173`.
  - Review the default **Retail Banking Assistant** victim profile, its privileged tools (`transfer_funds`, `read_customer_record`, `save_session_note`), and target system prompt.
  - Keep the default **Deterministic Sandbox** mode (or toggle Live Model with your API key).
  - Click **Launch Red-Team Attack Suite** — observe the streaming hacker terminal console tracing the orchestrator's decision loop in real-time.
- **Minute 2: Exploit Inspection & Visual Attack-Path (Step 2)**
  - Review the **3 of 3 Attack Vectors Exploited** banner.
  - Select each finding to view the **Multi-Turn Attack Path Analysis**:
    `Adversarial Input → Retrieved Untrusted Content → Agent Decision → Restricted Tool Call → Verified Policy Violation`
  - Inspect the concrete evidence: unauthorized wire transfer to `ATTACKER_ACCOUNT`, exfiltrated KYC secrets, and poisoned session memory.
- **Minute 3: Defense Validation & Regression Proof (Step 3)**
  - Click **Proceed to Step 3: Defense Validation**.
  - Review the **Hardened Defense Verification Flow**:
    `Same Exploit Replay → Guardrail Enforced → Blocked Tool Call → No Policy Violation`
  - Review the **Per-Family Mitigation Ledger**:
    - **100% Exact Replay Blocking Rate** (all 3 baseline exploits neutralized).
    - **0% Adaptive Bypass Rate** (hardened defenses held against adaptive attempts).
    - **Legitimate Utility Preserved** (routine balance queries continue working without false positives).
  - Click **Export Audit Report (JSON)** to download the audit certificate.

---

## 🏛️ System Architecture

AgentBreak is built around a canonical Python FastAPI engine with an interactive React dashboard:

```text
Target Agent Profile (Banking / Healthcare / E-Commerce)
        │
        ▼
Autonomous Attack Planner (Live LLM or Verified Fixture)
        │
        ▼
Adaptive Payload Generator <─── Judge Failure Feedback
        │
        ▼
Tool-Calling Target Agent in Isolated Sandbox
        │
        ├── ToolCallInterceptor (Tracks arguments & secrets)
        └── MemoryAuditor (Calculates before/after diffs)
        │
        ▼
Deterministic Security Judge (Rule-based evaluation)
        │
        ├──▶ Exact Defense Replay (Proves baseline is blocked)
        └──▶ Adaptive Bypass Attempt (Tests defense resilience)
```

| Subsystem | Directory | Tech Stack | Status / Role |
| :--- | :--- | :--- | :--- |
| **Security Dashboard** | `/frontend` | React, Vite, Tailwind/Lucide | Canonical UI on `:5173` |
| **Red Team Engine & API** | `/api`, `/agents` | Python 3.9+, FastAPI, Pydantic | Canonical Service on `:8000` |
| **OpenAPI Contract** | `/api/openapi.json` | OpenAPI 3.1.0 | 9 endpoints, 21 schemas |
| **Node Reference Sandbox** | `/backend` | Node.js, Express, TypeScript | Isolated sandbox reference (5/5 unit tests) |

---

## 🚀 Quickstart Guide

### 1. Launch the Canonical Python API Backend
```bash
# Set up virtual environment
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.lock

# Run the 28-test canonical suite
pytest -v tests/

# Start the API server on port 8000
uvicorn api.app:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Launch the Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser to access the interactive dashboard.

### 3. Optional: Run the Companion Node.js Reference Tests
```bash
cd backend
npm install
npm test    # Runs 5/5 isolated TypeScript sandbox tests
```

---

## ⚙️ Execution Modes

| Mode | Trigger | Description |
| :--- | :--- | :--- |
| **Deterministic Fixture** (Default) | No API key required | Zero-dependency, 100% reproducible benchmark suite for judging evaluation. Runs pre-verified attack and defense traces offline. |
| **Live Model Execution** | Enter OpenRouter / OpenAI API Key | Real-time autonomous planning and adaptive payload generation via live LLM (GPT-4o, Claude 3.5 Sonnet, Gemini Flash). Hard execution timeouts (60s) and token budgets enforced. |

---

## 📡 API Contract (OpenAPI 3.1)

Canonical API specification is defined in [`api/openapi.json`](./api/openapi.json). Validated via `python scripts/validate_openapi.py`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health check and provider connectivity status |
| `GET` | `/api/v1/targets/default` | Default vulnerable Retail Banking agent profile |
| `GET` | `/api/v1/targets` | List all registered target profiles |
| `GET` | `/api/v1/targets/{target_id}` | Retrieve specific target profile details |
| `POST` | `/api/v1/attacks/start` | Launch autonomous red-team attack run |
| `GET` | `/api/v1/attacks/logs` | Real-time streaming log telemetry |
| `GET` | `/api/v1/attacks/{run_id}` | Retrieve attack status summary |
| `GET` | `/api/v1/attacks/{run_id}/trace` | Retrieve full deterministic execution trace |
| `POST` | `/api/v1/defenses/validate` | Replay baseline exploits against hardened defense profile |

---

## 🧪 Verification & Test Suite

All tests run cleanly in offline CI environments:
- **Canonical Python Tests**: `pytest -v tests/` → **28/28 passed**
- **Contract Schema Validation**: `python scripts/validate_openapi.py` → **100% valid**
- **Node Sandbox Unit Tests**: `npm test --prefix backend` → **5/5 passed**
- **Frontend Production Build**: `npm run build --prefix frontend` → **Built with zero errors**

---

## 👥 Team & Responsibilities (The Flerkens)

- **AI/ML & Attack Engine**: Autonomous planner, adaptive payload generation, LLM client orchestration, model alignment handling.
- **Security Sandboxing & Judge**: ToolCallInterceptor, MemoryAuditor, rule-based SecurityJudge, and defense replay engine.
- **Backend & OpenAPI Architecture**: FastAPI service, OpenAPI 3.1 schema specification, route serialization, and telemetry streaming.
- **Frontend Experience**: React security dashboard, attack family configuration, trace visualization, and real-time execution modal.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

# Antigravity Repository Support & Harness

This repository is configured for **Antigravity**. Customizations, skills, and lifecycle hooks live inside `.agents/`.

## Repository Structure

- **Skills**: [`skills/`](./skills) - Repository-scoped skills (e.g. `bb-plan`, `bb-cook`, `bb-fix`, `bb-brainstorm`, `gpt-taste`, `code-review`, etc.).
- **Hooks Configuration**: [`hooks.json`](./hooks.json) - Defines lifecycle hooks for Antigravity (`PreInvocation`, `PreToolUse`, `PostToolUse`, `Stop`).
- **Hook Scripts**: [`hooks/`](./hooks) - Python handlers implementing repository context, privacy guards, quality checks, tool usage metrics, and lifecycle state persistence.

## Configured Hooks

1. **`PreInvocation`**: Injects repository context (`AGENTS.md` guidelines, language preferences, previous turn state, context compaction warnings).
2. **`PreToolUse`**: 
   - `privacy_guard.py`: Blocks direct access or execution referencing sensitive files (`.env`, credentials, SSH keys).
   - `tool_counter.py`: Tracks local tool invocation count for context pressure alerts.
3. **`PostToolUse`**: 
   - `quality_check.py`: Runs bounded syntax checks (Python `py_compile`), TypeScript typechecks (`npm run typecheck`), and optional test suites after code edits.
4. **`Stop`**: 
   - `lifecycle_state.py`: Persists lightweight state when the agent loop terminates.

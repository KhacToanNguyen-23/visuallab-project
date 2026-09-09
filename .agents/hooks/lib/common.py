"""Shared helpers for repository-local Antigravity hooks."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


def read_payload() -> dict[str, Any]:
    try:
        value = json.load(sys.stdin)
        return value if isinstance(value, dict) else {}
    except Exception:
        return {}


def project_root(cwd: str | None = None, payload: dict[str, Any] | None = None) -> Path:
    if payload and isinstance(payload.get("workspacePaths"), list) and payload["workspacePaths"]:
        first_path = Path(payload["workspacePaths"][0]).resolve()
        if first_path.exists():
            return first_path

    start = Path(cwd or os.getcwd()).resolve()
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            cwd=start,
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
        if result.returncode == 0 and result.stdout.strip():
            return Path(result.stdout.strip()).resolve()
    except Exception:
        pass

    for candidate in (start, *start.parents):
        if (candidate / ".git").exists() or (candidate / ".agents").exists():
            return candidate
    return start


def load_config(root: Path) -> dict[str, Any]:
    path = root / ".ck.json"
    try:
        value = json.loads(path.read_text(encoding="utf-8-sig"))
        return value if isinstance(value, dict) else {}
    except Exception:
        return {}


def state_dir(root: Path) -> Path:
    path = root / ".agents" / "session-data"
    path.mkdir(parents=True, exist_ok=True)
    return path


def emit(value: dict[str, Any]) -> None:
    print(json.dumps(value, ensure_ascii=False))


def additional_context(message: str) -> None:
    """Inject context via ephemeral message step for Antigravity."""
    emit({
        "injectSteps": [
            {
                "ephemeralMessage": message
            }
        ]
    })


_PATCH_PATH_RE = re.compile(r"^\*\*\* (?:Add|Update|Delete) File:\s*(.+?)\s*$", re.MULTILINE)


def get_tool_call_info(payload: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    """Extract tool name and args supporting both Antigravity (toolCall) and Codex (tool_name, tool_input)."""
    tool_call = payload.get("toolCall")
    if isinstance(tool_call, dict):
        name = str(tool_call.get("name") or "")
        args = tool_call.get("args") if isinstance(tool_call.get("args"), dict) else {}
        return name, args
    name = str(payload.get("tool_name") or "")
    args = payload.get("tool_input") if isinstance(payload.get("tool_input"), dict) else {}
    return name, args


def touched_paths(payload: dict[str, Any]) -> list[Path]:
    name, args = get_tool_call_info(payload)
    raw_paths: list[str] = []

    for key in ("TargetFile", "AbsolutePath", "file_path", "path"):
        value = args.get(key)
        if isinstance(value, str) and value.strip():
            raw_paths.append(value.strip())

    for cmd_key in ("CommandLine", "command"):
        cmd_val = args.get(cmd_key)
        if isinstance(cmd_val, str):
            raw_paths.extend(match.strip() for match in _PATCH_PATH_RE.findall(cmd_val))

    root = project_root(payload.get("cwd"), payload)
    result: list[Path] = []
    seen: set[str] = set()
    for raw in raw_paths:
        candidate = Path(raw)
        if not candidate.is_absolute():
            candidate = root / candidate
        normalized = str(candidate.resolve(strict=False)).lower()
        if normalized not in seen:
            seen.add(normalized)
            result.append(candidate)
    return result

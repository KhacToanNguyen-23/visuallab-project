"""Persist lightweight Antigravity lifecycle state."""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "lib"))
from common import load_config, project_root, read_payload, state_dir


def purge_old_files(directory: Path, max_age_days: int) -> None:
    cutoff = time.time() - max(max_age_days, 1) * 86400
    for path in directory.iterdir():
        try:
            if path.is_file() and path.stat().st_mtime < cutoff:
                path.unlink()
        except OSError:
            continue


def main() -> None:
    payload = read_payload()
    root = project_root(payload.get("cwd"), payload)
    directory = state_dir(root)
    config = load_config(root)

    purge_old_files(directory, int(config.get("compactDay", 3)))
    session_id = str(payload.get("conversationId") or payload.get("session_id") or "default")

    state = {
        "event": "Stop",
        "conversationId": session_id,
        "cwd": str(root),
        "transcript_path": payload.get("transcriptPath") or payload.get("transcript_path"),
        "saved_at": int(time.time()),
    }
    (directory / "last-state.md").write_text(json.dumps(state, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        sys.exit(0)

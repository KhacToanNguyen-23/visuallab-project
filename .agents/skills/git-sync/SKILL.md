---
name: git-sync
description: "Git workflow manager for pulling, committing, and pushing code to GitHub repositories. Enforces Conventional Commits with concise, clear, and complete commit messages. Trigger when the user mentions git actions like 'push code', 'pull code', 'commit code', 'git push', 'git pull', 'tạo commit', 'đồng bộ repo', 'gửi code lên github', or asks for help managing git commits and sync."
---

# Git Sync — Smart Git Workflow & Conventional Commit Skill

Automates `git pull`, `git add`, `git commit`, and `git push` while maintaining strict commit quality, branch safety, and repository integrity.

---

## 🛠️ Modes & Commands

### 1. Commit Only (`--commit` or "commit code", "tạo commit")
Inspects modified and untracked files, generates a Conventional Commit message, stages files, and commits locally.

### 2. Pull (`--pull` or "pull code", "lấy code mới")
Safely pulls latest changes from remote. Stashes local modifications if working tree is dirty to prevent merge conflicts.

### 3. Push (`--push` or "push code", "đẩy code")
Pushes local commits to remote branch (`git push origin <current-branch>`).

### 4. Full Sync (`--sync` or default when requested)
Executes end-to-end sync: Status check → Stash (if dirty) & Pull → Stage → Commit → Push.

---

## 📜 Commit Message Guidelines

Messages MUST be clear, complete, and concise, adhering to the **Conventional Commits** specification:

### Format
```text
<type>(<scope>): <summary ngắn gọn, rõ ràng>

- <Chi tiết thay đổi 1>
- <Chi tiết thay đổi 2>
```

### Allowed Types
- **`feat`**: Tính năng mới hoặc bài lab / simulation mới.
- **`fix`**: Sửa lỗi bug, hiển thị sai, state hỏng, API backend/frontend.
- **`refactor`**: Cấu trúc lại code mà không thay đổi chức năng.
- **`docs`**: Cập nhật tài liệu, README, spec, plan.
- **`style`**: Sửa giao diện CSS, UI alignment, formatting.
- **`perf`**: Tối ưu hiệu năng rendering, FPS canvas, memory leak.
- **`test`**: Thêm/sửa unit test hoặc integration test.
- **`chore`**: Cấu hình package, build script, file .gitignore.

### Scope Rules
- Scopes represent components, modules, or features (e.g., `auth`, `phet-spring`, `emf-lab`, `class-management`, `api`).
- Omit scope if changes cross too many boundaries.

### Examples
**Good:**
```text
feat(phet-spring): thêm phòng thí nghiệm con lắc lò xo Hooke's Law 60FPS

- Tích hợp động cơ vật lý RK4 giải phương trình vi phân $m\ddot{x} + c\dot{x} + kx = mg$
- Thiết kế giao diện 6 tab PhET chuẩn với thước đo, đồng hồ bấm giờ và bảng số liệu
```

**Bad (Bị cấm):**
- `update code`
- `fix bug`
- `commit new changes`

---

## 🔒 Safety & Execution Workflow

### Step 1: Status Inspection
Run `git status -sb` and `git diff --stat` to evaluate working tree state and branch name.

### Step 2: Safe Pull (if pulling or syncing)
1. Check if uncommitted changes exist.
2. If dirty: `git stash save "temp-sync-stash"`
3. Pull rebase: `git pull --rebase origin <current-branch>`
4. Restore changes: `git stash pop` (if stashed).

### Step 3: Staging & Committing
1. Stage modified files: `git add .` (or specific target files if requested).
2. Generate commit message based on inspect diff.
3. Run `git commit -m "<header>" -m "<body>"`.

### Step 4: Pushing (WITH USER CONFIRMATION CONSTRAINT)
- ALWAYS verify user constraints regarding auto-push before calling `git push origin <branch>`.
- If user requested push explicitly (or approved), execute: `git push origin <branch>`.

---

## 💡 Quick Rules
- **No force push**: NEVER run `git push --force` or `-f` unless explicitly commanded by user.
- **No loss of changes**: ALWAYS stash dirty state before pulling.
- **Concise body**: Keep summary line $\le 72$ chars; body points $\le 3$ key bullets.

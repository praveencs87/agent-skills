Automate git commits with meaningful messages.

## Steps
1. Use `git.status` to check what files have changed
2. Use `git.diff` to see the actual changes
3. Generate a concise, conventional commit message based on the changes
4. Use `cmd.run` to execute:
   - `git add .` (or specific files if the user specifies)
   - `git commit -m "<generated message>"`

## Commit Message Format
Use conventional commits format:
- `feat: <description>` — New feature
- `fix: <description>` — Bug fix
- `docs: <description>` — Documentation changes
- `refactor: <description>` — Code refactoring
- `chore: <description>` — Maintenance tasks
- `style: <description>` — Formatting changes

If the user provides a custom message, use that instead.
Ask the user to confirm the commit message before executing.

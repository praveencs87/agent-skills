<p align="center">
  <h1 align="center">🧠 Agent Skill Hub</h1>
  <p align="center">
    The official skill registry for <a href="https://github.com/praveencs87/agent"><b>@praveencs/agent</b></a><br/>
    Community-built skills for AI-powered automation
  </p>
  <p align="center">
    <a href="https://github.com/praveencs87/agent-skills"><img src="https://img.shields.io/badge/skills-16-blueviolet" alt="Skills"></a>
    <a href="https://github.com/praveencs87/agent"><img src="https://img.shields.io/badge/agent-v0.1.0-blue" alt="Agent"></a>
    <a href="https://github.com/praveencs87/agent-skills/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
  </p>
</p>

---

## Installation

### Using Agent CLI
```bash
agent skills install <skill-name>
```

### Manual Installation
```bash
git clone https://github.com/praveencs87/agent-skills.git
cp -r agent-skills/skills/<skill-name> .agent/skills/
```

---

## 📋 Table of Contents

- [Coding & IDEs](#coding--ides)
- [Git & Version Control](#git--version-control)
- [DevOps & Cloud](#devops--cloud)
- [Communication](#communication)
- [Productivity](#productivity)
- [Search & Research](#search--research)
- [CLI Utilities](#cli-utilities)
- [Data & Analytics](#data--analytics)
- [Browser & Automation](#browser--automation)

---

## Coding & IDEs

| Skill | Description | Tools |
|-------|-------------|-------|
| [open-vscode](skills/open-vscode/) | Opens VS Code in the current or specified directory | `cmd.run` |
| [project-scaffold](skills/project-scaffold/) | Scaffold new projects (Node.js, Python, React, Next.js, Express) | `cmd.run`, `fs.write` |
| [npm-publish](skills/npm-publish/) | Prepare and publish npm packages with version bumping | `cmd.run`, `fs.read`, `fs.write` |
| [code-review](skills/code-review/) | Review code changes for bugs, security issues, and best practices | `cmd.run`, `git.diff`, `fs.read` |

## Git & Version Control

| Skill | Description | Tools |
|-------|-------------|-------|
| [git-commit](skills/git-commit/) | Stages changes and creates conventional git commits | `cmd.run`, `git.status`, `git.diff` |

## DevOps & Cloud

| Skill | Description | Tools |
|-------|-------------|-------|
| [docker-deploy](skills/docker-deploy/) | Build, run, and manage Docker containers and compose stacks | `cmd.run` |
| [system-monitor](skills/system-monitor/) | Monitor system resources — CPU, memory, disk, processes | `cmd.run` |
| [log-analyzer](skills/log-analyzer/) | Analyze log files — find errors, patterns, and anomalies | `cmd.run`, `fs.read` |

## Communication

| Skill | Description | Tools |
|-------|-------------|-------|
| [send-email](skills/send-email/) | Sends emails using nodemailer via SMTP | `cmd.run` |

## Productivity

| Skill | Description | Tools |
|-------|-------------|-------|
| [create-note](skills/create-note/) | Creates formatted markdown notes and saves them as files | `fs.write` |

## Search & Research

| Skill | Description | Tools |
|-------|-------------|-------|
| [web-search](skills/web-search/) | Search the web using curl and extract relevant information | `cmd.run` |

## CLI Utilities

| Skill | Description | Tools |
|-------|-------------|-------|
| [file-organizer](skills/file-organizer/) | Organizes files by type, date, or custom rules | `cmd.run`, `fs.read`, `fs.write` |
| [backup](skills/backup/) | Backup files and directories using tar, rsync, or zip | `cmd.run` |
| [cron-scheduler](skills/cron-scheduler/) | Manage cron jobs — create, list, edit, delete | `cmd.run` |

## Data & Analytics

| Skill | Description | Tools |
|-------|-------------|-------|
| [db-query](skills/db-query/) | Query databases — SQLite, PostgreSQL, MySQL via CLI | `cmd.run` |

## Browser & Automation

| Skill | Description | Tools |
|-------|-------------|-------|
| [api-tester](skills/api-tester/) | Test REST APIs with curl — GET, POST, PUT, DELETE | `cmd.run` |

---

## 🛠️ Creating a Skill

Each skill is a folder containing:

```
my-skill/
├── skill.json     # Manifest (name, description, tools, permissions)
└── prompt.md      # Instructions for the AI agent
```

### `skill.json` Example
```json
{
  "name": "my-skill",
  "version": "1.0.0",
  "description": "What this skill does",
  "tools": ["cmd.run"],
  "permissions": {
    "required": ["exec"]
  },
  "entrypoint": "prompt.md",
  "state": "approved"
}
```

### `prompt.md` Example
```markdown
Describe what the agent should do when this skill is invoked.
Include specific commands, parameters, and expected outputs.
```

---

## 🤝 Contributing

1. Fork this repository
2. Create your skill folder under `skills/`
3. Add `skill.json` and `prompt.md`
4. Add your skill to `registry.json`
5. Submit a Pull Request

### Guidelines
- Skills should be focused and single-purpose
- Include clear instructions in `prompt.md`
- Specify minimum required permissions
- Test your skill with `agent run --skill <name> "<goal>"`

---

## License

MIT © [praveencs](https://github.com/praveencs87)

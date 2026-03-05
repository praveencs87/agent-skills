<p align="center">
  <h1 align="center">📦 Agent Hub</h1>
  <p align="center">
    The official Plugin and Skill registry for <a href="https://github.com/praveencs87/agent"><b>@praveencs/agent</b></a><br/>
    Community-built plugins and skills for AI-powered automation
  </p>
  <p align="center">
    <a href="https://github.com/praveencs87/agent-skills"><img src="https://img.shields.io/badge/skills-16-blueviolet" alt="Skills"></a>
    <a href="https://github.com/praveencs87/agent"><img src="https://img.shields.io/badge/agent-v0.1.0-blue" alt="Agent"></a>
    <a href="https://github.com/praveencs87/agent-skills/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
  </p>
</p>

---

## Installation

### Installing Plugins
```bash
agent plugins install <plugin-name>
# Example: 
agent plugins install github
```

### Installing Skills
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

- [Plugins](#plugins)
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

## Plugins

Plugins are full-capability bundles that provide native Node.js tools, hooks, scripts, and skills in a single standalone package.

| Plugin | Description | Capabilities |
|--------|-------------|--------------|
| [github](plugins/github/) | Manage repos, PRs, issues, and CI/CD workflows on GitHub. | `tools/github.js`, `skills/github-manager.md` |
| [slack](plugins/slack/) | Send messages, manage channels, search history, and upload files to Slack. | `tools/slack.js`, `skills/slack-manager.md` |
| [notion](plugins/notion/) | Create/manage Notion pages, databases, blocks, and search workspace. | `tools/notion.js`, `skills/notion-manager.md` |
| [vercel](plugins/vercel/) | Deploy projects, manage domains, and configure env vars on Vercel. | `tools/vercel.js`, `skills/vercel-manager.md` |
| [supabase](plugins/supabase/) | Query Postgres, manage auth users, and use storage on Supabase. | `tools/supabase.js`, `skills/supabase-manager.md` |
| [stripe](plugins/stripe/) | Manage customers, subscriptions, checkout sessions, and refunds on Stripe. | `tools/stripe.js`, `skills/stripe-manager.md` |
| [aws](plugins/aws/) | Manage S3 buckets, Lambda functions, EC2 instances, and CloudWatch logs. | `tools/aws.js`, `skills/aws-manager.md` |
| [discord](plugins/discord/) | Send messages, manage channels and roles, use webhooks on Discord. | `tools/discord.js`, `skills/discord-manager.md` |
| [openai](plugins/openai/) | Direct GPT chat, DALL-E image gen, Whisper transcription, TTS, and embeddings. | `tools/openai.js`, `skills/openai-manager.md` |
| [linear](plugins/linear/) | Manage issues, projects, teams, and cycles on Linear. | `tools/linear.js`, `skills/linear-manager.md` |
| [docker](plugins/docker/) | Build images, run containers, manage compose stacks on Docker. | `tools/docker.js`, `skills/docker-manager.md` |
| [mongodb](plugins/mongodb/) | Query, insert, update, and aggregate data on MongoDB Atlas. | `tools/mongodb.js`, `skills/mongodb-manager.md` |
| [firebase](plugins/firebase/) | Manage Firestore docs, Auth users, and Cloud Storage on Firebase. | `tools/firebase.js`, `skills/firebase-manager.md` |
| [telegram](plugins/telegram/) | Send messages, photos, polls, and manage groups via Telegram bots. | `tools/telegram.js`, `skills/telegram-manager.md` |
| [huggingface](plugins/huggingface/) | Run ML inference and search the Hugging Face model hub. | `tools/huggingface.js`, `skills/huggingface-manager.md` |
| [resend](plugins/resend/) | Send transactional emails and manage domains via Resend. | `tools/resend.js`, `skills/resend-manager.md` |

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

# Docker Manager

## Description
This skill enables you to manage Docker containers, images, volumes, and compose stacks.

## Instructions
1. Use `action: "ps"` to list running containers. Add `all: true` to include stopped ones.
2. To run a container: `action: "run"` with `image`, optional `name`, `ports` (e.g., `["8080:80"]`), `env_vars`, and `volumes`.
3. For Docker Compose, use `compose_up` / `compose_down` with `cwd` pointing to the directory containing `docker-compose.yml`.
4. To view container logs: `action: "logs"` with `container` name/ID and optional `tail` (lines).
5. To execute a command inside a running container: `action: "exec"` with `container` and `command`.
6. Docker must be installed and the daemon running. Verify with `docker info`.

## Input Variables
{{input}}

# GitHub Manager

## Description
This skill grants you the ability to interact with the GitHub API to manage repositories, search code globally, execute CI/CD workflows, and handle pull requests or issues.

## Instructions
1. When asked to perform GitHub operations, identify the appropriate `action` from the `github` tool.
2. Ensure you have the required parameters (`owner`, `repo`) extracted from the user's prompt or context.
3. If searching for code across a repository, construct advanced search queries. For example, to find usages of `express` in `praveencs87/agent`, use: `action: "search_code", query: "express repo:praveencs87/agent"`.
4. To dispatch a GitHub Action workflow, use `dispatch_workflow` and specify the `workflow_id` (either the numeric ID or the filename like `build.yml`). You can pass custom inputs if required.
5. If the user asks you to list or manage repos, issues, or PRs, fill out the corresponding title and body fields clearly.
6. The `github` tool requires `GITHUB_TOKEN` to be set in the environment. If the tool returns an error about authentication, inform the user they need to export it.

## Input Variables
{{input}}

# Vercel Manager

## Description
This skill enables you to deploy projects, manage domains, configure environment variables, and monitor deployments on Vercel.

## Instructions
1. To deploy or redeploy, use `action: "redeploy"` with the `project` name and optionally a `deployment_id` to redeploy from.
2. To create a new Vercel project linked to a GitHub repo, use `action: "create_project"` with `name` and `repo` (format: `"owner/repo"`).
3. To add environment variables, use `action: "add_env"` with `project`, `key`, and `value`. By default, variables are encrypted and available in all environments (production, preview, development).
4. To check deployment status, use `action: "list_deployments"` with the `project` name. The most recent deployment will be first.
5. To view build logs, use `action: "get_deployment_events"` with the `deployment_id`.
6. If the tool returns an authentication error, the user needs to export `VERCEL_TOKEN`. They can create one at https://vercel.com/account/tokens.

## Input Variables
{{input}}

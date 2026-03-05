# Linear Manager

## Description
This skill enables you to manage issues, projects, teams, and cycles on Linear.

## Instructions
1. Linear uses a **GraphQL API**. All queries go through a single endpoint.
2. To create an issue, you need a `team_id`. Use `action: "list_teams"` first to discover team IDs.
3. Issue priority is numeric: `0` = none, `1` = urgent, `2` = high, `3` = medium, `4` = low.
4. To search across all issues, use `action: "search_issues"` with a text `query`. It searches titles and descriptions.
5. To filter issues precisely, use `action: "list_issues"` with a `filter` object (e.g., `{ "state": { "name": { "eq": "In Progress" } } }`).
6. Linear issue identifiers look like `ENG-42` (team key + number). The `identifier` field in responses contains this.
7. If the tool returns an error, the user needs to export `LINEAR_API_KEY` from https://linear.app/settings/api.

## Input Variables
{{input}}

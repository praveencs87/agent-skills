# Notion Manager

## Description
This skill enables you to create and manage Notion pages, query databases, manage content blocks, and search across a Notion workspace.

## Instructions
1. When asked to create a Notion page, use the `notion` tool with `action: "create_page"`. Provide either a `database_id` (to add a row to a database) or `parent_page_id` (to create a sub-page).
2. For simple pages, just provide `title` and `content`. For database entries, construct a `properties` object matching the database schema.
3. To query a Notion database, use `action: "query_database"` with the `database_id`. Use `filter` for conditions (e.g., `{ "property": "Status", "select": { "equals": "Done" } }`) and `sorts` for ordering.
4. To add content to an existing page, use `action: "append_blocks"` with the `page_id` and either plain `content` text or structured `children` blocks.
5. Use `action: "search"` to find pages and databases across the workspace. The query searches titles and content.
6. Notion IDs are UUIDs (32 hex chars). They appear in page URLs after the workspace name: `notion.so/workspace/Page-Title-<ID>`.
7. If the tool returns an authentication error, the user needs to export `NOTION_API_KEY`. They must also share target pages/databases with the integration.

## Input Variables
{{input}}

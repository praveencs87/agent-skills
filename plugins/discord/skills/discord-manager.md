# Discord Manager

## Description
This skill enables you to send messages, manage channels and roles, and interact with Discord servers.

## Instructions
1. Discord uses **snowflake IDs** (large numbers like `1234567890123456789`) for channels, guilds, users, and roles. You must provide numeric IDs, not names.
2. For quick notifications without a bot token, use `action: "send_webhook"` with a `webhook_url`. Webhooks only need a URL, no authentication.
3. To send a rich message, use `embeds` (an array of embed objects with `title`, `description`, `color`, `fields`, etc.).
4. To manage a server, you need the `guild_id`. Use `action: "get_guild"` to verify access.
5. Channel types: `0` = text channel, `2` = voice channel, `4` = category. Use `parent_id` to nest a channel under a category.
6. If the tool returns an authentication error, the user needs to export `DISCORD_BOT_TOKEN`. Create a bot at https://discord.com/developers/applications.

## Input Variables
{{input}}

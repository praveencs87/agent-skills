# Telegram Manager

## Description
This skill enables you to send messages, photos, documents, polls, and manage groups via Telegram bots.

## Instructions
1. Messages support **HTML** formatting by default: `<b>bold</b>`, `<i>italic</i>`, `<code>code</code>`, `<a href="url">link</a>`.
2. Chat IDs can be numeric IDs or `@username` for public groups/channels.
3. To send a file by URL, use `action: "send_photo"` or `"send_document"` with the URL as the `photo`/`document` value.
4. Use `action: "get_updates"` to see recent incoming messages to the bot.
5. Requires `TELEGRAM_BOT_TOKEN` from @BotFather on Telegram.

## Input Variables
{{input}}

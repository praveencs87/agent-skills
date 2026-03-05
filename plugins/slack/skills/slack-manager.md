# Slack Manager

## Description
This skill enables you to send messages, manage channels, search workspace history, and upload files to Slack.

## Instructions
1. When asked to send a Slack message, use the `slack` tool with `action: "send_message"`. You need the `channel` (use a channel ID like `C01ABCDEF` or a channel name like `#general`) and the `text`.
2. For rich messages, use Slack's **mrkdwn** format: `*bold*`, `_italic_`, `~strikethrough~`, `` `code` ``, `> quote`. You can also pass `blocks` for Block Kit layouts.
3. To find a channel ID, first call `action: "list_channels"` and look for the channel name in the results.
4. To search message history, use `action: "search"` with a `query`. Slack search supports operators like `from:@user`, `in:#channel`, `before:2024-01-01`, `has:link`.
5. To reply in a thread, use `action: "send_reply"` and provide the `thread_ts` from the parent message.
6. If the tool returns an authentication error, inform the user they need to export `SLACK_BOT_TOKEN`. They can create a Slack App at https://api.slack.com/apps.

## Input Variables
{{input}}

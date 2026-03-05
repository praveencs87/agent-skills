/**
 * Slack automation tool.
 * Provides messaging, channel management, and search via the Slack Web API.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const token = process.env.SLACK_BOT_TOKEN;

    if (!token) {
        throw new Error('SLACK_BOT_TOKEN environment variable is not set. Create a Slack App at https://api.slack.com/apps and add a Bot Token.');
    }

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
    };

    async function slackAPI(method, body = null) {
        const url = `https://slack.com/api/${method}`;
        const options = { method: 'POST', headers };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(url, options);
        const data = await res.json();

        if (!data.ok) {
            throw new Error(`Slack API Error (${method}): ${data.error}`);
        }
        return data;
    }

    try {
        switch (action) {
            // --- MESSAGING ---
            case 'send_message':
                return await slackAPI('chat.postMessage', {
                    channel: args.channel,
                    text: args.text,
                    blocks: args.blocks || undefined
                });

            case 'send_reply':
                return await slackAPI('chat.postMessage', {
                    channel: args.channel,
                    text: args.text,
                    thread_ts: args.thread_ts
                });

            case 'update_message':
                return await slackAPI('chat.update', {
                    channel: args.channel,
                    ts: args.ts,
                    text: args.text
                });

            case 'delete_message':
                return await slackAPI('chat.delete', {
                    channel: args.channel,
                    ts: args.ts
                });

            // --- CHANNELS ---
            case 'list_channels':
                return await slackAPI('conversations.list', {
                    types: args.types || 'public_channel,private_channel',
                    limit: args.limit || 100
                });

            case 'create_channel':
                return await slackAPI('conversations.create', {
                    name: args.name,
                    is_private: args.is_private || false
                });

            case 'set_topic':
                return await slackAPI('conversations.setTopic', {
                    channel: args.channel,
                    topic: args.topic
                });

            case 'invite_to_channel':
                return await slackAPI('conversations.invite', {
                    channel: args.channel,
                    users: args.users // comma-separated user IDs
                });

            // --- SEARCH ---
            case 'search':
                return await slackAPI('search.messages', {
                    query: args.query,
                    count: args.count || 20,
                    sort: args.sort || 'timestamp'
                });

            // --- FILES ---
            case 'upload_file':
                // Use the v2 file upload
                return await slackAPI('files.uploadV2', {
                    channel_id: args.channel,
                    content: args.content,
                    filename: args.filename,
                    title: args.title || args.filename
                });

            // --- USERS ---
            case 'list_users':
                return await slackAPI('users.list', {
                    limit: args.limit || 100
                });

            case 'user_info':
                return await slackAPI('users.info', {
                    user: args.user
                });

            // --- REACTIONS ---
            case 'add_reaction':
                return await slackAPI('reactions.add', {
                    channel: args.channel,
                    timestamp: args.ts,
                    name: args.emoji
                });

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'slack',
    description: 'Interact with Slack to send messages, manage channels, search history, and upload files. Requires SLACK_BOT_TOKEN.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The Slack operation to perform',
                enum: [
                    'send_message', 'send_reply', 'update_message', 'delete_message',
                    'list_channels', 'create_channel', 'set_topic', 'invite_to_channel',
                    'search', 'upload_file',
                    'list_users', 'user_info',
                    'add_reaction'
                ]
            },
            channel: { type: 'string', description: 'Channel ID or name (e.g., "#general" or "C01ABCDEF")' },
            text: { type: 'string', description: 'Message text (supports Slack mrkdwn formatting)' },
            thread_ts: { type: 'string', description: 'Thread timestamp to reply to' },
            ts: { type: 'string', description: 'Message timestamp (for update/delete/reaction)' },
            name: { type: 'string', description: 'Channel name (for create_channel)' },
            is_private: { type: 'boolean', description: 'Whether to create a private channel' },
            topic: { type: 'string', description: 'Channel topic text' },
            users: { type: 'string', description: 'Comma-separated user IDs (for invite)' },
            query: { type: 'string', description: 'Search query string' },
            content: { type: 'string', description: 'File content to upload' },
            filename: { type: 'string', description: 'Filename for upload' },
            title: { type: 'string', description: 'Title for uploaded file' },
            user: { type: 'string', description: 'User ID for user_info' },
            emoji: { type: 'string', description: 'Emoji name without colons (e.g., "thumbsup")' },
            blocks: { type: 'array', description: 'Slack Block Kit blocks for rich messages' },
            limit: { type: 'number', description: 'Max results to return' }
        }
    }
};

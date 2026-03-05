/**
 * Discord automation tool.
 * Provides messaging, channel management, and webhook support via the Discord REST API (v10).
 */
export async function execute(params) {
    const { action, ...args } = params;
    const token = process.env.DISCORD_BOT_TOKEN;

    if (!token && action !== 'send_webhook') {
        throw new Error('DISCORD_BOT_TOKEN environment variable is not set. Create a bot at https://discord.com/developers/applications');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${token}`,
        'User-Agent': 'praveencs-agent-runtime (https://github.com/praveencs87/agent, 1.0.0)'
    };

    async function discordFetch(method, endpoint, body = null) {
        const url = `https://discord.com/api/v10${endpoint}`;
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(url, options);
        if (res.status === 204) return { success: true };

        const data = await res.json();
        if (!res.ok) {
            throw new Error(`Discord API Error (${res.status}): ${JSON.stringify(data)}`);
        }
        return data;
    }

    try {
        switch (action) {
            // --- MESSAGING ---
            case 'send_message':
                return await discordFetch('POST', `/channels/${args.channel_id}/messages`, {
                    content: args.content,
                    embeds: args.embeds || undefined
                });

            case 'edit_message':
                return await discordFetch('PATCH', `/channels/${args.channel_id}/messages/${args.message_id}`, {
                    content: args.content
                });

            case 'delete_message':
                return await discordFetch('DELETE', `/channels/${args.channel_id}/messages/${args.message_id}`);

            case 'get_messages':
                return await discordFetch('GET', `/channels/${args.channel_id}/messages?limit=${args.limit || 50}`);

            // --- WEBHOOKS (no bot token needed) ---
            case 'send_webhook': {
                if (!args.webhook_url) throw new Error('webhook_url is required for send_webhook');
                const res = await fetch(args.webhook_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: args.content,
                        username: args.username || 'Agent Bot',
                        embeds: args.embeds || undefined
                    })
                });
                if (!res.ok) throw new Error(`Webhook Error (${res.status})`);
                return { success: true };
            }

            // --- CHANNELS ---
            case 'list_channels':
                return await discordFetch('GET', `/guilds/${args.guild_id}/channels`);

            case 'create_channel':
                return await discordFetch('POST', `/guilds/${args.guild_id}/channels`, {
                    name: args.name,
                    type: args.type || 0, // 0 = text, 2 = voice
                    topic: args.topic,
                    parent_id: args.parent_id
                });

            case 'delete_channel':
                return await discordFetch('DELETE', `/channels/${args.channel_id}`);

            // --- GUILDS (SERVERS) ---
            case 'get_guild':
                return await discordFetch('GET', `/guilds/${args.guild_id}?with_counts=true`);

            case 'list_members':
                return await discordFetch('GET', `/guilds/${args.guild_id}/members?limit=${args.limit || 100}`);

            // --- ROLES ---
            case 'list_roles':
                return await discordFetch('GET', `/guilds/${args.guild_id}/roles`);

            case 'add_role':
                return await discordFetch('PUT', `/guilds/${args.guild_id}/members/${args.user_id}/roles/${args.role_id}`);

            case 'remove_role':
                return await discordFetch('DELETE', `/guilds/${args.guild_id}/members/${args.user_id}/roles/${args.role_id}`);

            // --- REACTIONS ---
            case 'add_reaction':
                return await discordFetch('PUT', `/channels/${args.channel_id}/messages/${args.message_id}/reactions/${encodeURIComponent(args.emoji)}/@me`);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'discord',
    description: 'Interact with Discord to send messages, manage channels and roles, use webhooks, and moderate servers. Requires DISCORD_BOT_TOKEN (except for webhooks).',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The Discord operation to perform',
                enum: [
                    'send_message', 'edit_message', 'delete_message', 'get_messages',
                    'send_webhook',
                    'list_channels', 'create_channel', 'delete_channel',
                    'get_guild', 'list_members',
                    'list_roles', 'add_role', 'remove_role',
                    'add_reaction'
                ]
            },
            channel_id: { type: 'string', description: 'Discord channel ID (snowflake)' },
            guild_id: { type: 'string', description: 'Discord server/guild ID (snowflake)' },
            message_id: { type: 'string', description: 'Message ID (snowflake)' },
            user_id: { type: 'string', description: 'User ID (snowflake)' },
            role_id: { type: 'string', description: 'Role ID (snowflake)' },
            content: { type: 'string', description: 'Message text content' },
            embeds: { type: 'array', description: 'Array of Discord embed objects for rich messages' },
            webhook_url: { type: 'string', description: 'Full Discord webhook URL' },
            username: { type: 'string', description: 'Override username for webhook messages' },
            name: { type: 'string', description: 'Channel name (for creation)' },
            type: { type: 'number', description: 'Channel type: 0=text, 2=voice, 4=category' },
            topic: { type: 'string', description: 'Channel topic' },
            parent_id: { type: 'string', description: 'Parent category ID for channel creation' },
            emoji: { type: 'string', description: 'Emoji for reactions (e.g., "👍" or "custom_emoji:123")' },
            limit: { type: 'number', description: 'Max results to return' }
        }
    }
};

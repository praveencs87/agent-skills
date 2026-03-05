/**
 * Telegram Bot API automation tool.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN is not set. Create a bot via @BotFather on Telegram.');
    }

    async function tgFetch(method, body = {}) {
        const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!data.ok) throw new Error(`Telegram API Error: ${data.description}`);
        return data.result;
    }

    try {
        switch (action) {
            case 'send_message':
                return await tgFetch('sendMessage', {
                    chat_id: args.chat_id,
                    text: args.text,
                    parse_mode: args.parse_mode || 'HTML',
                    reply_to_message_id: args.reply_to
                });

            case 'send_photo':
                return await tgFetch('sendPhoto', {
                    chat_id: args.chat_id,
                    photo: args.photo,
                    caption: args.caption
                });

            case 'send_document':
                return await tgFetch('sendDocument', {
                    chat_id: args.chat_id,
                    document: args.document,
                    caption: args.caption
                });

            case 'edit_message':
                return await tgFetch('editMessageText', {
                    chat_id: args.chat_id,
                    message_id: args.message_id,
                    text: args.text,
                    parse_mode: args.parse_mode || 'HTML'
                });

            case 'delete_message':
                return await tgFetch('deleteMessage', {
                    chat_id: args.chat_id,
                    message_id: args.message_id
                });

            case 'get_updates':
                return await tgFetch('getUpdates', {
                    limit: args.limit || 10,
                    offset: args.offset
                });

            case 'get_me':
                return await tgFetch('getMe');

            case 'get_chat':
                return await tgFetch('getChat', { chat_id: args.chat_id });

            case 'get_chat_members':
                return await tgFetch('getChatMemberCount', { chat_id: args.chat_id });

            case 'create_poll':
                return await tgFetch('sendPoll', {
                    chat_id: args.chat_id,
                    question: args.question,
                    options: args.options,
                    is_anonymous: args.is_anonymous !== false
                });

            case 'pin_message':
                return await tgFetch('pinChatMessage', {
                    chat_id: args.chat_id,
                    message_id: args.message_id
                });

            case 'set_chat_title':
                return await tgFetch('setChatTitle', {
                    chat_id: args.chat_id,
                    title: args.title
                });

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'telegram',
    description: 'Send messages, photos, documents, polls, and manage Telegram groups via the Bot API. Requires TELEGRAM_BOT_TOKEN.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                enum: ['send_message', 'send_photo', 'send_document', 'edit_message', 'delete_message', 'get_updates', 'get_me', 'get_chat', 'get_chat_members', 'create_poll', 'pin_message', 'set_chat_title']
            },
            chat_id: { type: 'string', description: 'Chat/group/channel ID' },
            text: { type: 'string', description: 'Message text (supports HTML formatting)' },
            photo: { type: 'string', description: 'Photo URL or file_id' },
            document: { type: 'string', description: 'Document URL or file_id' },
            caption: { type: 'string', description: 'Caption for photos/documents' },
            message_id: { type: 'number', description: 'Message ID for edit/delete/pin' },
            reply_to: { type: 'number', description: 'Message ID to reply to' },
            parse_mode: { type: 'string', description: 'Parse mode: HTML or MarkdownV2' },
            question: { type: 'string', description: 'Poll question' },
            options: { type: 'array', items: { type: 'string' }, description: 'Poll answer options' },
            is_anonymous: { type: 'boolean', description: 'Whether poll is anonymous' },
            title: { type: 'string', description: 'Chat title' },
            limit: { type: 'number', description: 'Max results' },
            offset: { type: 'number', description: 'Update offset for pagination' }
        }
    }
};

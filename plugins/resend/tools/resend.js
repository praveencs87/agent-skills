/**
 * Resend email automation tool.
 * Modern email API for transactional and marketing emails.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error('RESEND_API_KEY environment variable is not set. Get one at https://resend.com/api-keys');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    async function resendFetch(method, endpoint, body = null) {
        const url = `https://api.resend.com${endpoint}`;
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(url, options);
        if (res.status === 204) return { success: true };
        const data = await res.json();
        if (!res.ok) throw new Error(`Resend API Error: ${JSON.stringify(data)}`);
        return data;
    }

    try {
        switch (action) {
            case 'send_email':
                return await resendFetch('POST', '/emails', {
                    from: args.from,
                    to: Array.isArray(args.to) ? args.to : [args.to],
                    subject: args.subject,
                    html: args.html,
                    text: args.text,
                    cc: args.cc,
                    bcc: args.bcc,
                    reply_to: args.reply_to,
                    tags: args.tags
                });

            case 'send_batch':
                return await resendFetch('POST', '/emails/batch', args.emails);

            case 'get_email':
                return await resendFetch('GET', `/emails/${args.email_id}`);

            case 'list_domains':
                return await resendFetch('GET', '/domains');

            case 'add_domain':
                return await resendFetch('POST', '/domains', {
                    name: args.domain
                });

            case 'verify_domain':
                return await resendFetch('POST', `/domains/${args.domain_id}/verify`);

            case 'delete_domain':
                return await resendFetch('DELETE', `/domains/${args.domain_id}`);

            case 'list_api_keys':
                return await resendFetch('GET', '/api-keys');

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'resend',
    description: 'Send emails, manage domains, and track delivery via the Resend API. Requires RESEND_API_KEY.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                enum: ['send_email', 'send_batch', 'get_email', 'list_domains', 'add_domain', 'verify_domain', 'delete_domain', 'list_api_keys']
            },
            from: { type: 'string', description: 'Sender email (e.g., "Acme <noreply@acme.com>")' },
            to: { type: 'string', description: 'Recipient email(s) — string or array' },
            subject: { type: 'string', description: 'Email subject line' },
            html: { type: 'string', description: 'HTML email body' },
            text: { type: 'string', description: 'Plain text email body' },
            cc: { type: 'array', items: { type: 'string' }, description: 'CC recipients' },
            bcc: { type: 'array', items: { type: 'string' }, description: 'BCC recipients' },
            reply_to: { type: 'string', description: 'Reply-to address' },
            tags: { type: 'array', description: 'Email tags for tracking [{name, value}]' },
            emails: { type: 'array', description: 'Array of email objects for batch send' },
            email_id: { type: 'string', description: 'Email ID for status lookup' },
            domain: { type: 'string', description: 'Domain name to add' },
            domain_id: { type: 'string', description: 'Domain ID for verification/deletion' }
        }
    }
};

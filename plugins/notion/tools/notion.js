/**
 * Notion automation tool.
 * Provides page/database CRUD via the Notion API (2022-06-28).
 */
export async function execute(params) {
    const { action, ...args } = params;
    const token = process.env.NOTION_API_KEY;

    if (!token) {
        throw new Error('NOTION_API_KEY environment variable is not set. Create an integration at https://www.notion.so/my-integrations');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28'
    };

    async function notionFetch(method, endpoint, body = null) {
        const url = `https://api.notion.com/v1${endpoint}`;
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(url, options);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(`Notion API Error (${res.status}): ${data.message || JSON.stringify(data)}`);
        }
        return data;
    }

    /** Helper to build rich text array from plain string */
    function richText(text) {
        return [{ type: 'text', text: { content: text } }];
    }

    try {
        switch (action) {
            // --- PAGES ---
            case 'create_page':
                return await notionFetch('POST', '/pages', {
                    parent: args.database_id
                        ? { database_id: args.database_id }
                        : { page_id: args.parent_page_id },
                    properties: args.properties || {
                        title: { title: richText(args.title || 'Untitled') }
                    },
                    children: args.children || (args.content ? [
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: { rich_text: richText(args.content) }
                        }
                    ] : [])
                });

            case 'update_page':
                return await notionFetch('PATCH', `/pages/${args.page_id}`, {
                    properties: args.properties || {}
                });

            case 'get_page':
                return await notionFetch('GET', `/pages/${args.page_id}`);

            case 'archive_page':
                return await notionFetch('PATCH', `/pages/${args.page_id}`, {
                    archived: true
                });

            // --- BLOCKS (Page Content) ---
            case 'get_blocks':
                return await notionFetch('GET', `/blocks/${args.block_id || args.page_id}/children?page_size=${args.page_size || 100}`);

            case 'append_blocks':
                return await notionFetch('PATCH', `/blocks/${args.page_id}/children`, {
                    children: args.children || [
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: { rich_text: richText(args.content || '') }
                        }
                    ]
                });

            case 'delete_block':
                return await notionFetch('DELETE', `/blocks/${args.block_id}`);

            // --- DATABASES ---
            case 'query_database':
                return await notionFetch('POST', `/databases/${args.database_id}/query`, {
                    filter: args.filter || undefined,
                    sorts: args.sorts || undefined,
                    page_size: args.page_size || 100
                });

            case 'create_database':
                return await notionFetch('POST', '/databases', {
                    parent: { page_id: args.parent_page_id },
                    title: richText(args.title || 'New Database'),
                    properties: args.properties || {
                        Name: { title: {} }
                    }
                });

            // --- SEARCH ---
            case 'search':
                return await notionFetch('POST', '/search', {
                    query: args.query || '',
                    filter: args.filter || undefined,
                    sort: args.sort || { direction: 'descending', timestamp: 'last_edited_time' },
                    page_size: args.page_size || 20
                });

            // --- USERS ---
            case 'list_users':
                return await notionFetch('GET', '/users');

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'notion',
    description: 'Interact with Notion to create/update pages, query databases, manage blocks, and search workspace content. Requires NOTION_API_KEY.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The Notion operation to perform',
                enum: [
                    'create_page', 'update_page', 'get_page', 'archive_page',
                    'get_blocks', 'append_blocks', 'delete_block',
                    'query_database', 'create_database',
                    'search', 'list_users'
                ]
            },
            page_id: { type: 'string', description: 'Notion page ID' },
            parent_page_id: { type: 'string', description: 'Parent page ID (for creating sub-pages or databases)' },
            database_id: { type: 'string', description: 'Notion database ID' },
            block_id: { type: 'string', description: 'Notion block ID' },
            title: { type: 'string', description: 'Title for pages or databases' },
            content: { type: 'string', description: 'Text content to add as a paragraph block' },
            properties: { type: 'object', description: 'Notion properties object (for pages or databases)' },
            children: { type: 'array', description: 'Array of Notion block objects to add' },
            filter: { type: 'object', description: 'Notion filter object (for database queries or search)' },
            sorts: { type: 'array', description: 'Notion sorts array (for database queries)' },
            query: { type: 'string', description: 'Search query text' },
            page_size: { type: 'number', description: 'Max results per page (default: 100)' }
        }
    }
};

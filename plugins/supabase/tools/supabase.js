/**
 * Supabase automation tool.
 * Provides database queries, auth management, and storage via the Supabase REST API.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
        throw new Error('SUPABASE_URL and SUPABASE_KEY environment variables must be set. Find them in your Supabase project settings.');
    }

    const headers = {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`
    };

    async function supaFetch(method, endpoint, body = null, extraHeaders = {}) {
        const fullUrl = `${url}${endpoint}`;
        const options = { method, headers: { ...headers, ...extraHeaders } };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(fullUrl, options);
        if (res.status === 204) return { success: true };

        let data;
        try {
            data = await res.json();
        } catch {
            data = await res.text();
        }

        if (!res.ok) {
            throw new Error(`Supabase API Error (${res.status}): ${JSON.stringify(data)}`);
        }
        return data;
    }

    try {
        switch (action) {
            // --- DATABASE (PostgREST) ---
            case 'select':
                // args.table, args.columns (default "*"), args.filter (PostgREST query string)
                return await supaFetch('GET',
                    `/rest/v1/${args.table}?select=${args.columns || '*'}${args.filter ? '&' + args.filter : ''}`,
                    null,
                    { 'Range': `0-${(args.limit || 100) - 1}` }
                );

            case 'insert':
                return await supaFetch('POST', `/rest/v1/${args.table}`, args.data, {
                    'Prefer': 'return=representation'
                });

            case 'update':
                // args.filter is required, e.g. "id=eq.123"
                return await supaFetch('PATCH',
                    `/rest/v1/${args.table}?${args.filter}`,
                    args.data,
                    { 'Prefer': 'return=representation' }
                );

            case 'delete':
                return await supaFetch('DELETE',
                    `/rest/v1/${args.table}?${args.filter}`
                );

            case 'rpc':
                // Call a Postgres function
                return await supaFetch('POST', `/rest/v1/rpc/${args.function_name}`, args.params || {});

            // --- AUTH ---
            case 'list_users':
                return await supaFetch('GET', '/auth/v1/admin/users', null, {
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || key}`
                });

            case 'create_user':
                return await supaFetch('POST', '/auth/v1/admin/users', {
                    email: args.email,
                    password: args.password,
                    email_confirm: args.email_confirm !== false
                }, {
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || key}`
                });

            case 'delete_user':
                return await supaFetch('DELETE', `/auth/v1/admin/users/${args.user_id}`, null, {
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY || key}`
                });

            // --- STORAGE ---
            case 'list_buckets':
                return await supaFetch('GET', '/storage/v1/bucket');

            case 'create_bucket':
                return await supaFetch('POST', '/storage/v1/bucket', {
                    name: args.bucket_name,
                    public: args.public || false
                });

            case 'list_files':
                return await supaFetch('POST', `/storage/v1/object/list/${args.bucket_name}`, {
                    prefix: args.prefix || '',
                    limit: args.limit || 100
                });

            case 'delete_file':
                return await supaFetch('DELETE', `/storage/v1/object/${args.bucket_name}/${args.path}`);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'supabase',
    description: 'Interact with Supabase for database queries (PostgREST), auth user management, and storage. Requires SUPABASE_URL and SUPABASE_KEY.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The Supabase operation to perform',
                enum: [
                    'select', 'insert', 'update', 'delete', 'rpc',
                    'list_users', 'create_user', 'delete_user',
                    'list_buckets', 'create_bucket', 'list_files', 'delete_file'
                ]
            },
            table: { type: 'string', description: 'Database table name' },
            columns: { type: 'string', description: 'Columns to select (default: "*")' },
            filter: { type: 'string', description: 'PostgREST filter string (e.g., "status=eq.active&age=gt.18")' },
            data: { type: 'object', description: 'Data object for insert/update' },
            function_name: { type: 'string', description: 'Postgres function name (for RPC calls)' },
            params: { type: 'object', description: 'Parameters for RPC function calls' },
            email: { type: 'string', description: 'Email for user creation' },
            password: { type: 'string', description: 'Password for user creation' },
            user_id: { type: 'string', description: 'User UUID (for deletion)' },
            bucket_name: { type: 'string', description: 'Storage bucket name' },
            path: { type: 'string', description: 'File path within the bucket' },
            prefix: { type: 'string', description: 'File prefix filter for listing' },
            public: { type: 'boolean', description: 'Whether the bucket is public' },
            limit: { type: 'number', description: 'Max results to return' }
        }
    }
};

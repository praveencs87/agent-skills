/**
 * Firebase automation tool.
 * Provides Firestore CRUD, Auth management, and Storage via the Firebase REST API.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const apiKey = process.env.FIREBASE_API_KEY;

    if (!projectId) {
        throw new Error('FIREBASE_PROJECT_ID environment variable is not set.');
    }

    const token = process.env.FIREBASE_TOKEN || process.env.GOOGLE_ACCESS_TOKEN;

    async function firestoreFetch(method, path, body = null) {
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents${path}`;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (apiKey) headers['x-goog-api-key'] = apiKey;

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(url, options);
        const data = await res.json();
        if (!res.ok) throw new Error(`Firestore Error (${res.status}): ${JSON.stringify(data.error || data)}`);
        return data;
    }

    /** Convert JS object to Firestore Value format */
    function toFirestoreValue(val) {
        if (val === null) return { nullValue: null };
        if (typeof val === 'string') return { stringValue: val };
        if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
        if (typeof val === 'boolean') return { booleanValue: val };
        if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
        if (typeof val === 'object') {
            const fields = {};
            for (const [k, v] of Object.entries(val)) fields[k] = toFirestoreValue(v);
            return { mapValue: { fields } };
        }
        return { stringValue: String(val) };
    }

    function toFirestoreFields(obj) {
        const fields = {};
        for (const [k, v] of Object.entries(obj)) fields[k] = toFirestoreValue(v);
        return fields;
    }

    try {
        switch (action) {
            // --- FIRESTORE ---
            case 'get_doc':
                return await firestoreFetch('GET', `/${args.collection}/${args.doc_id}`);

            case 'list_docs':
                return await firestoreFetch('GET', `/${args.collection}?pageSize=${args.limit || 20}`);

            case 'set_doc':
                return await firestoreFetch('PATCH', `/${args.collection}/${args.doc_id}`, {
                    fields: toFirestoreFields(args.data || {})
                });

            case 'delete_doc':
                return await firestoreFetch('DELETE', `/${args.collection}/${args.doc_id}`);

            // --- AUTH (Identity Toolkit) ---
            case 'list_users': {
                if (!apiKey) throw new Error('FIREBASE_API_KEY required for auth operations');
                const res = await fetch(
                    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:batchGet`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ maxResults: args.limit || 20 })
                    }
                );
                return await res.json();
            }

            case 'create_user': {
                if (!apiKey) throw new Error('FIREBASE_API_KEY required for auth operations');
                const res = await fetch(
                    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: args.email,
                            password: args.password,
                            returnSecureToken: false
                        })
                    }
                );
                return await res.json();
            }

            // --- STORAGE ---
            case 'list_files': {
                const bucket = args.bucket || `${projectId}.appspot.com`;
                const prefix = args.prefix ? `&prefix=${encodeURIComponent(args.prefix)}` : '';
                const res = await fetch(
                    `https://storage.googleapis.com/storage/v1/b/${bucket}/o?maxResults=${args.limit || 20}${prefix}`,
                    { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }
                );
                return await res.json();
            }

            case 'delete_file': {
                const bucket = args.bucket || `${projectId}.appspot.com`;
                const res = await fetch(
                    `https://storage.googleapis.com/storage/v1/b/${bucket}/o/${encodeURIComponent(args.path)}`,
                    {
                        method: 'DELETE',
                        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                    }
                );
                if (!res.ok) throw new Error(`Storage Error: ${res.status}`);
                return { success: true };
            }

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'firebase',
    description: 'Manage Firestore docs, Auth users, and Cloud Storage on Firebase. Requires FIREBASE_PROJECT_ID.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                enum: ['get_doc', 'list_docs', 'set_doc', 'delete_doc', 'list_users', 'create_user', 'list_files', 'delete_file']
            },
            collection: { type: 'string', description: 'Firestore collection path' },
            doc_id: { type: 'string', description: 'Document ID' },
            data: { type: 'object', description: 'Document data for set_doc' },
            email: { type: 'string', description: 'Email for user creation' },
            password: { type: 'string', description: 'Password for user creation' },
            bucket: { type: 'string', description: 'Storage bucket (default: <project>.appspot.com)' },
            path: { type: 'string', description: 'File path in storage' },
            prefix: { type: 'string', description: 'File prefix filter' },
            limit: { type: 'number', description: 'Max results' }
        }
    }
};

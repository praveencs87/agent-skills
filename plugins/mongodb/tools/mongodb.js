/**
 * MongoDB automation tool.
 * Uses the MongoDB Atlas Data API for zero-dependency database operations.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const apiKey = process.env.MONGODB_API_KEY;
    const appId = process.env.MONGODB_APP_ID;
    const cluster = args.cluster || process.env.MONGODB_CLUSTER || 'Cluster0';
    const database = args.database || process.env.MONGODB_DATABASE;

    if (!apiKey || !appId) {
        throw new Error('MONGODB_API_KEY and MONGODB_APP_ID are required. Enable the Data API at https://cloud.mongodb.com');
    }

    async function mongoFetch(endpoint, body) {
        const url = `https://data.mongodb-api.com/app/${appId}/endpoint/data/v1/action/${endpoint}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({
                dataSource: cluster,
                database: database,
                collection: args.collection,
                ...body
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(`MongoDB API Error: ${JSON.stringify(data)}`);
        return data;
    }

    try {
        switch (action) {
            case 'find':
                return await mongoFetch('find', {
                    filter: args.filter || {},
                    projection: args.projection,
                    sort: args.sort,
                    limit: args.limit || 20
                });

            case 'find_one':
                return await mongoFetch('findOne', {
                    filter: args.filter || {}
                });

            case 'insert_one':
                return await mongoFetch('insertOne', {
                    document: args.document
                });

            case 'insert_many':
                return await mongoFetch('insertMany', {
                    documents: args.documents
                });

            case 'update_one':
                return await mongoFetch('updateOne', {
                    filter: args.filter,
                    update: args.update,
                    upsert: args.upsert || false
                });

            case 'update_many':
                return await mongoFetch('updateMany', {
                    filter: args.filter,
                    update: args.update
                });

            case 'delete_one':
                return await mongoFetch('deleteOne', {
                    filter: args.filter
                });

            case 'delete_many':
                return await mongoFetch('deleteMany', {
                    filter: args.filter
                });

            case 'aggregate':
                return await mongoFetch('aggregate', {
                    pipeline: args.pipeline
                });

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'mongodb',
    description: 'Query and manage MongoDB collections via the Atlas Data API. Requires MONGODB_API_KEY and MONGODB_APP_ID.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                enum: ['find', 'find_one', 'insert_one', 'insert_many', 'update_one', 'update_many', 'delete_one', 'delete_many', 'aggregate']
            },
            collection: { type: 'string', description: 'Collection name' },
            database: { type: 'string', description: 'Database name (override MONGODB_DATABASE)' },
            cluster: { type: 'string', description: 'Cluster name (default: Cluster0)' },
            filter: { type: 'object', description: 'MongoDB filter object (e.g., {"status": "active"})' },
            document: { type: 'object', description: 'Document to insert' },
            documents: { type: 'array', description: 'Array of documents to insert' },
            update: { type: 'object', description: 'Update operations (e.g., {"$set": {"name": "new"}})' },
            projection: { type: 'object', description: 'Fields to include/exclude' },
            sort: { type: 'object', description: 'Sort order (e.g., {"createdAt": -1})' },
            pipeline: { type: 'array', description: 'Aggregation pipeline stages' },
            upsert: { type: 'boolean', description: 'Insert if no match found' },
            limit: { type: 'number', description: 'Max documents to return' }
        }
    }
};

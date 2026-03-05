/**
 * Vercel automation tool.
 * Provides deployment, domain, and project management via the Vercel REST API.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const token = process.env.VERCEL_TOKEN;

    if (!token) {
        throw new Error('VERCEL_TOKEN environment variable is not set. Create a token at https://vercel.com/account/tokens');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    async function vercelFetch(method, endpoint, body = null) {
        const teamId = args.teamId ? `?teamId=${args.teamId}` : '';
        const url = `https://api.vercel.com${endpoint}${teamId}`;
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(url, options);
        if (res.status === 204) return { success: true };

        const data = await res.json();
        if (!res.ok) {
            throw new Error(`Vercel API Error (${res.status}): ${JSON.stringify(data.error || data)}`);
        }
        return data;
    }

    try {
        switch (action) {
            // --- PROJECTS ---
            case 'list_projects':
                return await vercelFetch('GET', `/v9/projects?limit=${args.limit || 20}`);

            case 'get_project':
                return await vercelFetch('GET', `/v9/projects/${args.project}`);

            case 'create_project':
                return await vercelFetch('POST', '/v10/projects', {
                    name: args.name,
                    framework: args.framework || null,
                    gitRepository: args.repo ? {
                        type: 'github',
                        repo: args.repo
                    } : undefined
                });

            case 'delete_project':
                return await vercelFetch('DELETE', `/v9/projects/${args.project}`);

            // --- DEPLOYMENTS ---
            case 'list_deployments':
                return await vercelFetch('GET', `/v6/deployments?projectId=${args.project}&limit=${args.limit || 10}`);

            case 'get_deployment':
                return await vercelFetch('GET', `/v13/deployments/${args.deployment_id}`);

            case 'redeploy':
                return await vercelFetch('POST', `/v13/deployments`, {
                    name: args.project,
                    target: args.target || 'production',
                    deploymentId: args.deployment_id
                });

            case 'cancel_deployment':
                return await vercelFetch('PATCH', `/v12/deployments/${args.deployment_id}/cancel`);

            // --- DOMAINS ---
            case 'list_domains':
                return await vercelFetch('GET', `/v5/domains?limit=${args.limit || 20}`);

            case 'add_domain':
                return await vercelFetch('POST', `/v10/projects/${args.project}/domains`, {
                    name: args.domain
                });

            case 'remove_domain':
                return await vercelFetch('DELETE', `/v9/projects/${args.project}/domains/${args.domain}`);

            // --- ENVIRONMENT VARIABLES ---
            case 'list_env':
                return await vercelFetch('GET', `/v9/projects/${args.project}/env`);

            case 'add_env':
                return await vercelFetch('POST', `/v10/projects/${args.project}/env`, {
                    key: args.key,
                    value: args.value,
                    type: args.type || 'encrypted',
                    target: args.target || ['production', 'preview', 'development']
                });

            case 'remove_env':
                return await vercelFetch('DELETE', `/v9/projects/${args.project}/env/${args.env_id}`);

            // --- LOGS ---
            case 'get_deployment_events':
                return await vercelFetch('GET', `/v3/deployments/${args.deployment_id}/events`);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'vercel',
    description: 'Manage Vercel deployments, projects, domains, and environment variables. Requires VERCEL_TOKEN.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The Vercel operation to perform',
                enum: [
                    'list_projects', 'get_project', 'create_project', 'delete_project',
                    'list_deployments', 'get_deployment', 'redeploy', 'cancel_deployment',
                    'list_domains', 'add_domain', 'remove_domain',
                    'list_env', 'add_env', 'remove_env',
                    'get_deployment_events'
                ]
            },
            project: { type: 'string', description: 'Project name or ID' },
            name: { type: 'string', description: 'Name for new project' },
            framework: { type: 'string', description: 'Framework preset (nextjs, vite, nuxtjs, etc.)' },
            repo: { type: 'string', description: 'GitHub repo in "owner/repo" format' },
            deployment_id: { type: 'string', description: 'Deployment ID' },
            target: { type: 'string', description: 'Deployment target: production or preview' },
            domain: { type: 'string', description: 'Domain name (e.g., myapp.com)' },
            key: { type: 'string', description: 'Env variable key' },
            value: { type: 'string', description: 'Env variable value' },
            type: { type: 'string', description: 'Env var type: encrypted, plain, secret, system' },
            env_id: { type: 'string', description: 'Environment variable ID (for removal)' },
            teamId: { type: 'string', description: 'Vercel team ID (optional)' },
            limit: { type: 'number', description: 'Max results to return' }
        }
    }
};

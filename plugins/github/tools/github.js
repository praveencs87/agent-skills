/**
 * The GitHub automation tool.
 * Provides a universal interface to the GitHub API using native Node.js fetch.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        throw new Error('GITHUB_TOKEN environment variable is not set. Please export it to use the github tool.');
    }

    const headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'praveencs-agent-runtime'
    };

    /** Utility to make fetch requests */
    async function ghFetch(method, endpoint, body = null) {
        const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com${endpoint}`;
        const options = { method, headers };
        if (body) {
            options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);
        if (res.status === 204) return { success: true };

        let data;
        try {
            data = await res.json();
        } catch {
            data = await res.text();
        }

        if (!res.ok) {
            throw new Error(`GitHub API Error (${res.status}): ${JSON.stringify(data)}`);
        }
        return data;
    }

    try {
        switch (action) {
            // --- REPOSITORY MANAGEMENT ---
            case 'create_repo':
                return await ghFetch('POST', '/user/repos', args);
            case 'fork_repo':
                return await ghFetch('POST', `/repos/${args.owner}/${args.repo}/forks`, args);
            case 'delete_repo':
                return await ghFetch('DELETE', `/repos/${args.owner}/${args.repo}`);
            case 'list_repos':
                return await ghFetch('GET', `/user/repos?sort=updated&per_page=${args.per_page || 30}`);

            // --- ISSUES & PULL REQUESTS ---
            case 'create_issue':
                return await ghFetch('POST', `/repos/${args.owner}/${args.repo}/issues`, {
                    title: args.title,
                    body: args.body,
                    labels: args.labels || [],
                    assignees: args.assignees || []
                });
            case 'create_pr':
                return await ghFetch('POST', `/repos/${args.owner}/${args.repo}/pulls`, {
                    title: args.title,
                    head: args.head, // The branch where changes are implemented
                    base: args.base, // The branch you want your changes pulled into
                    body: args.body
                });

            // --- ADVANCED SEARCH ---
            case 'search_code':
                // args.query should be a fully formed GitHub code search string e.g. "addClass repo:jquery/jquery"
                return await ghFetch('GET', `/search/code?q=${encodeURIComponent(args.query)}`);
            case 'search_repos':
                return await ghFetch('GET', `/search/repositories?q=${encodeURIComponent(args.query)}&sort=stars&order=desc`);

            // --- CI/CD WORKFLOWS & ACTIONS ---
            case 'list_workflows':
                return await ghFetch('GET', `/repos/${args.owner}/${args.repo}/actions/workflows`);
            case 'dispatch_workflow':
                // args.workflow_id can be the ID or the filename (e.g., 'main.yml')
                return await ghFetch('POST', `/repos/${args.owner}/${args.repo}/actions/workflows/${args.workflow_id}/dispatches`, {
                    ref: args.ref || 'main', // Branch or tag
                    inputs: args.inputs || {}
                });
            case 'list_workflow_runs':
                return await ghFetch('GET', `/repos/${args.owner}/${args.repo}/actions/runs?per_page=${args.per_page || 10}`);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return {
            error: err.message,
            stack: err.stack
        };
    }
}

export const definition = {
    name: 'github',
    description: 'Interact with the GitHub API to manage repositories, search code, trigger workflows, and manage issues/PRs. Requires GITHUB_TOKEN environment variable.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The GitHub operation to perform',
                enum: [
                    'create_repo', 'fork_repo', 'delete_repo', 'list_repos',
                    'create_issue', 'create_pr',
                    'search_code', 'search_repos',
                    'list_workflows', 'dispatch_workflow', 'list_workflow_runs'
                ]
            },
            owner: { type: 'string', description: 'Repository owner (username or org)' },
            repo: { type: 'string', description: 'Repository name' },
            title: { type: 'string', description: 'Title for issue or PR or repository name' },
            body: { type: 'string', description: 'Description body for issue or PR' },
            head: { type: 'string', description: 'Branch containing your changes (for PRs)' },
            base: { type: 'string', description: 'Target branch to pull into (for PRs)' },
            query: { type: 'string', description: 'Advanced search query string (e.g., "my-func repo:org/repo in:file")' },
            workflow_id: { type: 'string', description: 'The ID or filename of the workflow (e.g., "build.yml")' },
            ref: { type: 'string', description: 'Git branch or tag to run the workflow against' },
            inputs: { type: 'object', description: 'Inputs to pass to the workflow dispatch' },
            labels: { type: 'array', items: { type: 'string' }, description: 'Labels for issues' },
            assignees: { type: 'array', items: { type: 'string' }, description: 'Assignees for issues' }
        }
    }
};

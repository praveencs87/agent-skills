/**
 * Linear automation tool.
 * Provides issue, project, and cycle management via the Linear GraphQL API.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const apiKey = process.env.LINEAR_API_KEY;

    if (!apiKey) {
        throw new Error('LINEAR_API_KEY environment variable is not set. Create one at https://linear.app/settings/api');
    }

    async function linearQuery(query, variables = {}) {
        const res = await fetch('https://api.linear.app/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({ query, variables })
        });

        const data = await res.json();
        if (data.errors) {
            throw new Error(`Linear API Error: ${data.errors.map(e => e.message).join(', ')}`);
        }
        return data.data;
    }

    try {
        switch (action) {
            // --- ISSUES ---
            case 'create_issue':
                return await linearQuery(`
                    mutation CreateIssue($input: IssueCreateInput!) {
                        issueCreate(input: $input) {
                            success
                            issue { id identifier title url state { name } }
                        }
                    }
                `, {
                    input: {
                        title: args.title,
                        description: args.description,
                        teamId: args.team_id,
                        priority: args.priority,          // 0=none, 1=urgent, 2=high, 3=medium, 4=low
                        assigneeId: args.assignee_id,
                        labelIds: args.label_ids
                    }
                });

            case 'update_issue':
                return await linearQuery(`
                    mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
                        issueUpdate(id: $id, input: $input) {
                            success
                            issue { id identifier title state { name } }
                        }
                    }
                `, {
                    id: args.issue_id,
                    input: args.data || {}
                });

            case 'list_issues':
                return await linearQuery(`
                    query Issues($filter: IssueFilter, $first: Int) {
                        issues(filter: $filter, first: $first) {
                            nodes {
                                id identifier title description priority
                                state { name }
                                assignee { name email }
                                labels { nodes { name } }
                                url createdAt updatedAt
                            }
                        }
                    }
                `, {
                    filter: args.filter || {},
                    first: args.limit || 25
                });

            case 'search_issues':
                return await linearQuery(`
                    query SearchIssues($term: String!, $first: Int) {
                        searchIssues(term: $term, first: $first) {
                            nodes {
                                id identifier title description
                                state { name }
                                assignee { name }
                                url
                            }
                        }
                    }
                `, { term: args.query, first: args.limit || 20 });

            // --- PROJECTS ---
            case 'list_projects':
                return await linearQuery(`
                    query Projects($first: Int) {
                        projects(first: $first) {
                            nodes {
                                id name description state progress
                                lead { name }
                                url startDate targetDate
                            }
                        }
                    }
                `, { first: args.limit || 20 });

            case 'create_project':
                return await linearQuery(`
                    mutation CreateProject($input: ProjectCreateInput!) {
                        projectCreate(input: $input) {
                            success
                            project { id name url }
                        }
                    }
                `, {
                    input: {
                        name: args.name,
                        description: args.description,
                        teamIds: args.team_ids
                    }
                });

            // --- TEAMS ---
            case 'list_teams':
                return await linearQuery(`
                    query Teams {
                        teams {
                            nodes { id name key description }
                        }
                    }
                `);

            // --- CYCLES ---
            case 'list_cycles':
                return await linearQuery(`
                    query Cycles($teamId: String!, $first: Int) {
                        team(id: $teamId) {
                            cycles(first: $first) {
                                nodes {
                                    id number name startsAt endsAt
                                    progress completedIssueCountHistory
                                }
                            }
                        }
                    }
                `, { teamId: args.team_id, first: args.limit || 10 });

            // --- VIEWER ---
            case 'me':
                return await linearQuery(`
                    query Me {
                        viewer { id name email admin url }
                    }
                `);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'linear',
    description: 'Manage Linear issues, projects, teams, and cycles for modern project tracking. Requires LINEAR_API_KEY.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The Linear operation to perform',
                enum: [
                    'create_issue', 'update_issue', 'list_issues', 'search_issues',
                    'list_projects', 'create_project',
                    'list_teams', 'list_cycles', 'me'
                ]
            },
            title: { type: 'string', description: 'Issue or project title' },
            description: { type: 'string', description: 'Issue or project description (supports markdown)' },
            team_id: { type: 'string', description: 'Linear team ID' },
            team_ids: { type: 'array', items: { type: 'string' }, description: 'Team IDs for project creation' },
            issue_id: { type: 'string', description: 'Issue ID for updates' },
            assignee_id: { type: 'string', description: 'User ID to assign the issue to' },
            priority: { type: 'number', description: 'Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low' },
            label_ids: { type: 'array', items: { type: 'string' }, description: 'Label IDs to apply' },
            data: { type: 'object', description: 'Update data for issues (IssueUpdateInput)' },
            filter: { type: 'object', description: 'Issue filter object (IssueFilter)' },
            query: { type: 'string', description: 'Search query text' },
            name: { type: 'string', description: 'Project name' },
            limit: { type: 'number', description: 'Max results to return' }
        }
    }
};

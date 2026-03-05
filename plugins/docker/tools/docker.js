/**
 * Docker automation tool.
 * Manages containers, images, volumes, and compose stacks via the Docker CLI.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function dockerCli(args, cwd) {
    try {
        const { stdout, stderr } = await execFileAsync('docker', args, {
            timeout: 60000,
            maxBuffer: 10 * 1024 * 1024,
            cwd: cwd || process.cwd(),
            env: process.env,
            shell: true
        });
        try { return JSON.parse(stdout); } catch { return { output: stdout.trim(), stderr: stderr.trim() }; }
    } catch (err) {
        throw new Error(`Docker Error: ${err.stderr || err.message}`);
    }
}

export async function execute(params) {
    const { action, ...args } = params;

    try {
        switch (action) {
            // --- CONTAINERS ---
            case 'ps':
                return await dockerCli(['ps', '--format', 'json', ...(args.all ? ['-a'] : [])]);

            case 'run':
                return await dockerCli([
                    'run', '-d',
                    ...(args.name ? ['--name', args.name] : []),
                    ...(args.ports ? args.ports.flatMap(p => ['-p', p]) : []),
                    ...(args.env_vars ? args.env_vars.flatMap(e => ['-e', e]) : []),
                    ...(args.volumes ? args.volumes.flatMap(v => ['-v', v]) : []),
                    args.image
                ]);

            case 'stop':
                return await dockerCli(['stop', args.container]);

            case 'rm':
                return await dockerCli(['rm', ...(args.force ? ['-f'] : []), args.container]);

            case 'logs':
                return await dockerCli(['logs', '--tail', String(args.tail || 100), args.container]);

            case 'exec':
                return await dockerCli(['exec', args.container, ...args.command.split(' ')]);

            // --- IMAGES ---
            case 'images':
                return await dockerCli(['images', '--format', 'json']);

            case 'build':
                return await dockerCli([
                    'build', '-t', args.tag,
                    ...(args.file ? ['-f', args.file] : []),
                    args.context || '.'
                ], args.cwd);

            case 'pull':
                return await dockerCli(['pull', args.image]);

            case 'rmi':
                return await dockerCli(['rmi', ...(args.force ? ['-f'] : []), args.image]);

            // --- VOLUMES ---
            case 'volume_ls':
                return await dockerCli(['volume', 'ls', '--format', 'json']);

            case 'volume_create':
                return await dockerCli(['volume', 'create', args.name]);

            // --- COMPOSE ---
            case 'compose_up':
                return await dockerCli(['compose', 'up', '-d', ...(args.build ? ['--build'] : [])], args.cwd);

            case 'compose_down':
                return await dockerCli(['compose', 'down', ...(args.volumes ? ['-v'] : [])], args.cwd);

            case 'compose_ps':
                return await dockerCli(['compose', 'ps', '--format', 'json'], args.cwd);

            case 'compose_logs':
                return await dockerCli(['compose', 'logs', '--tail', String(args.tail || 100)], args.cwd);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'docker',
    description: 'Manage Docker containers, images, volumes, and compose stacks. Requires Docker CLI installed.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The Docker operation to perform',
                enum: [
                    'ps', 'run', 'stop', 'rm', 'logs', 'exec',
                    'images', 'build', 'pull', 'rmi',
                    'volume_ls', 'volume_create',
                    'compose_up', 'compose_down', 'compose_ps', 'compose_logs'
                ]
            },
            container: { type: 'string', description: 'Container ID or name' },
            image: { type: 'string', description: 'Docker image name (e.g., nginx:latest)' },
            name: { type: 'string', description: 'Container or volume name' },
            tag: { type: 'string', description: 'Image tag for build (e.g., myapp:v1)' },
            ports: { type: 'array', items: { type: 'string' }, description: 'Port mappings (e.g., ["8080:80"])' },
            env_vars: { type: 'array', items: { type: 'string' }, description: 'Environment vars (e.g., ["NODE_ENV=prod"])' },
            volumes: { type: 'array', items: { type: 'string' }, description: 'Volume mounts (e.g., ["./data:/data"])' },
            command: { type: 'string', description: 'Command to exec inside container' },
            context: { type: 'string', description: 'Build context path (default: .)' },
            file: { type: 'string', description: 'Dockerfile path' },
            cwd: { type: 'string', description: 'Working directory for compose commands' },
            tail: { type: 'number', description: 'Number of log lines to show' },
            all: { type: 'boolean', description: 'Show all containers (including stopped)' },
            force: { type: 'boolean', description: 'Force remove' },
            build: { type: 'boolean', description: 'Rebuild images on compose up' }
        }
    }
};

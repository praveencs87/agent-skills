/**
 * AWS automation tool.
 * Provides S3, Lambda, EC2, and CloudWatch management via AWS CLI commands.
 * Uses the AWS CLI (`aws`) which must be installed and configured on the host.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function execute(params) {
    const { action, ...args } = params;

    // Verify AWS credentials are available
    if (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_PROFILE) {
        throw new Error('AWS credentials not configured. Export AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY, or set AWS_PROFILE.');
    }

    const region = args.region || process.env.AWS_DEFAULT_REGION || 'us-east-1';

    /** Run an AWS CLI command and return parsed JSON */
    async function awsCli(service, command, cliArgs = []) {
        const fullArgs = [service, command, '--region', region, '--output', 'json', ...cliArgs];
        try {
            const { stdout } = await execFileAsync('aws', fullArgs, {
                timeout: 30000,
                maxBuffer: 10 * 1024 * 1024,
                env: process.env
            });
            try {
                return JSON.parse(stdout);
            } catch {
                return { output: stdout.trim() };
            }
        } catch (err) {
            throw new Error(`AWS CLI Error: ${err.stderr || err.message}`);
        }
    }

    try {
        switch (action) {
            // --- S3 ---
            case 's3_list_buckets':
                return await awsCli('s3api', 'list-buckets');

            case 's3_list_objects':
                return await awsCli('s3api', 'list-objects-v2', [
                    '--bucket', args.bucket,
                    '--max-items', String(args.limit || 50),
                    ...(args.prefix ? ['--prefix', args.prefix] : [])
                ]);

            case 's3_create_bucket':
                return await awsCli('s3api', 'create-bucket', [
                    '--bucket', args.bucket,
                    ...(region !== 'us-east-1' ? ['--create-bucket-configuration', `LocationConstraint=${region}`] : [])
                ]);

            case 's3_delete_bucket':
                return await awsCli('s3api', 'delete-bucket', ['--bucket', args.bucket]);

            case 's3_upload': {
                const dest = `s3://${args.bucket}/${args.key}`;
                return await awsCli('s3', 'cp', [args.file, dest]);
            }

            case 's3_download': {
                const src = `s3://${args.bucket}/${args.key}`;
                return await awsCli('s3', 'cp', [src, args.file || `./${args.key}`]);
            }

            // --- LAMBDA ---
            case 'lambda_list':
                return await awsCli('lambda', 'list-functions', ['--max-items', String(args.limit || 20)]);

            case 'lambda_invoke':
                return await awsCli('lambda', 'invoke', [
                    '--function-name', args.function_name,
                    '--payload', JSON.stringify(args.payload || {}),
                    '--cli-binary-format', 'raw-in-base64-out',
                    '/dev/stdout'
                ]);

            case 'lambda_get':
                return await awsCli('lambda', 'get-function', ['--function-name', args.function_name]);

            // --- EC2 ---
            case 'ec2_list':
                return await awsCli('ec2', 'describe-instances', [
                    '--filters', `Name=instance-state-name,Values=${args.state || 'running'}`,
                    '--max-items', String(args.limit || 20)
                ]);

            case 'ec2_start':
                return await awsCli('ec2', 'start-instances', ['--instance-ids', args.instance_id]);

            case 'ec2_stop':
                return await awsCli('ec2', 'stop-instances', ['--instance-ids', args.instance_id]);

            // --- CLOUDWATCH ---
            case 'cloudwatch_logs':
                return await awsCli('logs', 'get-log-events', [
                    '--log-group-name', args.log_group,
                    '--log-stream-name', args.log_stream,
                    '--limit', String(args.limit || 50)
                ]);

            case 'cloudwatch_log_groups':
                return await awsCli('logs', 'describe-log-groups', [
                    '--limit', String(args.limit || 20)
                ]);

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'aws',
    description: 'Manage AWS resources: S3 buckets, Lambda functions, EC2 instances, and CloudWatch logs. Requires AWS CLI installed and credentials configured.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The AWS operation to perform',
                enum: [
                    's3_list_buckets', 's3_list_objects', 's3_create_bucket', 's3_delete_bucket', 's3_upload', 's3_download',
                    'lambda_list', 'lambda_invoke', 'lambda_get',
                    'ec2_list', 'ec2_start', 'ec2_stop',
                    'cloudwatch_logs', 'cloudwatch_log_groups'
                ]
            },
            bucket: { type: 'string', description: 'S3 bucket name' },
            key: { type: 'string', description: 'S3 object key (path within bucket)' },
            prefix: { type: 'string', description: 'S3 key prefix for filtering' },
            file: { type: 'string', description: 'Local file path (for upload/download)' },
            function_name: { type: 'string', description: 'Lambda function name or ARN' },
            payload: { type: 'object', description: 'JSON payload for Lambda invocation' },
            instance_id: { type: 'string', description: 'EC2 instance ID (i-xxx)' },
            state: { type: 'string', description: 'EC2 instance state filter (running, stopped, etc.)' },
            log_group: { type: 'string', description: 'CloudWatch log group name' },
            log_stream: { type: 'string', description: 'CloudWatch log stream name' },
            region: { type: 'string', description: 'AWS region (default: us-east-1)' },
            limit: { type: 'number', description: 'Max results to return' }
        }
    }
};

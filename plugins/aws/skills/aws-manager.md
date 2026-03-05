# AWS Manager

## Description
This skill enables you to manage S3 buckets, Lambda functions, EC2 instances, and CloudWatch logs on AWS.

## Instructions
1. This plugin uses the **AWS CLI** (`aws`). It must be installed and configured on the host machine.
2. For S3 operations: `s3_list_buckets` shows all buckets, `s3_list_objects` lists files in a bucket with optional `prefix` filtering.
3. To upload a local file to S3, use `action: "s3_upload"` with `file` (local path), `bucket`, and `key` (destination path).
4. For Lambda, use `lambda_invoke` with `function_name` and a `payload` object. The response contains the function's return value.
5. For EC2, use `ec2_list` to see instances (filtered by `state`: running, stopped). Use `ec2_start` / `ec2_stop` with the `instance_id`.
6. For CloudWatch, first `cloudwatch_log_groups` to discover groups, then `cloudwatch_logs` with `log_group` and `log_stream` to fetch entries.
7. Set `region` parameter to target a specific AWS region, or it defaults to `AWS_DEFAULT_REGION` or `us-east-1`.
8. Credentials can be configured via `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` or `AWS_PROFILE`.

## Input Variables
{{input}}

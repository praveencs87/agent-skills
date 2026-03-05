# Resend Manager

## Description
This skill enables you to send transactional and marketing emails, manage domains, and track delivery via Resend.

## Instructions
1. To send an email, use `action: "send_email"` with `from`, `to`, `subject`, and either `html` or `text`.
2. The `from` field must use a verified domain (e.g., `"Agent <noreply@yourdomain.com>"`). For testing, use `onboarding@resend.dev`.
3. For batch sending, use `action: "send_batch"` with `emails` as an array of email objects.
4. Use `action: "get_email"` with `email_id` to check delivery status of a sent email.
5. Before using a custom domain, add it with `add_domain` then verify with `verify_domain`.
6. Requires `RESEND_API_KEY` from https://resend.com/api-keys.

## Input Variables
{{input}}

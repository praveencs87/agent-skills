Send an email using the helper script.

## Usage
Run the send script using cmd.run:
```
node .agent/skills/send-email/send.js --to <recipient> --subject "<subject>" --body "<body>"
```

## Requirements
- Environment variables `EMAIL_USER` and `EMAIL_PASS` must be set
- `nodemailer` must be installed (`npm install nodemailer`)

## Parameters
- `--to`: Recipient email address (required)
- `--subject`: Email subject line (required)
- `--body`: Email body text (required)
- `--html`: Send as HTML email (optional flag)

If the user doesn't specify a subject, generate an appropriate one based on the body content.

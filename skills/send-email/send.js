#!/usr/bin/env node

/**
 * send.js — Simple email sender using nodemailer
 * Usage: node send.js --to <email> --subject "<subject>" --body "<body>"
 * 
 * Requires: EMAIL_USER and EMAIL_PASS environment variables
 */

const args = process.argv.slice(2);

function getArg(name) {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const to = getArg('to');
const subject = getArg('subject');
const body = getArg('body');
const isHtml = args.includes('--html');

if (!to || !subject || !body) {
    console.error('Usage: node send.js --to <email> --subject "<subject>" --body "<body>" [--html]');
    process.exit(1);
}

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass) {
    console.error('Error: EMAIL_USER and EMAIL_PASS environment variables are required');
    process.exit(1);
}

async function sendEmail() {
    try {
        const nodemailer = await import('nodemailer');

        const transporter = nodemailer.default.createTransport({
            service: 'gmail',
            auth: { user, pass }
        });

        const mailOptions = {
            from: user,
            to,
            subject,
            [isHtml ? 'html' : 'text']: body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}`);
        console.log(`   Message ID: ${info.messageId}`);
    } catch (error) {
        console.error(`❌ Failed to send email: ${error.message}`);
        process.exit(1);
    }
}

sendEmail();

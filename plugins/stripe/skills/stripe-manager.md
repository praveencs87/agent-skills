# Stripe Manager

## Description
This skill enables you to manage customers, products, subscriptions, checkout sessions, invoices, and refunds on Stripe.

## Instructions
1. Stripe amounts are always in **cents**. $19.99 = `1999`. Always convert before passing to the tool.
2. To set up a SaaS billing flow: first `create_product`, then `create_price` (with `interval` for recurring), then `create_checkout` or `create_subscription`.
3. Customer IDs start with `cus_`, product IDs with `prod_`, price IDs with `price_`, subscription IDs with `sub_`.
4. For checkout sessions, always provide `success_url` and `cancel_url` — these are where Stripe redirects after payment.
5. To issue a partial refund, use `create_refund` with both `payment_intent` and `amount` (in cents).
6. Use `get_balance` to check the current Stripe account balance.
7. If the tool returns an authentication error, the user needs to export `STRIPE_SECRET_KEY` from https://dashboard.stripe.com/apikeys. Use **test mode keys** (`sk_test_...`) for development.

## Input Variables
{{input}}

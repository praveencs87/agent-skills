/**
 * Stripe automation tool.
 * Provides customer, subscription, payment, and invoice management via the Stripe REST API.
 * Uses form-encoded requests as required by Stripe's API.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const key = process.env.STRIPE_SECRET_KEY;

    if (!key) {
        throw new Error('STRIPE_SECRET_KEY environment variable is not set. Find it at https://dashboard.stripe.com/apikeys');
    }

    const headers = {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    /** Convert a flat object to URL-encoded form data (supports nested via bracket notation) */
    function toForm(obj, prefix = '') {
        const parts = [];
        for (const [key, val] of Object.entries(obj)) {
            if (val === undefined || val === null) continue;
            const fullKey = prefix ? `${prefix}[${key}]` : key;
            if (typeof val === 'object' && !Array.isArray(val)) {
                parts.push(toForm(val, fullKey));
            } else {
                parts.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(val)}`);
            }
        }
        return parts.join('&');
    }

    async function stripeFetch(method, endpoint, body = null) {
        const url = `https://api.stripe.com/v1${endpoint}`;
        const options = { method, headers };
        if (body) options.body = toForm(body);

        const res = await fetch(url, options);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(`Stripe API Error: ${data.error?.message || JSON.stringify(data)}`);
        }
        return data;
    }

    try {
        switch (action) {
            // --- CUSTOMERS ---
            case 'create_customer':
                return await stripeFetch('POST', '/customers', {
                    email: args.email,
                    name: args.name,
                    description: args.description,
                    metadata: args.metadata
                });

            case 'list_customers':
                return await stripeFetch('GET', `/customers?limit=${args.limit || 10}`);

            case 'get_customer':
                return await stripeFetch('GET', `/customers/${args.customer_id}`);

            case 'update_customer':
                return await stripeFetch('POST', `/customers/${args.customer_id}`, args.data || {});

            case 'delete_customer':
                return await stripeFetch('DELETE', `/customers/${args.customer_id}`);

            // --- PRODUCTS & PRICES ---
            case 'create_product':
                return await stripeFetch('POST', '/products', {
                    name: args.name,
                    description: args.description
                });

            case 'create_price':
                return await stripeFetch('POST', '/prices', {
                    product: args.product_id,
                    unit_amount: args.amount,      // in cents
                    currency: args.currency || 'usd',
                    recurring: args.interval ? { interval: args.interval } : undefined
                });

            case 'list_products':
                return await stripeFetch('GET', `/products?limit=${args.limit || 10}&active=true`);

            // --- SUBSCRIPTIONS ---
            case 'create_subscription':
                return await stripeFetch('POST', '/subscriptions', {
                    customer: args.customer_id,
                    'items[0][price]': args.price_id
                });

            case 'list_subscriptions':
                return await stripeFetch('GET', `/subscriptions?customer=${args.customer_id}&limit=${args.limit || 10}`);

            case 'cancel_subscription':
                return await stripeFetch('DELETE', `/subscriptions/${args.subscription_id}`);

            // --- CHECKOUT ---
            case 'create_checkout':
                return await stripeFetch('POST', '/checkout/sessions', {
                    mode: args.mode || 'payment',
                    success_url: args.success_url,
                    cancel_url: args.cancel_url,
                    'line_items[0][price]': args.price_id,
                    'line_items[0][quantity]': args.quantity || 1,
                    customer_email: args.email
                });

            // --- INVOICES ---
            case 'list_invoices':
                return await stripeFetch('GET', `/invoices?customer=${args.customer_id || ''}&limit=${args.limit || 10}`);

            // --- REFUNDS ---
            case 'create_refund':
                return await stripeFetch('POST', '/refunds', {
                    payment_intent: args.payment_intent,
                    amount: args.amount    // partial refund in cents
                });

            // --- BALANCE ---
            case 'get_balance':
                return await stripeFetch('GET', '/balance');

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'stripe',
    description: 'Manage Stripe customers, products, subscriptions, checkout sessions, invoices, and refunds. Requires STRIPE_SECRET_KEY.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The Stripe operation to perform',
                enum: [
                    'create_customer', 'list_customers', 'get_customer', 'update_customer', 'delete_customer',
                    'create_product', 'create_price', 'list_products',
                    'create_subscription', 'list_subscriptions', 'cancel_subscription',
                    'create_checkout',
                    'list_invoices', 'create_refund', 'get_balance'
                ]
            },
            customer_id: { type: 'string', description: 'Stripe customer ID (cus_xxx)' },
            email: { type: 'string', description: 'Customer email' },
            name: { type: 'string', description: 'Customer or product name' },
            description: { type: 'string', description: 'Description text' },
            product_id: { type: 'string', description: 'Stripe product ID (prod_xxx)' },
            price_id: { type: 'string', description: 'Stripe price ID (price_xxx)' },
            amount: { type: 'number', description: 'Amount in cents (e.g., 1999 = $19.99)' },
            currency: { type: 'string', description: 'Currency code (default: usd)' },
            interval: { type: 'string', description: 'Billing interval: month, year, week, day' },
            subscription_id: { type: 'string', description: 'Stripe subscription ID (sub_xxx)' },
            mode: { type: 'string', description: 'Checkout mode: payment, subscription, setup' },
            success_url: { type: 'string', description: 'URL to redirect after successful checkout' },
            cancel_url: { type: 'string', description: 'URL to redirect after cancelled checkout' },
            quantity: { type: 'number', description: 'Quantity for checkout line item' },
            payment_intent: { type: 'string', description: 'Payment intent ID for refunds (pi_xxx)' },
            data: { type: 'object', description: 'Arbitrary update data for customer updates' },
            metadata: { type: 'object', description: 'Key-value metadata for Stripe objects' },
            limit: { type: 'number', description: 'Max results to return' }
        }
    }
};

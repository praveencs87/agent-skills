/**
 * Hugging Face automation tool.
 * Provides model inference and hub search via the Hugging Face API.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const token = process.env.HF_TOKEN;

    if (!token) {
        throw new Error('HF_TOKEN environment variable is not set. Get one at https://huggingface.co/settings/tokens');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    try {
        switch (action) {
            case 'inference': {
                const model = args.model || 'meta-llama/Llama-2-7b-chat-hf';
                const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ inputs: args.inputs, parameters: args.parameters || {} })
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(`HF Inference Error: ${err.error || JSON.stringify(err)}`);
                }
                const contentType = res.headers.get('content-type') || '';
                if (contentType.includes('json')) return await res.json();
                return { output: 'Binary response (image/audio)', bytes: (await res.arrayBuffer()).byteLength };
            }

            case 'text_generation': {
                const model = args.model || 'mistralai/Mistral-7B-Instruct-v0.2';
                const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        inputs: args.prompt,
                        parameters: {
                            max_new_tokens: args.max_tokens || 256,
                            temperature: args.temperature ?? 0.7,
                            return_full_text: false
                        }
                    })
                });
                return await res.json();
            }

            case 'summarization': {
                const model = args.model || 'facebook/bart-large-cnn';
                const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ inputs: args.text })
                });
                return await res.json();
            }

            case 'sentiment': {
                const model = args.model || 'distilbert-base-uncased-finetuned-sst-2-english';
                const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ inputs: args.text })
                });
                return await res.json();
            }

            case 'translation': {
                const model = args.model || 'Helsinki-NLP/opus-mt-en-fr';
                const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ inputs: args.text })
                });
                return await res.json();
            }

            case 'image_classification': {
                const model = args.model || 'google/vit-base-patch16-224';
                const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: args.image_url
                        ? JSON.stringify({ inputs: args.image_url })
                        : args.image_data
                });
                return await res.json();
            }

            case 'search_models': {
                const query = args.query || '';
                const res = await fetch(
                    `https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=${args.limit || 10}&sort=downloads&direction=-1`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                const models = await res.json();
                return models.map(m => ({
                    id: m.modelId || m.id,
                    pipeline: m.pipeline_tag,
                    downloads: m.downloads,
                    likes: m.likes,
                    lastModified: m.lastModified
                }));
            }

            case 'model_info': {
                const res = await fetch(`https://huggingface.co/api/models/${args.model}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                return await res.json();
            }

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'huggingface',
    description: 'Run ML inference (text gen, summarization, sentiment, translation, image classification) and search Hugging Face models. Requires HF_TOKEN.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                enum: ['inference', 'text_generation', 'summarization', 'sentiment', 'translation', 'image_classification', 'search_models', 'model_info']
            },
            model: { type: 'string', description: 'Hugging Face model ID (e.g., meta-llama/Llama-2-7b-chat-hf)' },
            inputs: { type: 'string', description: 'Raw input for generic inference' },
            prompt: { type: 'string', description: 'Text prompt for generation' },
            text: { type: 'string', description: 'Text input for summarization/sentiment/translation' },
            image_url: { type: 'string', description: 'Image URL for classification' },
            parameters: { type: 'object', description: 'Model parameters' },
            max_tokens: { type: 'number', description: 'Max tokens for text generation' },
            temperature: { type: 'number', description: 'Temperature for generation' },
            query: { type: 'string', description: 'Search query for model hub' },
            limit: { type: 'number', description: 'Max results' }
        }
    }
};

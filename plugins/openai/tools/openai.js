/**
 * OpenAI automation tool.
 * Provides direct access to GPT chat completions, DALL-E, Whisper, and TTS via the OpenAI REST API.
 */
export async function execute(params) {
    const { action, ...args } = params;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set. Get one at https://platform.openai.com/api-keys');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    async function oaiFetch(method, endpoint, body = null, isFormData = false) {
        const url = `https://api.openai.com/v1${endpoint}`;
        const options = { method };
        if (isFormData) {
            options.headers = { 'Authorization': `Bearer ${apiKey}` };
            options.body = body; // FormData
        } else {
            options.headers = headers;
            if (body) options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);
        const contentType = res.headers.get('content-type') || '';

        if (contentType.includes('audio')) {
            // TTS returns audio bytes
            const buffer = await res.arrayBuffer();
            return { success: true, audioBytes: buffer.byteLength, note: 'Audio data returned (write to file to play)' };
        }

        const data = await res.json();
        if (!res.ok) {
            throw new Error(`OpenAI API Error: ${data.error?.message || JSON.stringify(data)}`);
        }
        return data;
    }

    try {
        switch (action) {
            // --- CHAT COMPLETIONS ---
            case 'chat':
                return await oaiFetch('POST', '/chat/completions', {
                    model: args.model || 'gpt-4o-mini',
                    messages: args.messages || [{ role: 'user', content: args.prompt }],
                    temperature: args.temperature ?? 0.7,
                    max_tokens: args.max_tokens || 1024,
                    response_format: args.json_mode ? { type: 'json_object' } : undefined
                });

            // --- IMAGE GENERATION (DALL-E) ---
            case 'generate_image':
                return await oaiFetch('POST', '/images/generations', {
                    model: args.model || 'dall-e-3',
                    prompt: args.prompt,
                    n: args.n || 1,
                    size: args.size || '1024x1024',
                    quality: args.quality || 'standard',
                    style: args.style || 'vivid'
                });

            // --- SPEECH TO TEXT (WHISPER) ---
            case 'transcribe': {
                // Note: requires audio file content — in practice the agent would
                // read a file and pass its path for the host to handle
                return await oaiFetch('POST', '/audio/transcriptions', {
                    model: 'whisper-1',
                    file: args.file,
                    language: args.language
                });
            }

            // --- TEXT TO SPEECH ---
            case 'text_to_speech':
                return await oaiFetch('POST', '/audio/speech', {
                    model: args.model || 'tts-1',
                    input: args.input || args.text,
                    voice: args.voice || 'alloy',
                    response_format: args.format || 'mp3'
                });

            // --- EMBEDDINGS ---
            case 'embed':
                return await oaiFetch('POST', '/embeddings', {
                    model: args.model || 'text-embedding-3-small',
                    input: args.input || args.text
                });

            // --- MODELS ---
            case 'list_models':
                return await oaiFetch('GET', '/models');

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (err) {
        return { error: err.message, stack: err.stack };
    }
}

export const definition = {
    name: 'openai',
    description: 'Direct access to OpenAI APIs: GPT chat, DALL-E image generation, Whisper transcription, TTS, and embeddings. Requires OPENAI_API_KEY.',
    parameters: {
        type: 'object',
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                description: 'The OpenAI operation to perform',
                enum: ['chat', 'generate_image', 'transcribe', 'text_to_speech', 'embed', 'list_models']
            },
            prompt: { type: 'string', description: 'Text prompt for chat or image generation' },
            messages: { type: 'array', description: 'Array of chat messages [{role, content}]' },
            model: { type: 'string', description: 'Model to use (gpt-4o, gpt-4o-mini, dall-e-3, tts-1, whisper-1)' },
            temperature: { type: 'number', description: 'Creativity (0-2, default 0.7)' },
            max_tokens: { type: 'number', description: 'Max output tokens (default 1024)' },
            json_mode: { type: 'boolean', description: 'Enable JSON response format for chat' },
            n: { type: 'number', description: 'Number of images to generate (DALL-E)' },
            size: { type: 'string', description: 'Image size: 1024x1024, 1792x1024, 1024x1792' },
            quality: { type: 'string', description: 'Image quality: standard or hd' },
            style: { type: 'string', description: 'Image style: vivid or natural' },
            input: { type: 'string', description: 'Text input for TTS or embeddings' },
            text: { type: 'string', description: 'Alias for input/prompt' },
            voice: { type: 'string', description: 'TTS voice: alloy, echo, fable, onyx, nova, shimmer' },
            format: { type: 'string', description: 'Audio format: mp3, opus, aac, flac' },
            file: { type: 'string', description: 'Audio file path for transcription' },
            language: { type: 'string', description: 'Language code for transcription (e.g., en, es)' }
        }
    }
};

# OpenAI Manager

## Description
This skill gives you direct access to OpenAI's APIs for chat completions, image generation, speech transcription, text-to-speech, and embeddings.

## Instructions
1. For chat completions, use `action: "chat"` with either a simple `prompt` string or a full `messages` array for multi-turn conversations.
2. For image generation, use `action: "generate_image"` with a descriptive `prompt`. DALL-E 3 supports sizes: `1024x1024`, `1792x1024` (landscape), `1024x1792` (portrait).
3. For text-to-speech, use `action: "text_to_speech"` with `input` text and a `voice` (alloy, echo, fable, onyx, nova, shimmer).
4. Use `json_mode: true` in chat to force the model to return valid JSON. Useful for structured data extraction.
5. For embeddings, use `action: "embed"` with `input` text. Returns a vector for semantic search.
6. If the tool returns an auth error, the user needs to export `OPENAI_API_KEY` from https://platform.openai.com/api-keys.

## Input Variables
{{input}}

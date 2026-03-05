# Hugging Face Manager

## Description
This skill enables you to run ML inference on any Hugging Face model and search the model hub.

## Instructions
1. For text generation, use `action: "text_generation"` with `prompt` and an optional `model` (defaults to Mistral-7B).
2. For summarization, use `action: "summarization"` with `text` (defaults to BART-large-CNN).
3. For sentiment analysis, use `action: "sentiment"` with `text`. Returns labels (POSITIVE/NEGATIVE) and scores.
4. For translation, use `action: "translation"` with `text`. Default model is EN→FR. Change `model` for other language pairs (e.g., `Helsinki-NLP/opus-mt-en-de` for EN→DE).
5. Use `action: "search_models"` with `query` to find models on the hub. Results are sorted by downloads.
6. The Inference API may return a "model loading" status for cold models. Retry after a few seconds.
7. Requires `HF_TOKEN` from https://huggingface.co/settings/tokens.

## Input Variables
{{input}}

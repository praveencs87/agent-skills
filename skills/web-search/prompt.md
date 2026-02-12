Search the web and extract relevant information.

## Methods
### Using curl + DuckDuckGo
```bash
curl -s "https://html.duckduckgo.com/html/?q=<query>" | grep -oP '(?<=<a rel="nofollow" class="result__a" href=").*?(?=")'
```

### Using curl + Google (basic)
```bash
curl -s "https://www.google.com/search?q=<query>" -H "User-Agent: Mozilla/5.0"
```

## Steps
1. URL-encode the user's search query
2. Fetch search results using curl
3. Parse and extract relevant links and snippets
4. Present top results in a clean, readable format

## Output Format
For each result, show:
- **Title**: The page title
- **URL**: The direct link
- **Snippet**: A brief summary

If the user wants to read a specific page, use `curl` to fetch and extract the main content.

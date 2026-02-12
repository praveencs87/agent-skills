Test REST APIs using curl.

## HTTP Methods
- **GET**: `curl -s -X GET "<url>" -H "Content-Type: application/json"`
- **POST**: `curl -s -X POST "<url>" -H "Content-Type: application/json" -d '<json>'`
- **PUT**: `curl -s -X PUT "<url>" -H "Content-Type: application/json" -d '<json>'`
- **DELETE**: `curl -s -X DELETE "<url>"`

## Authentication
- **Bearer Token**: `-H "Authorization: Bearer <token>"`
- **API Key**: `-H "X-API-Key: <key>"`
- **Basic Auth**: `-u username:password`

## Useful Flags
- `-v` — Verbose (show headers)
- `-o /dev/null -w "%{http_code}"` — Show only status code
- `-w "\nTime: %{time_total}s\n"` — Show response time
- `| jq .` — Pretty-print JSON response

## Output
Show a clean summary:
```
✅ GET /api/users → 200 OK (0.12s)
   Response: { "users": [...] }
```

Always pipe JSON through `jq` for readability if available.

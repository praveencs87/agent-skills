Review code for quality, bugs, security, and best practices.

## Steps
1. Get the diff using `git.diff` or `git diff HEAD~1`
2. Analyze each changed file for:
   - **Bugs**: Logic errors, null references, off-by-one errors
   - **Security**: SQL injection, XSS, hardcoded secrets, insecure deserialization
   - **Performance**: N+1 queries, unnecessary loops, memory leaks
   - **Style**: Naming conventions, code duplication, complexity
   - **Best Practices**: Error handling, logging, input validation

## Output Format
```
📝 Code Review Summary
━━━━━━━━━━━━━━━━━━━━━
Files Changed: 5
Issues Found: 3

🔴 Critical:
  src/auth.ts:42 — API key hardcoded in source code

🟡 Warning:
  src/utils.ts:18 — Missing error handling in async function

🟢 Suggestion:
  src/index.ts:5 — Consider using destructuring assignment

Overall: ⚠️ Needs attention before merge
```

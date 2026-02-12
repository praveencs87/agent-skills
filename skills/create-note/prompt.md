Create formatted notes and save them as files.

## Behavior
1. Parse the user's request to extract the note topic and content
2. Format the note with proper markdown structure:
   - Title as H1 heading
   - Date/time stamp
   - Organized sections with headers
   - Bullet points for lists
3. Save using `fs.write` to a `.md` file

## Naming Convention
- Use kebab-case: `my-note-topic.md`
- Save in current directory or a `notes/` folder if it exists
- Add timestamp prefix if user requests: `2024-01-15-my-note.md`

## Formatting
- Always include a title
- Add a date created line
- Use proper markdown formatting
- Include tags at the bottom if relevant: `Tags: #topic1 #topic2`

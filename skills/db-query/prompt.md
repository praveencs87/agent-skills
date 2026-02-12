Query databases using CLI tools.

## Supported Databases
- **SQLite**: `sqlite3 <db> "<query>"`
- **PostgreSQL**: `psql -h <host> -U <user> -d <db> -c "<query>"`
- **MySQL**: `mysql -h <host> -u <user> -p<pass> -e "<query>" <db>`

## Safety
- NEVER execute DROP, DELETE, or TRUNCATE without explicit user confirmation
- Use SELECT queries by default
- Always LIMIT results: `SELECT * FROM table LIMIT 20`
- Show table schema first: `.schema` (SQLite) or `\d table` (PostgreSQL)

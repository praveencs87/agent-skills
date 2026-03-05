# Supabase Manager

## Description
This skill enables you to query Postgres databases, manage auth users, and interact with storage buckets on Supabase.

## Instructions
1. To query data, use `action: "select"` with `table` and optionally `columns` and `filter`. Filters use PostgREST syntax: `"status=eq.active"`, `"age=gt.18"`, `"name=like.*john*"`.
2. To insert data, use `action: "insert"` with `table` and `data` (a JSON object matching the table columns).
3. To update data, use `action: "update"` with `table`, `filter` (to select rows), and `data` (fields to update). **Always include a filter** to avoid updating all rows.
4. To call a Postgres function, use `action: "rpc"` with `function_name` and `params`.
5. Auth management (list/create/delete users) requires `SUPABASE_SERVICE_KEY` (the service role key, not the anon key).
6. PostgREST filter operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `is`, `not`.
7. If the tool returns an error, ensure `SUPABASE_URL` and `SUPABASE_KEY` are exported. Find them in the Supabase dashboard under Settings > API.

## Input Variables
{{input}}

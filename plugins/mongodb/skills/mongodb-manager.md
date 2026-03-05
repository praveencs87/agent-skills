# MongoDB Manager

## Description
This skill enables you to query, insert, update, and aggregate data on MongoDB via the Atlas Data API.

## Instructions
1. Always provide `collection` for every action. `database` defaults to `MONGODB_DATABASE` env var.
2. `filter` uses standard MongoDB query syntax: `{"age": {"$gt": 18}}`, `{"status": "active"}`.
3. `update` uses MongoDB operators: `{"$set": {"name": "new"}}`, `{"$inc": {"count": 1}}`.
4. For complex analytics, use `action: "aggregate"` with a `pipeline` array of stages (`$match`, `$group`, `$sort`, `$project`, etc.).
5. Requires `MONGODB_API_KEY` and `MONGODB_APP_ID`. Enable the Data API in MongoDB Atlas under App Services.

## Input Variables
{{input}}

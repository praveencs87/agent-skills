# Firebase Manager

## Description
This skill enables you to manage Firestore documents, Auth users, and Cloud Storage on Firebase.

## Instructions
1. For Firestore operations, provide `collection` and `doc_id`. Documents are automatically converted to Firestore's internal format.
2. To write data, use `action: "set_doc"` with `data` as a plain JSON object. Nested objects and arrays are supported.
3. Auth operations require `FIREBASE_API_KEY`. Storage and Firestore may need `FIREBASE_TOKEN` or `GOOGLE_ACCESS_TOKEN`.
4. Storage uses the default bucket `<project-id>.appspot.com`. Override with the `bucket` parameter.
5. Required env vars: `FIREBASE_PROJECT_ID` (always), `FIREBASE_API_KEY` (for auth), `FIREBASE_TOKEN` (for authenticated operations).

## Input Variables
{{input}}

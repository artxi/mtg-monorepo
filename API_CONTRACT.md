# API Contract Draft

This document outlines the main API endpoints, request/response formats, and error handling for the Magic: The Gathering Collection App MVP.

---

## Authentication

### POST /api/auth/register
- Request: `{ email, password, displayName }`
- Response: `{ user: User, token: string }`

### POST /api/auth/login
- Request: `{ email, password }`
- Response: `{ user: User, token: string }`

### POST /api/auth/logout
- Request: (token in header)
- Response: `{ success: true }`

---

## Collection Cards

### GET /api/collection
- Request: (token in header)
- Response: `CollectionCard[]`

### POST /api/collection
- Request: `Partial<CollectionCard>` (without _id, userId, createdAt, updatedAt)
- Response: `CollectionCard`

### PUT /api/collection/:id
- Request: `Partial<CollectionCard>` (fields to update)
- Response: `CollectionCard`

### DELETE /api/collection/:id
- Request: (token in header)
- Response: `{ success: true }`

---

## Import Jobs

### POST /api/import
- Request: (file upload, token in header)
- Response: `ImportJob`

### GET /api/import
- Request: (token in header)
- Response: `ImportJob[]`

### GET /api/import/:id
- Request: (token in header)
- Response: `ImportJob`

---

## Error Handling
- All error responses: `{ error: string, details?: any }`

---

Update this contract as endpoints or data shapes evolve.

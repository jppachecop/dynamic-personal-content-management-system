# Dynamic Personal Content Management System - API Documentation

## 📚 Overview

This document provides comprehensive information about the DPCMS REST API. The API is built with TypeScript, Express.js, PostgreSQL, and Prisma ORM, providing a robust backend for managing users, notes, tags, and categories.

## 🌐 Base URL

```
http://localhost:3001
```

## 📖 Interactive Documentation

The API includes a comprehensive Swagger/OpenAPI documentation interface:

- **Swagger UI**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **JSON Spec**: [http://localhost:3001/api-docs.json](http://localhost:3001/api-docs.json)

## 🔗 API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/health` | Server health status |

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users` | Get all users |
| GET    | `/api/users/{id}` | Get user by ID |
| POST   | `/api/users` | Create new user |
| PUT    | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Notes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/notes` | Get all notes (with filters) |
| GET    | `/api/notes/{id}` | Get note by ID |
| GET    | `/api/notes/user/{userId}` | Get notes by user ID |
| POST   | `/api/notes` | Create new note |
| PUT    | `/api/notes/{id}` | Update note |
| DELETE | `/api/notes/{id}` | Delete note |

#### Notes Query Parameters

- `userId` - Filter notes by user ID
- `category` - Filter notes by category name
- `tag` - Filter notes by tag name
- `favorites=true` - Get favorite notes (requires userId)
- `search` - Search notes by title/content (requires userId)

### Tags API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/tags` | Get all tags |
| GET    | `/api/tags/{id}` | Get tag by ID |
| POST   | `/api/tags` | Create new tag |
| PUT    | `/api/tags/{id}` | Update tag |
| PUT    | `/api/tags/{id}/increment` | Increment tag count |
| PUT    | `/api/tags/{id}/decrement` | Decrement tag count |
| POST   | `/api/tags/update-counts` | Update all tag counts |
| DELETE | `/api/tags/{id}` | Delete tag |

#### Tags Query Parameters

- `popular=true` - Get popular tags only
- `limit` - Limit number of popular tags (default: 10)

### Categories API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/categories` | Get all categories |
| GET    | `/api/categories/{id}` | Get category by ID |
| GET    | `/api/categories/{id}/usage` | Get category usage count |
| POST   | `/api/categories` | Create new category |
| PUT    | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

#### Categories Query Parameters

- `withUsage=true` - Include usage statistics

## 📋 Data Models

### User

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "avatar": "string | null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Note

```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "tags": ["string"],
  "category": "string",
  "userId": "uuid",
  "isFavorite": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Tag

```json
{
  "id": "uuid",
  "name": "string",
  "color": "#RRGGBB",
  "count": "integer"
}
```

### Category

```json
{
  "id": "uuid",
  "name": "string",
  "color": "#RRGGBB",
  "icon": "string"
}
```

## 📝 Request/Response Format

### Standard Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "data": any,           // Present on successful requests
  "error": "string",     // Present on failed requests
  "message": "string"    // Optional additional message
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input or missing required fields |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error - Server-side error |

### Validation Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "data": [
    {
      "type": "field",
      "value": "invalid_value",
      "msg": "Error message",
      "path": "field_name",
      "location": "body"
    }
  ]
}
```

## 🔧 Usage Examples

### Create a User

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

### Create a Note

```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my note",
    "tags": ["personal", "important"],
    "category": "Work",
    "userId": "user-uuid-here",
    "isFavorite": false
  }'
```

### Search Notes

```bash
curl "http://localhost:3001/api/notes?search=important&userId=user-uuid-here"
```

### Get Popular Tags

```bash
curl "http://localhost:3001/api/tags?popular=true&limit=5"
```

## 🛡️ Security Features

- **Input Validation**: All endpoints validate input using express-validator
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Type Safety**: Full TypeScript type checking
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 🚀 Getting Started

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Access the documentation**:
   - Open [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
   - Try the interactive API explorer

3. **Test the health endpoint**:
   ```bash
   curl http://localhost:3001/health
   ```

## 📊 Features

- ✅ **Complete CRUD Operations** for all resources
- ✅ **Advanced Filtering** and search capabilities
- ✅ **Relationship Management** between users, notes, tags, and categories
- ✅ **Usage Tracking** for tags and categories
- ✅ **Favorites System** for notes
- ✅ **Type-Safe Database Operations** with Prisma
- ✅ **Comprehensive Error Handling**
- ✅ **Input Validation** and sanitization
- ✅ **Interactive API Documentation**

## 🔄 Database Schema

The API uses PostgreSQL with the following main tables:

- **users**: User accounts and profiles
- **notes**: User-generated content with tags and categories
- **tags**: Reusable labels with usage tracking
- **categories**: Content organization with usage statistics

All tables use UUID primary keys and include automatic timestamp tracking.

## 📞 Support

For questions or issues with the API:

1. Check the interactive documentation at `/api-docs`
2. Review the error messages in API responses
3. Check the server logs for detailed error information
4. Refer to this documentation for endpoint specifications

---

**Note**: This API is designed to replace the IndexedDB implementation with a robust server-side solution while maintaining the same functionality and improving performance, reliability, and scalability.

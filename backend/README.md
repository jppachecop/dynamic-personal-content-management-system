# Dynamic Personal Content Management System - Backend API

A TypeScript + Express API with PostgreSQL database for managing users, notes, tags, and categories. This backend replaces the IndexedDB implementation with a robust server-side solution.

## 🚀 Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **PostgreSQL**: Reliable relational database with advanced features
- **Prisma ORM**: Type-safe database access with auto-generated client
- **Repository Pattern**: Clean separation of data access logic
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **CORS Support**: Configurable cross-origin resource sharing
- **Security**: Helmet.js for security headers
- **Logging**: Morgan for HTTP request logging
- **Compression**: Gzip compression for responses

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sgcpd_database
   DB_USER=your_username
   DB_PASSWORD=your_password

   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   ```

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE sgcpd_database;
   ```

5. **Generate Prisma client:**
   ```bash
   npm run generate
   ```

6. **Run database migrations:**
   ```bash
   npm run migrate
   ```

7. **Seed the database with sample data (optional):**
   ```bash
   npm run db:seed
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3001` with hot reloading.

### Production Mode
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Health Check
- **GET** `/health` - Server health status

### Users
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get user by ID
- **POST** `/users` - Create new user
- **PUT** `/users/:id` - Update user
- **DELETE** `/users/:id` - Delete user

### Notes
- **GET** `/notes` - Get all notes (supports query parameters)
- **GET** `/notes/:id` - Get note by ID
- **GET** `/notes/user/:userId` - Get notes by user ID
- **POST** `/notes` - Create new note
- **PUT** `/notes/:id` - Update note
- **DELETE** `/notes/:id` - Delete note

#### Query Parameters for GET /notes:
- `userId` - Filter by user ID
- `category` - Filter by category
- `tag` - Filter by tag
- `favorites=true` - Get only favorite notes
- `search` - Search in title and content

### Tags
- **GET** `/tags` - Get all tags
- **GET** `/tags/:id` - Get tag by ID
- **POST** `/tags` - Create new tag
- **PUT** `/tags/:id` - Update tag
- **PUT** `/tags/:id/increment` - Increment tag count
- **PUT** `/tags/:id/decrement` - Decrement tag count
- **POST** `/tags/update-counts` - Update all tag counts
- **DELETE** `/tags/:id` - Delete tag

#### Query Parameters for GET /tags:
- `popular=true` - Get popular tags
- `limit` - Limit number of results (used with popular)

### Categories
- **GET** `/categories` - Get all categories
- **GET** `/categories/:id` - Get category by ID
- **GET** `/categories/:id/usage` - Get category usage count
- **POST** `/categories` - Create new category
- **PUT** `/categories/:id` - Update category
- **DELETE** `/categories/:id` - Delete category

#### Query Parameters for GET /categories:
- `withUsage=true` - Include usage count for each category

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notes Table
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tags Table
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL,
  count INTEGER DEFAULT 0
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL,
  icon VARCHAR(50) NOT NULL
);
```

## 🔧 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma            # Prisma database schema
│   └── seed.ts                  # Database seeding script
├── src/
│   ├── config/
│   │   └── prisma.ts            # Prisma client configuration
│   ├── middleware/
│   │   ├── errorHandler.ts      # Error handling middleware
│   │   └── validation.ts        # Input validation middleware
│   ├── repositories/
│   │   ├── UserRepository.ts    # User data access layer (Prisma)
│   │   ├── NoteRepository.ts    # Note data access layer (Prisma)
│   │   ├── TagRepository.ts     # Tag data access layer (Prisma)
│   │   └── CategoryRepository.ts # Category data access layer (Prisma)
│   ├── routes/
│   │   ├── users.ts             # User API routes
│   │   ├── notes.ts             # Note API routes
│   │   ├── tags.ts              # Tag API routes
│   │   └── categories.ts        # Category API routes
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── server.ts                # Express server setup
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🔄 Migration from IndexedDB

This API provides equivalent functionality to your IndexedDB implementation with significant improvements:

### IndexedDB → PostgreSQL + Prisma Mapping
- **IndexedDB stores** → **PostgreSQL tables** (managed by Prisma)
- **IndexedDB indexes** → **PostgreSQL indexes** (defined in Prisma schema)
- **Client-side operations** → **REST API endpoints** (with Prisma ORM)

### Key Differences
1. **Server-side**: Data is now stored on the server instead of client browser
2. **Multi-user**: Supports multiple users with proper data isolation
3. **Scalable**: Can handle much larger datasets
4. **Reliable**: ACID compliance and data durability
5. **Searchable**: Advanced search capabilities with PostgreSQL
6. **Type-safe**: Prisma provides full TypeScript type safety
7. **Auto-generated**: Database client is automatically generated from schema
8. **Migration system**: Database schema changes are versioned and managed

### Prisma ORM Benefits
- **Type Safety**: Auto-generated TypeScript types from database schema
- **IntelliSense**: Full IDE support with auto-completion
- **Query Builder**: Intuitive and type-safe query building
- **Migration System**: Version-controlled database schema changes
- **Database Introspection**: Generate schema from existing database
- **Multiple Database Support**: Easy switching between database providers
- **Connection Pooling**: Built-in connection management
- **Prisma Studio**: Visual database browser and editor

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "data": [] // Optional validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: All inputs are validated
- **SQL Injection Prevention**: Parameterized queries
- **Error Sanitization**: No sensitive data in error responses

## 🧪 Development

### Adding New Features
1. Create/update types in `src/types/index.ts`
2. Add repository methods in appropriate repository file
3. Create/update routes with validation
4. Update migration script if schema changes are needed

### Database Operations
```bash
# Generate Prisma client
npm run generate

# Run migrations (development)
npm run migrate

# Deploy migrations (production)
npm run migrate:deploy

# Reset database (development only)
npm run migrate:reset

# Push schema changes without migrations
npm run db:push

# Seed database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Connect to database (if you have psql)
psql -h localhost -U your_username -d sgcpd_database
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper type definitions
3. Include input validation for all endpoints
4. Write descriptive commit messages
5. Test your changes thoroughly

## 📝 License

MIT License - see LICENSE file for details

# Backend Server

This is the Express backend server for authentication using NeonDB.

## Setup

1. Create a `.env` file in the `server` directory with the following variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_GtZ2snvh0qfQ@ep-dry-violet-a4luuynu-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3001
FRONTEND_URL=http://localhost:8080
```

2. The database schema will be automatically initialized when the server starts.

## Running the Server

- Development mode (with auto-reload): `npm run dev:server`
- Production mode: `npm run server`

The server will run on port 3001 by default.

## API Endpoints

- `POST /api/auth/signup` - Sign up a new user
- `POST /api/auth/signin` - Sign in an existing user
- `GET /api/auth/me` - Get current user (requires authentication)
- `GET /health` - Health check endpoint


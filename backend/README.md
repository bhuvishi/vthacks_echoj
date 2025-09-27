# Echo Journal Backend API

A Node.js/Express backend API for the Echo Journal application.

## Features

- **Authentication**: JWT-based authentication with signup, login, logout
- **Journal Entries**: CRUD operations for journal entries
- **User Management**: Profile management and preferences
- **Security**: Rate limiting, CORS, helmet security headers
- **Validation**: Input validation using express-validator

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in your .env file).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### Journal Entries
- `GET /api/journal/entries` - Get all user entries
- `GET /api/journal/entries/:id` - Get specific entry
- `POST /api/journal/entries` - Create new entry
- `PUT /api/journal/entries/:id` - Update entry
- `DELETE /api/journal/entries/:id` - Delete entry
- `GET /api/journal/entries/date-range` - Get entries by date range
- `GET /api/journal/stats` - Get journal statistics

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Delete user account
- `PUT /api/user/preferences` - Update user preferences
- `GET /api/user/dashboard` - Get dashboard data
- `PUT /api/user/journal-frequency` - Update journal frequency

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Data Storage

Currently uses in-memory storage for demo purposes. This will be replaced with MongoDB in the future.

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend URL
- **Helmet**: Security headers
- **Input Validation**: All inputs are validated
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication

## Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## Development

The backend is designed to work with the Echo Journal frontend. Make sure to:

1. Set the correct `FRONTEND_URL` in your `.env` file
2. Use the same JWT secret for token validation
3. Ensure CORS is properly configured for your frontend URL

## Future Enhancements

- MongoDB integration
- File upload for voice notes
- Email notifications
- Advanced analytics and insights
- Social features

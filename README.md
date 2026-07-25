# VaultX - Secure API Key Manager

VaultX is a modern, responsive, and highly secure web application that allows developers to securely store, organize, search, manage, and access their API keys.

## Features

- **Secure Encryption**: API Keys are encrypted using AES-256 before being stored in the database.
- **JWT Authentication**: Secure user authentication with JSON Web Tokens.
- **Beautiful UI**: Modern glassmorphism design with Dark/Light mode support.
- **Management**: Add, Edit, Delete, and Favorite your API keys.
- **Organization**: Categorize and tag your keys, label environments (Staging, Prod, etc).
- **Security Features**: Express Rate Limit, Helmet, bcrypt password hashing.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas Connection URI)

### Environment Variables

**Backend (`server/.env`)**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/vaultx
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```
*Note: `ENCRYPTION_KEY` must be a 64-character hex string (32 bytes).*

### Setup Steps

1. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the Application**
   Open two terminals:
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Security Considerations
- Ensure that the `.env` file is never committed to version control.
- In production, set `NODE_ENV=production` and ensure the `FRONTEND_URL` is set correctly for CORS.
- Generate strong, random strings for `JWT_SECRET` and `ENCRYPTION_KEY`.

## Author
Built by Antigravity

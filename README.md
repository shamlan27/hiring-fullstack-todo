# hiring-fullstack-todo

A full-stack TODO application built with React, Node.js/Express, and MongoDB.

## Project Structure

```
hiring-fullstack-todo/
├── client/       # React frontend (Vite)
├── server/       # Express backend
└── package.json  # Monorepo root (npm workspaces)
```

## Quick Start (Monorepo)

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Install all dependencies
```bash
npm install
```

### 2. Configure the backend
```bash
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI
```

### 3. Run both servers concurrently
```bash
npm run dev
```

This starts:
- **Backend** at `http://localhost:5000`
- **Frontend** at `http://localhost:5173`

---

See individual `README.md` files in `client/` and `server/` for more details.

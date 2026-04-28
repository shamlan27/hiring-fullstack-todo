# TODO App — Backend

Express.js REST API backed by MongoDB via Mongoose.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
```

#### Using MongoDB Atlas
Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb://admin:<PASSWORD_IF_NEED_EMAIL>@ac-mihelbh-shard-00-00.mj08qrk.mongodb.net:27017,ac-mihelbh-shard-00-01.mj08qrk.mongodb.net:27017,ac-mihelbh-shard-00-02.mj08qrk.mongodb.net:27017/?ssl=true&replicaSet=atlas-aqsinu-shard-0&authSource=admin&appName=Cluster0
```

### 3. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`.

---

## API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/todos            | Get all todos            |
| POST   | /api/todos            | Create a new todo        |
| PUT    | /api/todos/:id        | Update title/description |
| PATCH  | /api/todos/:id/done   | Toggle done status       |
| DELETE | /api/todos/:id        | Delete a todo            |

### Example payloads

**POST /api/todos**
```json
{ "title": "Buy groceries", "description": "Milk, eggs, bread" }
```

**PUT /api/todos/:id**
```json
{ "title": "Updated title", "description": "Updated description" }
```

---

## Data Model

```json
{
  "_id": "ObjectId",
  "title": "string (required, max 200 chars)",
  "description": "string (optional, max 1000 chars)",
  "done": "boolean (default: false)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## Assumptions & Limitations

- No authentication — all todos are shared/public in this implementation.
- `PATCH /:id/done` toggles the current `done` state server-side (no body required).
- MongoDB must be running before starting the server; the process exits on connection failure.

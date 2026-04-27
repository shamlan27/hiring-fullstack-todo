# TODO App — Frontend

React frontend built with Vite. Communicates with the Express backend via `/api`.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run the dev server
```bash
npm run dev
```

The app runs at `http://localhost:5173`.

> API calls to `/api/*` are automatically proxied to `http://localhost:5000` via Vite's dev server proxy — no CORS issues during development.

### 3. Build for production
```bash
npm run build
```

Output goes to `dist/`. Serve with `npm run preview` or any static file server.

---

## Features

- **View todos** — all tasks listed, newest first
- **Add todo** — form with title (required) and description (optional), with character-count hints
- **Edit todo** — inline editing with validation
- **Toggle done** — circular checkbox; completed tasks shown with strikethrough
- **Delete todo** — with a confirmation prompt
- **Filter tabs** — All / Active / Done
- **Progress bar** — visual completion percentage
- **Optimistic UI** — state updates instantly; rolled back on error
- **Form validation** — client-side checks with clear error messages
- **Loading & error states** — spinner on load, error banner with retry button
- **Animations** — tasks fade in on add, shake on validation error

---

## Assumptions & Limitations

- No authentication — todos are shared/public in this implementation.
- The Vite proxy (`/api → localhost:5000`) is only active in development mode. For production, set up a reverse proxy (e.g. nginx) or deploy client and server under the same origin.
- Browser `confirm()` is used for delete confirmation — could be replaced with a custom modal for a more polished UX.

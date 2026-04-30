# Team Task Manager

Minimal MERN stack app for team project and task management.

## Features

- JWT signup and login
- Roles: Admin and Member
- Admin can create projects, add/remove members, and create tasks
- Member can view assigned tasks and update task status only
- Simple dashboard with task counts and overdue tasks

## Folder Structure

- `backend` - Express API with MongoDB/Mongoose
- `frontend` - React app built with Vite

## Prerequisites

- Node.js 18+
- MongoDB Atlas or Railway MongoDB plugin

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your MongoDB connection string and JWT secret.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Set `VITE_API_URL` to your backend URL.

### 3. Run locally

In two terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects/:id/members`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks?projectId=:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id/status`

### Dashboard

- `GET /api/dashboard/stats`

## Demo Credentials

Demo users are auto-seeded on backend startup when missing.

- Admin
  - Email: `admin@taskmanager.local`
  - Password: `Admin123!`
- Member
  - Email: `member@taskmanager.local`
  - Password: `Member123!`

## Deployment

### Backend on Railway

1. Create a new Railway service from the `backend` folder.
2. Add environment variables:

- `MONGODB_URI` or the MongoDB URL variable from your Railway database plugin
- `JWT_SECRET`
- `CLIENT_URL`
- `PORT` can stay managed by Railway

3. Start command: `npm start`
4. If the backend still crashes with `MONGODB_URI is required`, open the backend service in Railway and confirm the variable exists on the backend service itself, not only on the database service.
5. Redeploy the backend after saving variables.

### Frontend on Railway or Vercel

1. Deploy the `frontend` folder.
2. Add environment variable:
   - `VITE_API_URL`
3. Build command: `npm run build`
4. Output directory: `dist`

## Notes

- Signup creates Member accounts by default.
- Admin accounts are intended to be seeded or created manually in the database.
- The app uses localStorage for the JWT token to keep the implementation minimal.

# 🔐 Vaulted

> A secure, full-stack notes app with JWT authentication — built with the MERN stack.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- **JWT Authentication** — Access tokens (15min) + Refresh tokens (7 days) with automatic silent refresh
- **Session Management** — Multi-device session tracking with logout and logout-all support
- **Private Notes** — Every note is tied to its owner; users can only access their own notes
- **Full CRUD** — Create, read, update, and delete notes with instant UI updates
- **Protected Routes** — Frontend route guards redirect unauthenticated users to login
- **Persistent Sessions** — httpOnly refresh token cookie keeps users logged in across browser restarts
- **Responsive UI** — Dark-themed, mobile-friendly interface built with Tailwind CSS

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router v6 |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT (jsonwebtoken), bcrypt-style SHA-256 hashing, httpOnly cookies |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
vaulted/
├── backend/
│   └── src/
│       ├── controllers/
│       │   └── auth.controller.js   # Auth + Notes logic
│       ├── middleware/
│       │   └── auth.middleware.js   # JWT protect middleware
│       ├── models/
│       │   ├── user.model.js
│       │   ├── note.model.js
│       │   └── session.model.js
│       ├── routes/
│       │   └── auth.route.js
│       ├── config/
│       │   └── config.js
│       └── app.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── url.js               # Axios instance with interceptors
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── NoteCard.jsx
        │   ├── Noteform.jsx
        │   └── PrivateRoute.jsx
        ├── context/
        │   ├── AuthContext.jsx      # Auth state + login/logout
        │   └── NoteContext.jsx      # Notes state + CRUD
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Home.jsx
            └── Createnote.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/vaulted.git
cd vaulted
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
PORT=3000
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🔑 Auth Flow

```
Register / Login
    → Backend returns accessToken (15min) + sets refreshToken cookie (7 days)
    → Frontend stores accessToken in localStorage

Every API request
    → Axios interceptor attaches Authorization: Bearer <token>

Access token expires
    → Response interceptor catches 401
    → Silently calls /refresh-token using the cookie
    → Gets new accessToken, retries original request

Refresh token expires
    → User is logged out and redirected to /login
```

---

## 📡 API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get tokens |
| GET | `/api/auth/get-me` | Get current user info |
| GET | `/api/auth/refresh-token` | Refresh the access token |
| GET | `/api/auth/logout` | Logout current session |
| GET | `/api/auth/logout-all` | Logout all sessions |

### Notes (all protected 🔒)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/create-note` | Create a new note |
| GET | `/api/auth/get-notes` | Get all notes for current user |
| PUT | `/api/auth/update-note/:id` | Update a note |
| DELETE | `/api/auth/delete-note/:id` | Delete a note |

---

## 🌍 Deployment

| Service | Purpose | URL |
|---|---|---|
| Vercel | Frontend hosting | `https://your-app.vercel.app` |
| Render | Backend hosting | `https://your-app.onrender.com` |
| MongoDB Atlas | Database | Cloud-hosted |

### Environment variables for production

**Render (backend):**
```env
MONGO_URI=your_atlas_uri
JWT_SECRET=your_secret
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Vercel (frontend):**
```env
VITE_BACKEND_URL=https://your-app.onrender.com/api/auth/
```

---

## 📸 Screenshots

> Add screenshots here after deployment

---

## 📄 License

MIT — feel free to use, modify, and build on this project.

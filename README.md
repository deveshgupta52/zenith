# Zenith - Modern Productivity Platform

Zenith is a premium, full-stack productivity and project management application designed to streamline team workflows. It features a sleek, glassmorphism-inspired "Light Mode" aesthetic and provides comprehensive tools for tracking projects, tasks, and team performance.

## 🚀 Live Demo
[Link to your Railway Deployment URL here]

---

## ✨ Features

- **Intuitive Dashboard**: Real-time analytics showing task distribution, priority breakdowns, and status tracking using Chart.js.
- **Project Management**: Create and manage project folders with dedicated team assignments and deadlines.
- **Task System**: Detailed task management within projects, including status toggles, priority levels, and overdue alerts.
- **Member-Specific Views**: Team members can view and manage their assigned tasks across all projects in a unified "My Tasks" view.
- **Secure Authentication**: Robust JWT-based authentication with secure cookie storage.
- **Premium UI/UX**: Built with React and TailwindCSS, featuring smooth animations, glassmorphic containers, and a clean, professional aesthetic.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, TailwindCSS, Lucide React, Chart.js, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **State Management**: React Hooks / Redux (where applicable).
- **Authentication**: JSON Web Tokens (JWT), Cookie-parser.

---

## 💻 Local Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB instance

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root and add your configuration:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` root:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment (Railway)

This project is optimized for deployment on **Railway**.

1. **GitHub**: Push your code to a GitHub repository.
2. **Railway**: Login to Railway and click "New Project".
3. **Services**:
   - **Backend**: Point to the `/backend` directory. Add Environment Variables from your `.env` file. Railway will automatically detect the Node.js environment.
   - **Frontend**: Point to the `/frontend` directory. Add `VITE_API_URL` pointing to your backend service URL. Railway will build the Vite app and serve it.
4. **CORS**: Ensure the `FRONTEND_URL` in your backend environment variables matches your deployed frontend URL.

---

## 📄 License
This project was developed for the Ethara AI Technical Assessment.

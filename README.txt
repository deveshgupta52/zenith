ZENITH - MODERN PRODUCTIVITY PLATFORM
====================================

Zenith is a premium, full-stack productivity and project management application.

FEATURES:
- Intuitive Dashboard with Real-time analytics.
- Project Management (Create, Edit, Delete).
- Task System within projects.
- Member-Specific "My Tasks" view.
- Secure JWT Authentication.
- Premium Glassmorphic UI/UX.

TECH STACK:
- Frontend: React.js, Vite, TailwindCSS.
- Backend: Node.js, Express.js.
- Database: MongoDB.

LOCAL SETUP:

1. Backend:
   - cd backend
   - npm install
   - Configure .env (PORT, MONGODB_URI, JWT_SECRET, FRONTEND_URL)
   - npm run dev

2. Frontend:
   - cd frontend
   - npm install
   - Configure .env (VITE_API_URL)
   - npm run dev

DEPLOYMENT (RAILWAY):
1. Push to GitHub.
2. New Project on Railway.
3. Add Backend service (/backend).
4. Add Frontend service (/frontend).
5. Set environment variables.

Developed for Ethara AI Technical Assessment.

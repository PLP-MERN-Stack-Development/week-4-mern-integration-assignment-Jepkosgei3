Task Manager Application
Project Overview
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing tasks with user authentication using JWT tokens. Users can register, log in, create/edit/delete tasks, organize tasks by categories, and upload attachments or add comments.
Setup Instructions

Prerequisites:
Node.js (v18+)
MongoDB (local or MongoDB Atlas)


Server Setup:
Navigate to server/:cd server
npm install


Copy server/.env.example to server/.env and set:MONGO_URI=mongodb://localhost/task-manager
PORT=5000
JWT_SECRET=your_jwt_secret


Start server:npm run dev




Client Setup:
Navigate to client/:cd client
npm install


Copy client/.env.example to client/.env and set:VITE_API_URL=http://localhost:5000


Start client:npm run dev




Access:
Open http://localhost:5173 in your browser.



API Documentation
Authentication

POST /api/auth/register: Register a user
Body: { "username": "string", "email": "string", "password": "string" }
Response: { token, user: { id, username, email } }


POST /api/auth/login: Login a user
Body: { "email": "string", "password": "string" }
Response: { token, user: { id, username, email } }



Tasks

GET /api/tasks: Get all tasks for authenticated user
GET /api/tasks/:id: Get a specific task
POST /api/tasks: Create a task
Body: { "title": "string", "description": "string", "dueDate": "ISO date", "status": "todo|in-progress|done", "category": "categoryId" }


PUT /api/tasks/:id: Update a task
DELETE /api/tasks/:id: Delete a task
POST /api/tasks/:id/attachments: Upload attachment
Body: Form-data with file


POST /api/tasks/:id/comments: Add comment
Body: { "text": "string" }



Categories

GET /api/categories: Get all categories for authenticated user
POST /api/categories: Create a category
Body: { "name": "string" }



Features Implemented

User authentication with JWT tokens
Task CRUD operations
Task categorization
File uploads for task attachments
Task comments
Responsive UI with Tailwind-like styling
Error handling and input validation

Screenshots
(TODO: Add screenshots of login page, task list, task details, etc.)
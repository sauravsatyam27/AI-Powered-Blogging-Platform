# 📝 AI-Powered Blogging Platform (MERN Stack)

A full-stack **AI-powered blogging platform** built using the **MERN stack** where users can read blogs and add comments, while admins can manage blogs, comments, and generate content using AI.

The project includes **authentication, role-based admin access, rich text editing, AI content generation, image uploads, and dashboard analytics**.

---

## 🚀 Features

### 🌐 Public Features
- View published blogs
- Read blog details with rich text formatting
- Add comments (admin approval required)
- Search blogs by keywords
- Responsive UI

### 🔐 Admin Features
- Secure admin login (JWT-based authentication)
- Dashboard with:
  - Total blogs
  - Total comments
  - Draft blogs count
- Add new blogs with:
  - Rich text editor (Quill)
  - Image upload
  - Category selection
  - Publish / Draft toggle
- AI-powered blog content generation
- Approve / delete user comments
- Publish / unpublish blogs
- Delete blogs (with cascading comment deletion)

### 🤖 AI Integration
- Generate blog content using **Google Gemini AI**
- Converts AI-generated Markdown → HTML
- Directly inserts content into the editor

---

## 🛠 Tech Stack

### Frontend
- **React.js**
- **React Router v6**
- **Context API** (global state)
- **Tailwind CSS**
- **React Hot Toast**
- **Quill Rich Text Editor**
- **Moment.js**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Multer** (file uploads)
- **ImageKit** (cloud image storage)

### AI
- **Google Gemini API**
- **Marked** (Markdown → HTML)

---

## 📂 Project Structure

project-root/
│
├── client/ # Frontend (React)
│ ├── src/
│ │ ├── assets/
│ │ ├── component/
│ │ │ ├── admin/
│ │ │ └── common components
│ │ ├── context/
│ │ │ └── AppContext.jsx
│ │ ├── pages/
│ │ │ ├── admin/
│ │ │ └── public pages
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── index.css
│
├── server/ # Backend (Node + Express)
│ ├── config/
│ │ ├── db.js
│ │ ├── imageKit.js
│ │ └── gemini.js
│ ├── controllers/
│ ├── middleware/
│ │ └── auth.js
│ ├── models/
│ ├── routes/
│ └── server.js
│
└── README.md


---

## 🔐 Authentication Flow (Admin)

1. Admin logs in using credentials from `.env`
2. Backend generates a **JWT token**
3. Token is stored in:
   - `localStorage`
   - Axios default headers
4. Protected admin routes are accessible only with a valid token
5. Token expiry is handled using Axios interceptors

---

## 📊 Admin Dashboard Flow

- `/admin` route:
  - If token exists → Admin Layout + Dashboard
  - If token missing → Login page
- Layout uses `<Outlet />` to render nested admin routes
- Sidebar enables navigation between:
  - Dashboard
  - Add Blog
  - Blog List
  - Comments

---

## 🖼 Image Upload Flow

1. Admin uploads thumbnail (Multer)
2. Image temporarily stored on server
3. Uploaded to **ImageKit**
4. Temporary file deleted from server
5. Image URL saved in MongoDB

---

## ✍️ Blog Editor (Quill)

- Rich text editor for blog content
- Fixed height with internal scroll
- AI-generated content is injected directly
- Content is saved as HTML

---

## 🧠 AI Content Generation Flow

1. Admin enters blog title
2. Clicks **Generate with AI**
3. Backend calls Gemini API
4. AI returns Markdown content
5. Markdown converted to HTML
6. HTML inserted into Quill editor

---

## 🧾 Environment Variables

### Backend (`.env`)
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strongpassword

IMAGEKIT_PUBLIC_KEY=xxx
IMAGEKIT_PRIVATE_KEY=xxx
IMAGEKIT_URL_ENDPOINT=xxx

GEMINI_API_KEY=your_gemini_api_key
Frontend (.env)
VITE_BASE_URL=http://localhost:3000
▶️ Running the Project Locally
1️⃣ Backend
cd server
npm install
npm run dev
2️⃣ Frontend
cd client
npm install
npm run dev
>>>>>>> 32a7e80 (Initial commit: AI Powered Blogging Platform)

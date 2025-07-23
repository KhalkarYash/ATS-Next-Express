# 🧠 ATS - Applicant Tracking System

A modern, full-stack **Applicant Tracking System (ATS)** built using **Next.js (Frontend)** and **Express.js + MongoDB (Backend)**. The platform allows HR/Admins to post jobs, and applicants to apply, upload resumes, and track their application status. It includes user authentication, role-based access, and resume parsing support.

> 🔗 **Live Preview**: [_Coming Soon_]()
> 📦 **Backend Repo**: [Express + MongoDB](https://github.com/KhalkarYash/ATS-Next-Express)

---

## 📁 Project Structure

```
ats/
├── client/               # Next.js frontend (soon)
├── server/               # Express.js backend
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── middlewares/      # Auth & error middleware
│   └── utils/            # Utility functions (e.g., JWT)
└── README.md             # You're here!
```

---

## 🚀 Features

### 👥 Authentication

- JWT-based login and signup
- Role-based access: `applicant`, `hr`, `admin`

### 💼 Job Module

- HR/Admin can create, update, delete job postings
- Applicants can view and apply to jobs

### 📄 Resume Management

- Resume upload (PDF)
- Stored via Multer + GridFS (or disk)

### 📬 Application Tracking

- Apply for jobs
- Track application status (`applied`, `reviewed`, `interview`, etc.)

### 📊 Admin Dashboard (Optional)

- View stats, users, and jobs (Coming Soon)

---

## ⚙️ Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) _(Soon)_
- Tailwind CSS _(Planned)_

### Backend

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) for auth
- [Multer](https://github.com/expressjs/multer) for file uploads
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing

---

## 🛠️ Installation & Setup

```bash
# Clone the repo
$ git clone https://github.com/KhalkarYash/ATS-Next-Express
$ cd ATS-Next-Express/server

# Install dependencies
$ npm install

# Create .env file
$ touch .env
```

### ✏️ .env File Example

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ats
JWT_SECRET=your_jwt_secret
```

### 🚀 Run Server

```bash
npm run dev
```

---

## 🧪 API Overview

API endpoints follow REST conventions.

- `/api/auth/register`, `/login`
- `/api/jobs`, `/jobs/:id`
- `/api/resumes/upload`
- `/api/applications`, `/applications/:id`
- `/api/pipeline/:appId` _(optional)_

➡️ [View Full API Spec in Project Files](./server/routes)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Yash Khalkar**  
📧 [LinkedIn](https://www.linkedin.com/in/yashkhalkar)  
📦 [GitHub](https://github.com/KhalkarYash)

# 📌 Applicant Tracking System (ATS) — Project Blueprint

---

## 🧩 ER Diagram (Text-Based Structure)

```
ATS System
├── Authentication & Authorization
│   ├── Login/Register (Applicant, HR/Admin)
│   └── Role-Based Access Control
│
├── Job Management (HR/Admin)
│   ├── Create Job
│   ├── Edit Job
│   ├── View All Jobs (with filters)
│   └── Delete Job
│
├── Application Management (Applicant)
│   ├── Apply to Job (Resume Upload)
│   ├── View Applied Jobs & Status
│   └── Withdraw Application
│
├── Candidate Management (HR/Admin)
│   ├── View All Applicants per Job
│   ├── View Resume
│   ├── Move Across Pipeline Stages
│   └── Rate / Score / Comment
│
├── Application Workflow
│   ├── Pipeline: Applied → Reviewed → Interview → Offer → Hired
│   └── Visual Board (Kanban-style UI)
│
├── Resume Viewer & Parser (Optional)
│   ├── View Resume PDF in-app
│   └── (Bonus) Extract keywords and rank applicants
│
├── Notifications (Optional)
│   ├── Email confirmation
│   └── Status change notifications
│
└── Admin Dashboard
    ├── Total Jobs Posted
    ├── Applications Count
    └── User Overview
```

---

## 🧠 ER Entities and Relationships

```
┌──────────────┐          ┌──────────────┐
│    Users     │◄────┐    │   Resumes    │
│──────────────│     │    └──────────────┘
│ id (PK)      │     │
│ name         │     │    ┌──────────────┐
│ email        │     ├───▶│ Applications │
│ password     │     │    │──────────────│
│ role         │     └───▶│ id (PK)      │
└──────────────┘          │ user_id (FK) │
                          │ job_id (FK)  │
                          │ resume_id(FK)│
                          │ status       │
                          │ rating       │
                          │ comments     │
                          └──────────────┘

┌──────────────┐
│   Jobs       │◄────────────────┐
│──────────────│                 │
│ id (PK)      │                 │
│ title        │                 │
│ description  │                 │
│ posted_by_id │ (FK to Users)  │
│ location     │                 │
│ created_at   │                 │
└──────────────┘                 │
                                 │
                          ┌──────┴───────┐
                          │ PipelineLogs │ (optional)
                          │──────────────│
                          │ id (PK)      │
                          │ application_id (FK) │
                          │ from_status  │
                          │ to_status    │
                          │ changed_at   │
                          └──────────────┘
```

---

## 🌐 API Endpoint Structure

### 🧑‍💼 Auth & User Management

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Register a new user        |
| POST   | `/api/auth/login`    | Login and get JWT token    |
| GET    | `/api/users/me`      | Get current logged-in user |
| PUT    | `/api/users/:id`     | Update user profile        |
| DELETE | `/api/users/:id`     | Delete user account        |

### 📄 Job Management (HR/Admin)

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| POST   | `/api/jobs`     | Create a new job post       |
| GET    | `/api/jobs`     | Get all jobs (with filters) |
| GET    | `/api/jobs/:id` | Get job details by ID       |
| PUT    | `/api/jobs/:id` | Edit a job                  |
| DELETE | `/api/jobs/:id` | Delete a job                |

### 📑 Resume Management (Applicant)

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | `/api/resumes/upload`   | Upload a resume (file upload) |
| GET    | `/api/resumes/:id/view` | View a resume PDF             |

### 📬 Application Management

| Method | Endpoint                | Description                            |
| ------ | ----------------------- | -------------------------------------- |
| POST   | `/api/applications`     | Apply for a job (attach resume ID)     |
| GET    | `/api/applications`     | Get all applications (admin/hr)        |
| GET    | `/api/applications/my`  | Get logged-in applicant’s applications |
| GET    | `/api/applications/:id` | Get specific application details       |
| PUT    | `/api/applications/:id` | Update status, rating, comments (HR)   |
| DELETE | `/api/applications/:id` | Withdraw/delete application            |

### 📊 Pipeline Tracking (Optional)

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | `/api/pipeline/:appId`        | Get application pipeline history   |
| POST   | `/api/pipeline/:appId/update` | Update pipeline status (log entry) |

### 🛠️ Admin Dashboard (Optional)

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/admin/overview`   | Get stats (users, jobs, apps) |
| GET    | `/api/admin/users`      | Get all users                 |
| GET    | `/api/admin/applicants` | Get only applicants           |

---

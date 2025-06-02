# 🎓 University Management System - Backend

A scalable, secure, and modular university management system built with **TypeScript**, **Express**, and **MongoDB**. This RESTful API is designed for managing academic users, courses, faculties, semesters, and registrations with robust role-based access and data validation.

---

## 🚀 Features

- ✅ Modular route structure with clear separation of concerns
- 🔐 JWT-based authentication and role-based authorization (`admin`, `faculty`, `student`)
- 🧾 Schema validation using [Zod](https://zod.dev/)
- 💾 MongoDB with [Mongoose](https://mongoosejs.com/) for ODM
- 📡 RESTful API design with proper HTTP status codes
- 📦 File uploads to Cloudinary via Multer
- 🛡 Secure password hashing with `bcrypt`
- 🔄 Token refresh, password reset, and email-based verification support
- ⚙️ TypeScript-first development for reliability and maintainability

---

## 🛠 Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Language**: TypeScript
- **Authentication**: JWT, Cookies
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary
- **Email Service**: Nodemailer
- **Environment Config**: dotenv

---


## 📡 API Endpoints Overview

| Resource              | Base Route                    | Description                          |
|-----------------------|-------------------------------|--------------------------------------|
| Auth                  | `/api/v1/auth`                | Login, refresh token, password reset |
| Users                 | `/api/v1/users`               | Create students, faculties, admins   |
| Students              | `/api/v1/students`            | Student management                   |
| Faculties             | `/api/v1/faculties`           | Faculty management                   |
| Admins                | `/api/v1/admins`              | Admin management                     |
| Courses               | `/api/v1/courses`             | Manage courses & faculty assignments |
| Enrolled Courses      | `/api/v1/enrolled-courses`    | Student enrollments, grading         |
| Offered Courses       | `/api/v1/offered-courses`     | Offer courses by semester            |
| Semester Registrations| `/api/v1/semester-registrations`| Register semesters                 |
| Academic Semesters    | `/api/v1/academic-semesters`  | Define academic terms                |
| Academic Faculties    | `/api/v1/academic-faculties`  | Manage faculties                     |
| Academic Departments  | `/api/v1/academic-departments`| Manage departments                   |

---

## 🧪 Input Validation
Zod is used to define and enforce request validation schemas.

All incoming POST/PATCH routes are protected with validateRequest() middleware.

## 📦 Installation
Clone the repository

git clone https://github.com/MuntasirAbid/university-management-system-backend.git

cd university-management-system-backend

## Install dependencies

npm install

## Create .env file

Create a .env file in the root directory and copy the following:

##App Configuration

PORT=5000
NODE_ENV=development

##Database

DATABASE_URL=mongodb+srv://:@cluster.mongodb.net/dbname

Default Credentials

DEFAULT_PASS=student123

##Bcrypt

BCRYPT_SALT_ROUND=10

##JWT Authentication

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

##Password Reset UI

RESET_PASSWORD_UI_LINK=https://yourfrontend.com/reset-password

##Cloudinary (Image Upload)

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

## 🧰 Scripts

| Script               | Description                    |
| -------------------- | ------------------------------ |
| `npm run start:dev`  | Start development server       |
| `npm run build`      | Build TypeScript code          |
| `npm run start:prod` | Run compiled app in production |
| `npm run lint`       | Lint code using ESLint         |

## 🔒 Security
Passwords are hashed using bcrypt before saving to the database.

Tokens are stored securely and rotated using refresh logic.

Role-based access enforced with a custom auth middleware.



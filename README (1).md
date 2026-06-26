# 🏦 Secure Digital Banking System

A full-stack secure banking web application built with **React**, **Node.js/Express**, and **PostgreSQL**, demonstrating industry-level security practices for a Secure Software Design (SSD) course project.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup Instructions (From Scratch)](#-setup-instructions-from-scratch)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Project](#-running-the-project)
- [Demo / Test Accounts](#-demo--test-accounts)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Penetration Testing Commands](#-penetration-testing-commands)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

**User Features**
- Registration with password policy validation (8+ chars, uppercase, number, special character)
- Secure login with JWT authentication
- Account locking after 5 failed login attempts
- Dashboard with balance, recent transactions, and account status
- Money transfer with ACID-compliant transactions
- Transaction history
- Login history tracking
- Beneficiary management

**Admin Features**
- Role-Based Access Control (RBAC)
- View all users
- Freeze / Unfreeze user accounts
- View all transactions
- View fraud alerts
- View audit logs

**Security Features**
- bcrypt password hashing
- JWT token-based authentication (1 hour expiry)
- Parameterized SQL queries (SQL Injection prevention)
- Helmet.js security headers
- CORS protection
- Fraud detection (large transactions & rapid transfers)
- Complete audit logging

---

## 🛠 Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | React.js, React Router DOM, Axios            |
| Backend    | Node.js, Express.js                          |
| Database   | PostgreSQL                                   |
| Auth       | JSON Web Tokens (JWT), bcrypt                |
| Security   | Helmet.js, CORS                              |
| Tools      | pgAdmin 4, Postman, VS Code, Git/GitHub      |

---

## 📁 Project Structure

```
Secure-Banking-System/
├── backend/
│   ├── app.js                     ← Main server entry point
│   ├── .env                       ← Environment variables (NOT in GitHub — see below)
│   ├── config/
│   │   └── db.js                  ← PostgreSQL connection
│   ├── controllers/                ← Business logic
│   ├── routes/                     ← API route definitions
│   ├── middleware/                 ← authMiddleware.js, adminMiddleware.js
│   └── utils/
│       └── auditLogger.js
├── frontend/
│   ├── src/
│   │   ├── pages/                  ← Login, Register, Dashboard, Transfer, etc.
│   │   ├── components/             ← Navbar.jsx
│   │   └── services/
│   │       └── api.js              ← Axios instance with JWT interceptor
│   └── package.json
├── .gitignore
└── README.md                       ← You are here
```

---

## ✅ Prerequisites

Before running this project, install the following on your PC:

1. **Node.js** (v18 or higher) — [Download here](https://nodejs.org/)
   - Verify: `node --version`
2. **PostgreSQL** (v14 or higher, this project used v18) — [Download here](https://www.postgresql.org/download/)
   - Includes **pgAdmin 4** (GUI tool) by default
3. **Git** — [Download here](https://git-scm.com/downloads)
   - Verify: `git --version`
4. **VS Code** (recommended editor) — [Download here](https://code.visualstudio.com/)
5. **Postman** (for API testing) — [Download here](https://www.postman.com/downloads/)

---

## 🚀 Setup Instructions (From Scratch)

### Step 1 — Clone the Repository

```powershell
git clone https://github.com/Zainab88804/secure-banking-system.git
cd secure-banking-system
```

### Step 2 — Install Backend Dependencies

```powershell
cd backend
npm install
```

This installs: `express`, `pg`, `bcrypt`, `jsonwebtoken`, `cors`, `helmet`, `dotenv`

### Step 3 — Install Frontend Dependencies

```powershell
cd ../frontend
npm install
```

This installs: `react`, `react-router-dom`, `axios`

---

## 🔑 Environment Variables

The `.env` file is **excluded from GitHub** for security (it contains database passwords and JWT secrets). You must create it yourself.

Inside the `backend/` folder, create a file named exactly `.env` and paste the following, replacing values with your own:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bankdb
DB_PASSWORD=your_postgres_password_here
DB_PORT=5432
PORT=5000
JWT_SECRET=mysecretbankingkey123
```

> ⚠️ `DB_PASSWORD` should be the password you set when installing PostgreSQL.
> ⚠️ `JWT_SECRET` can be any random string — it's used to sign authentication tokens.

---

## 🗄 Database Setup

### Step 1 — Open pgAdmin 4

Connect to your PostgreSQL server using the password you set during installation.

### Step 2 — Create the Database

- Right-click **Databases** → **Create** → **Database**
- Name it: `bankdb`
- Click **Save**

### Step 3 — Create Tables

Open the **Query Tool** on `bankdb` and run the following SQL scripts in order:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    balance DECIMAL(12,2) DEFAULT 10000.00,
    status VARCHAR(20) DEFAULT 'active',
    failed_attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    note TEXT,
    status VARCHAR(20) DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud alerts table
CREATE TABLE fraud_alerts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    alert_type VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login history table
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beneficiaries table
CREATE TABLE beneficiaries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    beneficiary_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 4 — (Optional) Make a User Admin

After registering a user through the app, promote them to admin:

```sql
UPDATE users SET role='admin' WHERE email='your_email@example.com';
```

---

## ▶️ Running the Project

You need **two terminals running at the same time** — one for backend, one for frontend.

### Terminal 1 — Start Backend

```powershell
cd backend
node app.js
```

✅ You should see:
```
Server running on port 5000
✅ Connected to PostgreSQL Database
```

### Terminal 2 — Start Frontend

```powershell
cd frontend
npm start
```

✅ Browser will automatically open:
```
http://localhost:3000
```

### Step-by-Step Demo Flow

1. Go to `http://localhost:3000/register` → create a new account
2. Login with the same credentials
3. View Dashboard → balance and account info
4. Click **Transfer Money** → send funds to another registered user ID
5. Click **Transaction History** → view past transfers
6. If logged in as `admin` role → click **Admin Panel** → manage users, freeze/unfreeze accounts

---

## 👤 Demo / Test Accounts

> These were used during development/testing — create your own after a fresh database setup.

| Name        | Email              | Password | Role  |
|-------------|--------------------|----------|-------|
| Zainab Arif | zainab@test.com    | 123456   | admin |
| Ali Khan    | ali@test.com        | 123456   | user  |

---

## 🔌 API Endpoints

| Method | Endpoint                          | Auth Required | Description                          |
|--------|------------------------------------|----------------|---------------------------------------|
| POST   | `/api/auth/register`              | No             | Register new user                     |
| POST   | `/api/auth/login`                 | No             | Login, returns JWT token               |
| GET    | `/api/user/profile`               | Yes            | Get logged-in user's profile           |
| GET    | `/api/user/dashboard`             | Yes            | Profile + balance + recent transactions|
| GET    | `/api/user/login-history`         | Yes            | User's login timestamps                |
| POST   | `/api/transaction/transfer`       | Yes            | Transfer money                         |
| GET    | `/api/transaction/history`        | Yes            | Transaction history                    |
| GET    | `/api/admin/users`                | Yes (admin)    | List all users                         |
| PUT    | `/api/admin/freeze/:id`           | Yes (admin)    | Freeze a user account                  |
| PUT    | `/api/admin/unfreeze/:id`         | Yes (admin)    | Unfreeze a user account                |
| GET    | `/api/admin/transactions`         | Yes (admin)    | All transactions (all users)           |
| GET    | `/api/admin/fraud-alerts`         | Yes (admin)    | All fraud alerts                       |
| GET    | `/api/admin/audit-logs`           | Yes (admin)    | All audit logs                         |
| POST   | `/api/beneficiary/add`            | Yes            | Add a beneficiary                      |
| GET    | `/api/beneficiary/list`           | Yes            | List saved beneficiaries               |

> All protected endpoints require header: `Authorization: Bearer <token>`

---

## 🔐 Security Features

| Feature                   | Implementation                                              |
|----------------------------|---------------------------------------------------------------|
| Password Hashing           | bcrypt with 10 salt rounds                                   |
| Authentication              | JWT, 1-hour expiry, signed with `JWT_SECRET`                  |
| Authorization (RBAC)       | `adminMiddleware.js` checks `role` from JWT payload           |
| SQL Injection Prevention   | Parameterized queries (`$1, $2...`) throughout                |
| Brute Force Protection     | Account locks after 5 failed login attempts                   |
| ACID Transactions          | `BEGIN` / `COMMIT` / `ROLLBACK` on money transfers             |
| Fraud Detection            | Alerts on transfers >Rs.50,000 or 5+ transfers/minute          |
| Audit Logging              | Every login & transfer logged with timestamp                  |
| Security Headers           | Helmet.js applied globally in `app.js`                        |

---

## 🧪 Penetration Testing Commands

Use Postman to verify the following attacks are blocked:

**1. SQL Injection**
```json
POST http://localhost:5000/api/auth/login
{
  "email": "' OR 1=1--",
  "password": "anything"
}
```
Expected: `{ "message": "Invalid Email or Password" }`

**2. Brute Force (run 5 times with wrong password)**
```json
POST http://localhost:5000/api/auth/login
{
  "email": "ali@test.com",
  "password": "wrongpass"
}
```
Expected on 5th attempt: `{ "message": "Account Locked due to multiple failed login attempts" }`

**3. Unauthorized Admin Access (use a normal user's token)**
```
GET http://localhost:5000/api/admin/users
Authorization: Bearer <normal_user_token>
```
Expected: `{ "message": "Admin access required" }`

**4. No Token Access**
```
GET http://localhost:5000/api/user/profile
(no Authorization header)
```
Expected: `{ "message": "Access Denied" }`

**5. Negative Amount Transfer**
```json
POST http://localhost:5000/api/transaction/transfer
{ "receiverId": 2, "amount": -500, "note": "test" }
```
Expected: `{ "message": "Invalid amount" }`

---

## 🆘 Troubleshooting

| Problem                                              | Solution                                                                 |
|--------------------------------------------------------|---------------------------------------------------------------------------|
| `Cannot find module 'app.js'`                         | Make sure you're inside the `backend` folder before running `node app.js` |
| `password authentication failed for user "postgres"`  | Check `DB_PASSWORD` in `.env` matches your actual PostgreSQL password     |
| `relation "users" does not exist`                     | Run the table creation SQL scripts in pgAdmin (see Database Setup)        |
| Frontend shows blank page / API errors                 | Make sure backend is running on port 5000 **before** starting frontend    |
| `EADDRINUSE` port already in use                       | Another process is using port 5000 — close other terminals running `node app.js` |
| Login works but Dashboard fails                        | Token may have expired (1 hour) — login again to get a fresh token        |

---

## 📌 Notes

- This project was built as a learning exercise for a **Secure Software Design** course.
- The `.env` file is intentionally excluded from version control (see `.gitignore`) to protect credentials.
- For production deployment, additional measures would be required: HTTPS, rate limiting, 2FA, environment-specific secrets management, and a managed database service.

---

## 👩‍💻 Author

**Zainab Arif**
GitHub: [@Zainab88804](https://github.com/Zainab88804)

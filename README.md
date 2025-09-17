# Store Rating Platform

A full-stack application where users can browse stores and submit ratings, owners can view ratings for their stores, and admins can manage users, stores, and see dashboard stats.

## 🚀 Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express, JWT authentication
- **Database:** MySQL (mysql2 driver)
- **Password Hashing:** bcrypt

---

## 📂 Project Structure

## 📂 Project Structure

```bash
project-root/
├── Backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/Navbar.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── StoresList.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminAddUser.jsx
    │   │   ├── AdminAddStore.jsx
    │   │   └── OwnerDashboard.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json

 ```   

## 🛠️ Backend Setup

1. Go to the backend folder:

   ```bash
   cd Backend
   npm install
   ```

2. Create a .env file:
    PORT=5006
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASS=your_mysql_password
    DB_NAME=Rating_db
    JWT_SECRET=your_secret_here

3. Make sure you have the MySQL tables created:  
   CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  address VARCHAR(400),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user','owner') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(400),
  owner_id INT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  store_id INT,
  rating INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

4. Start the backend server:

```bash 
 npm run dev   # with nodemon
# or
npm start     # node src/server.js
```

## 🛠️ Frontend Setup

1. Go to the frontend folder:


```bash

    cd frontend
    npm install
```   

2. Start the React app:

```bash 
  npm run dev
```

4. 🔑 Roles

- User: can sign up, log in, view stores, submit/update ratings.

- Owner: can log in and view ratings for their stores (Owner Dashboard).

- Admin: can log in and view dashboard stats, add users, add stores, update/delete, etc.

## 📡 API Overview

### Auth

- POST /api/auth/signup — create user

- POST /api/auth/login — login, returns JWT

### Stores

- GET /api/stores — list stores + average rating

- POST /api/stores/:id/rating — submit/update rating (requires JWT)

### Admin

- GET /api/admin/stats — totals

- POST /api/admin/users — add user

- POST /api/admin/stores — add store

- PUT /api/admin/users/:id — update user

- DELETE /api/admin/users/:id — delete user

- PUT /api/admin/stores/:id — update store

- DELETE /api/admin/stores/:id — delete store

### Owner

- GET /api/owner/ratings?page=1&limit=10 — view ratings for owner’s stores

All admin/owner endpoints require Authorization: Bearer <token>.

### 🖥️ Frontend Pages

- login.js — login form

- Signup.jsx — signup form

- StoresList.jsx — list stores + average rating + rating form

- AdminDashboard.jsx — view stats + (example) add store form

- AdminAddUser.jsx — add new user (admin only)

- AdminAddStore.jsx — add new store (admin only)

- OwnerDashboard.jsx — owner’s store ratings with pagination

- Navbar.jsx — dynamic links by role

### 🚀 Running the App

1. Start backend: cd Backend && npm run dev

2. Start frontend: cd frontend && npm run dev

3. Open http://localhost:5173 in your browser.

4. Sign up a new user or login as admin/owner.


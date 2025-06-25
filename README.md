# 🌐 Frontend - MERN Appointment Management System

This is the **frontend** part of the MERN Appointment Management System built with **React**, **TypeScript**, **Ant Design**, and **Vite**.

---

## 📦 Tech Stack

- React (Vite)
- TypeScript
- Ant Design UI
- Axios (with auth interceptors)
- React Router DOM
- Context API

---

## 🔧 Prerequisites

- Node.js v18+

---

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

---

### 2. Configure Environment Variables

Create a `.env` file in `/frontend` with:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

> ⚠️ Vite requires all env variables to be prefixed with `VITE_`.

---

### 3. Run the App

```bash
npm run dev
```

> App will run at: [http://localhost:5173](http://localhost:5173)

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── routes/
│   ├── context/
│   ├── services/
│   ├── interface/
│   └── AppRoutes.tsx
└── .env
```

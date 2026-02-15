# 🔖 Smart Bookmark App

A simple, secure bookmark manager that allows users to save, manage, and access their favorite links privately using Google authentication.

## 🌐 Live Demo

👉 https://smart-bookmark-app-plum.vercel.app

---

## ✨ Features

- 🔐 Google Sign-In authentication (no email/password)
- ➕ Add bookmarks (Title + URL)
- 🔒 Private bookmarks per user
- ⚡ Real-time updates across tabs
- ❌ Delete bookmarks
- 👤 User profile display
- 🌐 Fully deployed on Vercel

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Backend:** Supabase
- **Authentication:** Supabase Auth (Google OAuth)
- **Database:** Supabase PostgreSQL
- **Realtime:** Supabase Realtime
- **Deployment:** Vercel

---

## 🔒 Privacy

Each user's bookmarks are stored securely and are not accessible to other users.

---

## 🚀 How It Works

1. User logs in using Google
2. Bookmarks are stored in Supabase database
3. Row Level Security ensures privacy
4. Real-time updates sync across tabs

---

## 📂 Installation (Local Setup)

```bash
git clone https://github.com/your-username/smart-bookmark-app.git
cd smart-bookmark-app
npm install
npm run dev

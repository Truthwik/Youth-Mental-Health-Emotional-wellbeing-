# 🌿 Svasthya: Your Journey, Your Wellbeing

**Svasthya** is a premium, real-time mental health and growth platform specifically designed for youth empowerment. It combines AI-driven empathy with professional clinical oversight and peer-led community support.

---

## 🚀 Key Modules

### 📅 Real-Time Planning Hub
A high-fidelity scheduling mission control at `/calendar`.
- **Hybrid Events:** Automated synchronization of therapist-allotted sessions alongside manual personal milestones (Meditation, Yoga, Study blocks).
- **Live Agenda:** A persistent sidebar showing upcoming growth events.
- **Instant Sync:** Background polling (30s) ensures your schedule is always live without refreshing.

### 🛡️ Resilience Dashboard
Visualize your mental wellbeing journey through advanced data analytics.
- **Resilience Index:** Interactive Recharts visualizing your mood trends over time.
- **AI Journaling:** Private entries are automatically analyzed for mood scores and empathetic insights using **Google Gemini AI**.
- **Activity Milestones:** Track progress on breathing, reflection, and peer-to-peer impact.

### 🤝 Omni-Role Ecosystem
Specialized, role-aware portals for every member of the Svasthya journey:
- **Youth Portal:** Self-care tools, journaling, and group support.
- **Mentor Hub:** Peer-led leadership and community moderation.
- **Therapist Dashboard:** Clinical session management and real-time availability guards.
- **Admin Command:** Platform-wide oversight and impact analytics.

### ⚡ Smart Booking Engine
- **Live Availability Guards:** Real-time "Reserved" status for therapist slots to prevent double-booking.
- **Razorpay Integration:** Secure, seamless session booking and donation system.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion (Animations), Recharts.
- **Backend:** Node.js, Express, MongoDB + Mongoose (Discriminators for role management).
- **AI Engine:** Google Gemini-1.5-Flash integration for empathetic journaling analysis.
- **Security:** JWT Authentication with role-based access control (RBAC).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local installation.

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5050
# MONGODB_URI=your_db_uri
# JWT_SECRET=your_secret
# GEMINI_API_KEY=your_key
node server.js
```

### 3. Frontend Setup
```bash
# Return to root directory
npm install
npm run dev
```

### 4. Configuration Notes
- **Port:** The platform is strictly configured to run the backend on **Port 5050** to resolve Windows system conflicts.
- **Vite Proxy:** The dev server automatically proxies all `/api` requests to the 5050 backend.

---

## 💎 Branded Identity
- **Typography:** Logo powered by **Yatra One** (Shiro Rekha style); Body text powered by **Outfit & Inter**.
- **Design:** Modern Glassmorphism aesthetic with a focus on tranquility and ease of use.

---

### *Svasthya – Empowering the next generation through digital empathy.* 🕊️✨

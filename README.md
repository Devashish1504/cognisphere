# 🌌 CogniSphere: The Ultimate Student Wellness & Growth Platform

CogniSphere is a holistic, data-driven ecosystem designed to support students through their academic journey, mental health challenges, and career transitions. Built with the MERN stack, it combines clinical assessments, AI-driven insights, and peer mentorship into a single premium interface.

---

## 🚀 Core Features

### 🧠 Mental Health & Wellness
- **PHQ-9 Clinical Assessment:** Confidential self-assessment tool to monitor depressive symptoms and stress levels.
- **Contextual Wellness Bot:** An AI-powered assistant providing immediate coping strategies for exam stress, sleep, and motivation.
- **Trend Analytics:** Visualized history of wellness scores to track long-term mental health progress.
- **Emergency Support:** Quick-access helplines and resources for immediate assistance.

### 🧭 Career Navigator
- **Vocational Profiling:** Multi-dimensional quiz mapping skills (Technical, Analytical, Creative) to industry roles.
- **Skill DNA:** Personalized visualizations of a student's professional strengths and compatibility scores.
- **Industry Pathways:** Data-mapped recommendations for roles like SDE, Data Scientist, Product Manager, and UI/UX Architect.

### 🤝 Mentorship Hub
- **Availability Management:** Mentors can set real-time availability slots.
- **Request Workflow:** Seamless student-to-mentor booking system with integrated notifications.
- **Approval Queue:** Admin-mediated mentor verification to ensure platform quality and safety.

### 📊 Intelligence & Productivity
- **Dynamic Analytics:** Real-time dashboards visualizing task completion, focus hours, and goal mastery via Recharts.
- **Personal Goal Tracking:** Set, monitor, and increment weekly milestones (e.g., "Master React" or "10 Study Sessions").
- **Task Scheduling:** Advanced workspace with priority levels, categories, and deadline status (Today/Overdue/Upcoming).

### 🏛️ Community & Resources
- **Moderated Forums:** Tag-based discussion boards with liked-based ranking and inline replies.
- **Resource Intelligence:** Standardized hub for educational materials with view tracking and bookmarking.

---

## 🛠️ Technical Architecture

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion (Animations), Lucide React (Icons), Recharts (Data Viz).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Mongoose ODM).
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (Student/Mentor/Admin).

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Git

### 2. Backend Setup
```bash
cd cognisphere/server
npm install
# Create a .env file with the following:
# PORT=5000
# MONGO_URI=your_mongodb_cluster_uri
# JWT_SECRET=your_super_secret_key
npm run dev
```

### 3. Frontend Setup
```bash
cd cognisphere/client
npm install
npm run dev
```

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth` | POST | Login & Registration (with RBAC) |
| `/api/tasks` | GET/POST | Task management & scheduling |
| `/api/mentorship` | GET/POST | Mentor discovery & request system |
| `/api/mentalhealth` | GET/POST | PHQ-9 Assessments & Wellness library |
| `/api/career` | GET/POST | Vocational profiling & recommendations |
| `/api/goals` | GET/POST | personal objective tracking |
| `/api/analytics` | GET | Aggregated platform/user growth data |

---

## 🤝 Contributing
CogniSphere is an open-source initiative aimed at student empowerment. To contribute:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

**Built with ❤️ by Team CogniSphere**

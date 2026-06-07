# PrepRoute — Test Management System (Frontend)

A modern Test Management System (TMS) built with **React + TypeScript + Vite**, enabling educators to create, configure, and publish multi-subject MCQ-based assessments with a clean and intuitive UI.

---

## 🚀 Features

- **Authentication** — JWT-based login with `localStorage` persistence and protected routes
- **Dashboard** — Overview of active tests, total questions, and candidates evaluated
- **Test Creation** — Multi-field form with Zod validation (subject, topic, sub-topic, difficulty, marking scheme, duration)
- **Question Editor** — Full-featured MCQ editor with:
  - Rich-text toolbar (Bold, Italic, Underline, Strikethrough, Link, Align, Image, LaTeX)
  - Dynamic option management (add / delete options)
  - Correct answer selection with visual radio indicator
  - Per-question settings (difficulty, topic, sub-topic) — dynamically scoped to chosen subject
  - Explanation / solution text area
  - Question navigation (prev / next) with sidebar progress tracker
  - Bulk CSV import support
- **Preview & Publish** — Confirmation screen with "Publish Now" / "Schedule Publish" modes and configurable live duration
- **State Persistence** — Redux + localStorage sync ensures test data survives page refreshes
- **Responsive Design** — Mobile drawer navigation + collapsible sidebar on desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | TailwindCSS v4 |
| State | Redux Toolkit |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Routing | React Router v7 |
| Notifications | React Hot Toast |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── assets/          # Static images (logo, illustrations)
├── components/
│   ├── common/      # ProtectedRoute, etc.
│   └── ui/          # Reusable: Button, Input, Modal, Card, Loader
├── layouts/
│   ├── AuthLayout.tsx       # Login / public layout
│   └── DashboardLayout.tsx  # Sidebar + header for protected pages
├── pages/
│   ├── Login/         # Auth page
│   ├── Dashboard/     # Overview stats
│   ├── CreateTest/    # Test metadata form
│   ├── Questions/     # MCQ question editor
│   └── PreviewPublish/ # Publish configuration
├── routes/            # React Router config
├── services/          # Axios API service + auth/test services
├── store/             # Redux slices (auth, tests)
└── types/             # Shared TypeScript interfaces
```

---

## ⚙️ Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd preproute

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

### Development Server

```bash
npm run dev
```

Runs at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

---

## 🔑 Demo Login

| Field | Value |
|-------|-------|
| User ID | `admin` |
| Password | `password` |

This uses a client-side mock to bypass the API for demonstration purposes.

---

## 🗺 App Flow

```
/login  →  /dashboard  →  /tests/create  →  /tests/:id/questions  →  /tests/:id/preview
```

1. Login with credentials
2. From Dashboard, click "Test Creation" in sidebar
3. Fill out the test metadata form and click "Next"
4. Configure MCQ questions (one per screen, sidebar shows progress)
5. Click "Publish" in the top header to open the publish confirmation
6. On the Preview/Publish page, set timing and confirm

---

## 📝 License

MIT

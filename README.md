# 🚀 CareerOs — AI-Powered Career Command Center

<div align="center">

![CareerOS Banner](https://img.shields.io/badge/CareerOS-v1.0-6366f1?style=for-the-badge&logo=rocket&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)
![PydanticAI](https://img.shields.io/badge/PydanticAI-agents-E92063?style=flat-square&logo=python&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

**A full-stack, AI-powered career operating system for job seekers.**
Track applications · Practice DSA · Run mock interviews · Craft AI-tailored resumes · Manage networking

[📖 Architecture Docs](docs/ARCHITECTURE.md) · [🛠️ Developer Guide](docs/DEVELOPER_GUIDE.md) · [📦 Module Reference](docs/MODULE_REFERENCE.md)

</div>

---

## ✨ Features

| Module | Description |
|---|---|
| 📋 **Applications** | Kanban-style pipeline tracking every job from Applied → Offer |
| 🤖 **AI Copilot** | Parse job descriptions, rewrite ATS-optimised resume bullets, generate cover letters |
| 🎤 **Mock Interviews** | AI-driven session with 5 tailored questions and a real-time scorecard |
| 💻 **DSA Tracker** | Log LeetCode/DSA progress + AI weekly algorithmic study planner |
| 🌐 **Networking** | Contact CRM + AI outreach drafter for LinkedIn/Email cold messages |
| 📊 **Analytics** | Visual dashboards + AI weekly performance insights report |
| 🏆 **Achievements** | Gamified milestone badges and streak counters |
| 📅 **Daily Missions** | Structured daily goals with progress streaks |
| 🗓️ **Timetable** | Hourly study-slot planner with weekly overview |
| 💡 **Skills Matrix** | Hexagonal skill tracking with progress levels |
| ⚙️ **Settings** | Profile, backup/restore, theme preferences |

---

## 🏗️ Architecture

CareerOS is built on a **Domain-Driven Design (DDD)** + **Vertical Slice** architecture. Each feature lives in an isolated module — both on the frontend (`src/modules/`) and backend (`backend/modules/`) — so contributors can work independently with zero merge conflicts.

```
CareerOS/
├── backend/
│   ├── modules/          ← Domain bounded contexts (interview, copilot, dsa…)
│   ├── shared/           ← Cross-domain: LLM client, hybrid search engine
│   └── main.py           ← Router registry & app entry point
└── src/
    ├── modules/          ← Domain bounded contexts (10 independent modules)
    ├── shared/ui/        ← Design system: Button, Modal, KpiCard, EmptyState…
    └── pages/            ← Dashboard, Analytics, AICopilot (aggregator views)
```

> 📖 Full breakdown in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 🤖 AI Architecture

Multi-provider LLM support via **PydanticAI** agents. Zero-config mock fallback for offline development.

```
Gemini → OpenAI → Anthropic → Groq → 🧪 Mock Fallback
```

Every AI feature works fully out-of-the-box — no API key required for development.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+

### Option A — One-Click (Windows)
Double-click **`start-dev.bat`** → opens backend + frontend in two terminals.

### Option B — Manual Setup

```bash
# 1. Install frontend dependencies
npm install

# 2. Create & activate Python virtual environment
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

# 3. Install backend dependencies
pip install -r backend/requirements.txt

# 4. Configure API keys (optional — mock fallback works without)
copy backend\.env.example backend\.env
# Edit backend/.env and add your preferred key

# 5. Start backend
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

# 6. Start frontend (new terminal)
npm run dev
```

Open **http://localhost:5173** — the app is ready.

> **No API key?** The backend auto-detects available providers and falls back to a rich, context-aware mock AI — fully functional for development and demos.

---

## 🔌 API Reference

Backend runs at `http://127.0.0.1:8000`. Interactive docs at `/docs`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/parse-job` | Extract structured data from a job description |
| POST | `/api/tailor-resume` | ATS-optimised resume bullet rewrites |
| POST | `/api/generate-cover-letter` | Personalised cover letter generator |
| POST | `/api/mock-interview/start` | Start a mock interview session |
| POST | `/api/mock-interview/submit-answer` | Submit answer → get AI scorecard |
| POST | `/api/analytics-insights` | AI weekly performance insights |
| POST | `/api/outreach-draft` | LinkedIn/Email outreach message drafter |
| POST | `/api/dsa-recommendations` | Personalised DSA study plan |
| POST | `/api/hybrid-search` | TF-IDF + keyword hybrid search |
| GET  | `/health` | Health check |

---

## 🤝 Contributing

We welcome contributors! Before making changes:

1. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — understand how the system is structured.
2. Read [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) — find the exact files to edit for your feature.
3. Read [docs/MODULE_REFERENCE.md](docs/MODULE_REFERENCE.md) — understand every module's public API.

### Contribution Rules
- ✅ Edit only the module you are assigned to (`src/modules/<name>/` or `backend/modules/<name>/`).
- ✅ Put reusable code in `src/shared/` or `backend/shared/`.
- ❌ Do NOT import internal files from another module directly.
- ❌ Do NOT modify `backend/main.py` unless adding a new module router.

### Branch Naming
```
feature/module-name-description    e.g.  feature/timetable-color-themes
bugfix/module-name-description     e.g.  bugfix/interview-session-reset
```

---

## 🔑 Environment Variables

| Variable | Provider | Priority |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini | 1st |
| `OPENAI_API_KEY` | OpenAI GPT-4o | 2nd |
| `ANTHROPIC_API_KEY` | Anthropic Claude | 3rd |
| `GROQ_API_KEY` | Groq LLaMA | 4th |

Copy `backend/.env.example` → `backend/.env` and fill in your preferred key.

---

## 🛠️ Common Issues

**Port 8000 in use?**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Backend 404 after code changes?** Always run from the project root:
```bash
# ✅ Correct
python -m uvicorn backend.main:app --reload

# ❌ Wrong — relative imports break
cd backend && uvicorn main:app --reload
```

**Frontend can't reach backend?**
Ensure both servers are running. Backend must be on port `8000`. CORS is configured for `localhost:5173`.

---

## 📁 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite, Vanilla CSS design tokens |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | FastAPI + Uvicorn |
| AI Agents | PydanticAI |
| Validation | Pydantic v2 |
| LLM Providers | Gemini · OpenAI · Anthropic · Groq |

---

## 📜 License

MIT — build freely, ship confidently.

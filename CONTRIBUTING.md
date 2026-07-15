# Contributing to CareerOs 🚀

Thank you for your interest in contributing to CareerOs! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Improving documentation

## 🏗️ Architecture Philosophy
CareerOs uses a **Domain-Driven Design (DDD)** and **Vertical Slice** architecture. This means each feature or domain is fully isolated:
- Frontend features live in `src/modules/<module-name>/`.
- Backend features live in `backend/modules/<module-name>/`.
- Common UI/utilities live in `src/shared/` or `backend/shared/`.

### Bounded Context Rules
1. **Never breach module boundaries**: Code in `src/modules/A` must NOT import files directly from `src/modules/B`. All communication across domains should go through pages, standard state management, or public shared interfaces.
2. **Module registration**: Do not modify `backend/main.py` unless you are registering routers for a new module.
3. **PydanticAI Agents**: If you build AI features, make sure they support PydanticAI and include a context-aware mock fallback in the service so that developers can test offline without API keys.

---

## 🚀 Setting Up Local Development

### Prerequisites
- Node.js v18+ and npm
- Python 3.10+

### Option A — One-Click (Windows)
Double-click **`start-dev.bat`** from the project root. It will spawn both the backend and frontend in separate windows.

### Option B — Manual Setup
1. **Clone the repository** (or your fork):
   ```bash
   git clone https://github.com/chiranjeevi7777/CareerOs.git
   cd CareerOs
   ```
2. **Set up the Frontend**:
   ```bash
   npm install
   ```
3. **Set up the Backend**:
   ```bash
   python -m venv .venv
   # Activate virtual env:
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate

   pip install -r backend/requirements.txt
   ```
4. **Configure Local Environment**:
   Copy `backend/.env.example` to `backend/.env`. You can add your `GEMINI_API_KEY`, `OPENAI_API_KEY`, etc. if you want real AI calls. If left blank, the app will run with local mock AI services automatically.
5. **Start Dev Servers**:
   - Backend: `python -m uvicorn backend.main:app --reload`
   - Frontend: `npm run dev`

---

## 🛠️ Development Workflow

1. **Find or Create an Issue**: Make sure there is an open issue you are assigned to before writing code.
2. **Branching**: Branch off of `main`.
   ```bash
   git checkout -b feature/module-name-description
   # or
   git checkout -b bugfix/module-name-description
   ```
3. **Writing Code**:
   - Keep your changes focused on the issue description.
   - Adhere to vanilla CSS design tokens for frontend styling.
4. **Linting and Verification**:
   - Run the frontend linter: `npm run lint`
   - Ensure the frontend builds: `npm run build`
   - Verify python syntax matches cleanly.
5. **Committing**: We use [Conventional Commits](https://www.conventionalcommits.org/).
   - `feat: add timetable hourly scheduler`
   - `fix: correct analytics tooltip rendering`
   - `docs: update setup instructions`
6. **Submit a Pull Request (PR)**: Target the `main` branch. Fill out the PR template.

## ⚖️ Code of Conduct
We follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please ensure you act respectfully and collaboratively.

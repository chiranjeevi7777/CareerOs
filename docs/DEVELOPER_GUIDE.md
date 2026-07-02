# 🛠️ CareerOS Developer Guide: Contributors' Navigation Manual

Welcome, contributor! This document acts as your navigation system for the CareerOS repository. Read this file to find out exactly where to make code edits without breaking other modules.

---

## 🗺️ Codebase Navigation Matrix

Use this index to find the files you need to modify based on what you want to achieve.

| I Want To... | Edit These Frontend Files | Edit These Backend Files | Shared Dependencies |
| :--- | :--- | :--- | :--- |
| **Change the Timetable** | `src/modules/timetable/` | *N/A (Local Persistence)* | `src/shared/ui/Modal.jsx` |
| **Improve Resume AI** | `src/modules/resume/` | `backend/modules/copilot/` | `backend/agents.py` |
| **Redesign Dashboard** | `src/pages/Dashboard.jsx` | *N/A (Layout)* | `src/shared/ui/KpiCard.jsx` |
| **Modify DSA Tracker** | `src/modules/dsa/` | `backend/modules/dsa/` | `src/shared/ui/EmptyState.jsx` |
| **Change Analytics** | `src/pages/Analytics.jsx` | `backend/modules/analytics/` | `recharts` library |
| **Improve Networking** | `src/modules/networking/` | `backend/modules/networking/` | `src/shared/ui/Modal.jsx` |
| **Add a New AI Agent** | `src/shared/hooks/` | `backend/agents.py` | `pydantic-ai` library |
| **Modify Mock Interviews** | `src/modules/interviews/` | `backend/modules/interview/` | `src/shared/ui/Button.jsx` |
| **Change Search Engine** | `src/pages/Dashboard.jsx` | `backend/shared/search.py` | `InMemoryTFIDF` class |
| **Add Authentication** | `src/App.jsx` | `backend/main.py` | *Future enhancement* |
| **Add Notification Popups** | `src/shared/utils/` | *N/A* | `react-hot-toast` |
| **Change Theme Settings** | `src/modules/settings/` | *N/A* | `src/shared/storage/` |
| **Modify Buttons/Icons** | `src/shared/ui/Button.jsx` | *N/A* | `lucide-react` |

---

## 📦 Feature Implementation Guides

Here are the details for modifying or expanding each system feature.

---

### 📅 Feature: Timetable Slot Planner
- **Purpose**: Allows candidates to structure their daily slots, schedule study time, and view weekly time commitments.
- **Folders to Edit**:
  - Frontend: `src/modules/timetable/`
- **Files to Edit**:
  - UI View: `src/modules/timetable/TimetablePage.jsx`
  - Logic hook: `src/modules/timetable/hooks/useTimetable.js`
- **Files NOT to Edit**:
  - `src/context/AppContext.jsx` (should only proxy)
- **Frontend Files**:
  - `src/modules/timetable/TimetablePage.jsx`
  - `src/modules/timetable/hooks/useTimetable.js`
  - `src/modules/timetable/index.js`
- **Backend Files**: *None (stored locally)*
- **Shared Dependencies**:
  - `src/shared/ui/Modal.jsx`
  - `src/shared/ui/Button.jsx`
- **API Endpoints**: *None*
- **Hooks**: `useTimetable`
- **Services**: `localStorage` adapter
- **Models**: Simple JS interfaces representing `Slot` (id, title, startTime, endTime, day)
- **Storage**: Key `careeros_timetable_slots`
- **Testing Steps**:
  1. Open http://localhost:5173/timetable.
  2. Click **Add Slot**. Enter title, select times, and save.
  3. Verify the slot appears on the timeline and updates the **Week Overview** bar chart.
- **Expected Output**: A responsive hourly grid displaying color-coordinated tasks.

---

### 🎤 Feature: Interactive Mock Interviews
- **Purpose**: Tailors five interview questions based on job description, accepts candidate text answers, provides scoring, and outputs an end-of-interview scorecard.
- **Folders to Edit**:
  - Frontend: `src/modules/interviews/`
  - Backend: `backend/modules/interview/`
- **Files to Edit**:
  - UI Page: `src/modules/interviews/InterviewsPage.jsx`
  - API Router: `backend/modules/interview/router.py`
  - Session logic: `backend/modules/interview/services.py`
  - Schema: `backend/modules/interview/models.py`
- **Files NOT to Edit**:
  - `backend/main.py`
- **Frontend Files**:
  - `src/modules/interviews/InterviewsPage.jsx`
  - `src/modules/interviews/hooks/useInterviews.js`
- **Backend Files**:
  - `backend/modules/interview/models.py`
  - `backend/modules/interview/router.py`
  - `backend/modules/interview/services.py`
- **Shared Dependencies**:
  - `backend/agents.py` (`interview_evaluation_agent`)
- **API Endpoints**:
  - `POST /api/mock-interview/start`
  - `POST /api/mock-interview/submit-answer`
- **Hooks**: `useInterviews`
- **Services**: `InterviewManager` session coordinator
- **Models**: `MockInterviewStartRequest`, `SubmitAnswerResponse`, `InterviewScorecard`
- **Storage**: In-memory backend sessions + local storage history
- **Testing Steps**:
  1. Go to `/interviews`. Enter "Frontend Engineer", "Google", and click **Start**.
  2. Answer the questions. Confirm that a score (out of 10) and feedback appears for each answer.
  3. At the end, verify the **Overall Scorecard** displays breakdown ratings (Communication, Technical, problem solving).
- **Expected Output**: Five-question interview flow showing real-time critiques and a final grade overview.

---

### 💻 Feature: DSA Algorithmic Tracker
- **Purpose**: Logs solved coding exercises, categorized by topic and difficulty, and queries an AI advisor for tailored study roadmaps.
- **Folders to Edit**:
  - Frontend: `src/modules/dsa/`
  - Backend: `backend/modules/dsa/`
- **Files to Edit**:
  - UI View: `src/modules/dsa/DSATrackerPage.jsx`
  - Backend endpoint: `backend/modules/dsa/router.py`
- **Files NOT to Edit**:
  - `backend/agents.py`
- **Frontend Files**:
  - `src/modules/dsa/DSATrackerPage.jsx`
  - `src/modules/dsa/hooks/useDSA.js`
- **Backend Files**:
  - `backend/modules/dsa/router.py`
- **Shared Dependencies**:
  - `backend/agents.py` (`dsa_recommender_agent`)
- **API Endpoints**:
  - `POST /api/dsa-recommendations`
- **Hooks**: `useDSA`
- **Services**: `localStorage` persistence
- **Models**: `DSAPracticeResponse`
- **Storage**: Key `careeros_dsa_problems`
- **Testing Steps**:
  1. Navigate to `/dsa`. Add a solved LeetCode problem.
  2. Click **Generate Study Plan**. Verify that recommended problems, strengths, and weaknesses populate.
- **Expected Output**: List of solved problems matched with a targeted weekly practice regimen.

---

### 🤖 Feature: AI Copilot (Job Parser & Resume Tailoring)
- **Purpose**: Parses raw job text, extracts key skills, and rewrites resume bullet points to fit the position guidelines.
- **Folders to Edit**:
  - Frontend: `src/modules/resume/`
  - Backend: `backend/modules/copilot/`
- **Files to Edit**:
  - UI: `src/modules/resume/ResumesPage.jsx`
  - Backend logic: `backend/modules/copilot/router.py`
  - Agent template: `backend/modules/copilot/agents.py`
- **Files NOT to Edit**:
  - `backend/main.py`
- **Frontend Files**:
  - `src/modules/resume/ResumesPage.jsx`
  - `src/modules/resume/hooks/useResumes.js`
- **Backend Files**:
  - `backend/modules/copilot/router.py`
  - `backend/modules/copilot/agents.py`
  - `backend/modules/copilot/models.py`
  - `backend/modules/copilot/mock.py`
- **Shared Dependencies**:
  - `backend/shared/llm.py`
- **API Endpoints**:
  - `POST /api/parse-job`
  - `POST /api/tailor-resume`
  - `POST /api/generate-cover-letter`
- **Hooks**: `useResumes`
- **Services**: Copilot parser
- **Models**: `JobParseResponse`, `ResumeTailorResponse`
- **Storage**: Key `careeros_resumes`
- **Testing Steps**:
  1. Open `/resumes`. Upload or paste a resume.
  2. Paste a job description. Click **Tailor Bullet Points**.
  3. Verify keyword suggestions and modified sentences are displayed.
- **Expected Output**: Re-written ATS-compliant bullet points.

---

## 🤝 How to Create a Pull Request (PR)

1. **Branch Naming Rule**: Use `feature/module-name` (e.g. `feature/timetable-color-themes`) or `bugfix/module-name`.
2. **Commit Pattern**: Use Semantic Commits:
   - `feat(timetable): add custom slot colors`
   - `fix(interview): resolve audio-feedback overlap`
3. **Checklist Before Submitting**:
   - Run `npm run build` to make sure compilation succeeds.
   - Run python validation to verify uvicorn starts.
   - Do NOT edit files under another module's directory unless modifying a common shared UI component in `src/shared/ui/`.

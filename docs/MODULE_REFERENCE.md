# 📖 CareerOS Module Reference Dictionary

This document details every modular context in the CareerOS project, identifying files, API paths, and dependencies.

---

## 🛠️ Global Subdirectories Reference

### 1. `src/shared/` (Frontend Shared Core)
- **Purpose**: Houses utilities, styles, hooks, and UI components used by more than one domain.
- **Sub-folders**:
  - `ui/`: Core design system components (`Button`, `Modal`, `KpiCard`, `EmptyState`, `LoadingSpinner`).
  - `storage/`: Encapsulates browser persistent storage operations (`localStorage.js`).
  - `utils/`: Common helpers (`idGen`, date format wrappers).
  - `hooks/`: System-wide hooks (e.g. state interceptors).
  - `api/`: Shared HTTP request configuration.

### 2. `src/pages/` (Aggregator Layout Components)
- **Purpose**: Page-level aggregators that combine components from multiple modules.
- **Files**:
  - `Dashboard.jsx`: Pulls application counters, timetable targets, and daily mission streaks.
  - `AICopilot.jsx`: Combines job parsing, resume editing, and cover letter panels.
  - `Analytics.jsx`: Orchestrates data metrics from applications, interviews, and networking.

### 3. `backend/shared/` (Backend Shared Core)
- **Purpose**: Infrastructure code that supports backend services.
- **Files**:
  - `llm.py`: Configures LLM clients using environment variable api keys.
  - `search.py`: Core logic for `InMemoryTFIDF` indexing and RRF query logic.
  - `config.py`: Loads environment configurations.

---

## 📦 Domain Module Reference Sheets

---

### 1. Timetable Slot Scheduler (`src/modules/timetable`)
- **Purpose**: Visual scheduler for structured preparation routines.
- **Owner**: Frontend Core Team
- **Status**: Stable / Extracted
- **Dependencies**: `react`, `lucide-react`, `date-fns`
- **Public API / Exports**:
  - `TimetablePage` (React component)
  - `useTimetable` (React Hook)
- **Folder Structure**:
  ```
  src/modules/timetable/
  ├── TimetablePage.jsx    # UI Grid view
  ├── index.js             # Exposer
  └── hooks/
      └── useTimetable.js  # Persistent slot management
  ```
- **Editable Files**: `TimetablePage.jsx`, `useTimetable.js`
- **Shared Dependencies**: `src/shared/ui/Modal.jsx`, `src/shared/ui/Button.jsx`
- **Example Workflow**:
  ```javascript
  import { useTimetable } from '../timetable';
  const { slots, addSlot } = useTimetable();
  ```
- **Testing**:
  - Verify calendar slots display correct background colors depending on category (e.g. DSA, Interview).
  - Verify adding a slot increments slot metrics.

---

### 2. Mock Interviews (`src/modules/interviews` & `backend/modules/interview`)
- **Purpose**: Simulates interactive technical and behavioral interviews.
- **Owner**: Frontend/AI Platform Team
- **Status**: Stable / Extracted
- **Dependencies**: `pydantic-ai`, `fastapi`, `recharts`
- **Public API / Exports**:
  - Frontend: `InterviewsPage` (React Component)
  - Backend: `backend/modules/interview/router.py` (FastAPI Router)
- **Folder Structure**:
  - Frontend:
    ```
    src/modules/interviews/
    ├── InterviewsPage.jsx
    ├── index.js
    ├── hooks/
    │   └── useInterviews.js
    └── services/
        └── interviewsStorage.js
    ```
  - Backend:
    ```
    backend/modules/interview/
    ├── __init__.py
    ├── models.py
    ├── services.py
    └── router.py
    ```
- **Public API endpoints**:
  - `POST /api/mock-interview/start`
  - `POST /api/mock-interview/submit-answer`
- **Testing**:
  - Start session -> answer a question -> check feedback score -> verify final scorecard layout.

---

### 3. Application Pipeline Tracker (`src/modules/applications`)
- **Purpose**: Track application cycles from submission to offer.
- **Owner**: Frontend Core Team
- **Status**: Active
- **Dependencies**: `lucide-react`
- **Public API / Exports**:
  - `ApplicationsPage` (React Component)
  - `useApplications` (React Hook)
- **Folder Structure**:
  ```
  src/modules/applications/
  ├── ApplicationsPage.jsx
  ├── constants.js
  ├── index.js
  ├── hooks/
  │   └── useApplications.js
  └── services/
      └── applicationsStorage.js
  ```
- **Editable Files**: `ApplicationsPage.jsx`, `useApplications.js`
- **Testing**:
  - Add application -> filter by status (e.g., Applied, Interviewing, Offer) -> export to CSV.

---

### 4. DSA Practice Tracker (`src/modules/dsa` & `backend/modules/dsa`)
- **Purpose**: Log solved coding problems and build automated study roadmaps.
- **Owner**: Algorithms Training Team
- **Status**: Active
- **Dependencies**: `recharts`
- **Folder Structure**:
  - Frontend:
    ```
    src/modules/dsa/
    ├── DSATrackerPage.jsx
    ├── index.js
    ├── hooks/
    │   └── useDSA.js
    └── services/
        └── dsaStorage.js
    ```
  - Backend:
    ```
    backend/modules/dsa/
    ├── __init__.py
    └── router.py
    ```
- **Public API endpoints**:
  - `POST /api/dsa-recommendations`
- **Testing**:
  - Log a problem -> Click AI Recommendation -> Verify generated graph focus.

---

### 5. Settings, Configurations & Themes (`src/modules/settings`)
- **Purpose**: Handle user data backups, profile parameters, and UI themes.
- **Owner**: Platform Team
- **Status**: Stable
- **Folder Structure**:
  ```
  src/modules/settings/
  ├── SettingsPage.jsx
  ├── index.js
  ├── hooks/
  │   └── useSettings.js
  └── services/
      └── settingsStorage.js
  ```
- **Editable Files**: `SettingsPage.jsx`, `useSettings.js`
- **Testing**:
  - Update user name -> save -> verify header updates.
  - Export profile as JSON -> clear localStorage -> import profile -> verify restore.

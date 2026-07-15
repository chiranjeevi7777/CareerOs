
function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch {}
}
function initTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch {}
}
initTheme();

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AICopilot from './pages/AICopilot';

// Modular Page Imports
import { DailyMissionPage } from './modules/missions';
import { ApplicationsPage } from './modules/applications';
import { InterviewsPage } from './modules/interviews';
import { NetworkingPage } from './modules/networking';
import { DSAPage } from './modules/dsa';
import { SkillsPage } from './modules/skills';
import { ResumesPage } from './modules/resume';
import { TimetablePage } from './modules/timetable';
import { AchievementsPage } from './modules/achievements';
import { SettingsPage } from './modules/settings';

export default function App() {
  return (
    <>
    <button type="button" onClick={toggleTheme} aria-label="Toggle dark mode" style={{position:"fixed",bottom:16,right:16,zIndex:50}}>Theme</button>

    <AppProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="copilot" element={<AICopilot />} />
            <Route path="mission" element={<DailyMissionPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="networking" element={<NetworkingPage />} />
            <Route path="dsa" element={<DSAPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="resumes" element={<ResumesPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

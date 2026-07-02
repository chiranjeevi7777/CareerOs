import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Briefcase,
  Users,
  Search,
  Send,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  Brain,
  Star,
  Activity,
  Award,
  Zap,
  BookOpen,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function AICopilot() {
  const { applications, networking, addApplication } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('parser'); // 'parser' | 'tailor' | 'interview' | 'search'

  // Common UI State
  const [copiedField, setCopiedField] = useState(null);

  // 1. Job Parser State
  const [jobText, setJobText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedJob, setParsedJob] = useState(null);

  // 2. Resume Tailoring State
  const [resumeText, setResumeText] = useState('');
  const [targetJobText, setTargetJobText] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);

  // 3. Mock Interview State
  const [interviewRole, setInterviewRole] = useState('Software Engineer');
  const [interviewCompany, setInterviewCompany] = useState('TechCorp');
  const [interviewJD, setInterviewJD] = useState('');
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const [interviewSession, setInterviewSession] = useState(null); // { id, role, company }
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [scorecard, setScorecard] = useState(null);

  // 4. Hybrid Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Copy helper
  const handleCopy = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  // 1. Parse Job API call
  const handleParseJob = async () => {
    if (!jobText.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }
    setIsParsing(true);
    setParsedJob(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/parse-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jobText }),
      });
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      setParsedJob(data);
      toast.success('Job description parsed successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect to backend server. Ensure backend is running.');
    } finally {
      setIsParsing(false);
    }
  };

  // Add parsed job to tracking list
  const handleAddParsedJob = () => {
    if (!parsedJob) return;
    addApplication({
      company: parsedJob.company,
      role: parsedJob.role,
      status: 'Applied',
      platform: parsedJob.platform || 'LinkedIn',
      date: new Date().toISOString().split('T')[0],
      salary: parsedJob.salary_range || '',
      requirements: parsedJob.requirements.join('\n'),
      notes: 'Added automatically via AI Parser.',
    });
    toast.success('Added to job tracking board!');
    navigate('/applications');
  };

  // 2. Resume & Letter Tailoring API call
  const handleTailorResume = async () => {
    if (!resumeText.trim() || !targetJobText.trim()) {
      toast.error('Please provide both your resume and the job description.');
      return;
    }
    setIsTailoring(true);
    setTailorResult(null);
    try {
      // Run both tailoring and cover letter generation in parallel
      const [tailorRes, letterRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/tailor-resume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume: resumeText, job_description: targetJobText }),
        }),
        fetch(`${API_BASE_URL}/api/generate-cover-letter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume: resumeText, job_description: targetJobText }),
        })
      ]);

      if (!tailorRes.ok || !letterRes.ok) throw new Error('Failed to tailor assets');

      const tailorData = await tailorRes.json();
      const letterData = await letterRes.json();

      setTailorResult({
        ...tailorData,
        cover_letter: letterData.cover_letter
      });
      toast.success('Resume optimized & cover letter created!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate tailored materials.');
    } finally {
      setIsTailoring(false);
    }
  };

  // 3. Mock Interview API calls
  const handleStartInterview = async () => {
    if (!interviewRole || !interviewCompany) {
      toast.error('Please specify target role and company.');
      return;
    }
    setIsStartingInterview(true);
    setScorecard(null);
    setLastFeedback(null);
    setCurrentQuestionNum(1);
    try {
      const response = await fetch(`${API_BASE_URL}/api/mock-interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: interviewRole,
          company: interviewCompany,
          job_description: interviewJD || null,
        }),
      });
      if (!response.ok) throw new Error('Failed to start interview');
      const data = await response.json();
      setInterviewSession({
        id: data.session_id,
        role: interviewRole,
        company: interviewCompany
      });
      setCurrentQuestion(data.question);
      toast.success('Interview session initialized!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect to backend.');
    } finally {
      setIsStartingInterview(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please type an answer.');
      return;
    }
    setIsSubmittingAnswer(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/mock-interview/submit-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: interviewSession.id,
          answer: userAnswer,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit answer');
      const data = await response.json();

      // Show feedback
      setLastFeedback({
        question: currentQuestion,
        answer: userAnswer,
        feedback: data.feedback
      });

      setUserAnswer('');

      if (data.is_complete) {
        setScorecard(data.scorecard);
        setInterviewSession(null);
        toast.success('Interview complete! Scorecard generated.');
      } else {
        setCurrentQuestion(data.next_question);
        setCurrentQuestionNum(prev => prev + 1);
        toast.success('Answer submitted! Next question loaded.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Submission failed.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // 4. Hybrid Search API call
  const handleHybridSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Assemble items from our local AppContext states
      const itemsToSearch = [];
      
      applications.forEach(app => {
        itemsToSearch.push({
          type: 'Application',
          id: app.id,
          company: app.company,
          role: app.role,
          status: app.status,
          notes: app.notes || '',
          platform: app.platform || '',
        });
      });

      networking.forEach(contact => {
        itemsToSearch.push({
          type: 'Networking Connection',
          id: contact.id,
          name: contact.name,
          role: contact.role,
          company: contact.company,
          status: contact.status || '',
          notes: contact.notes || '',
        });
      });

      const response = await fetch(`${API_BASE_URL}/api/hybrid-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          items: itemsToSearch,
          limit: 15,
        }),
      });
      if (!response.ok) throw new Error('Search request failed');
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error(error);
      toast.error('Failed to perform search query.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#e4e1e9] tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            AI Career Copilot
          </h2>
          <p className="text-sm text-[#958da1] mt-0.5">
            Intelligent ATS parsing, resume customization, and interactive mock interview simulation
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { id: 'parser', icon: Briefcase, label: 'ATS Job Parser' },
          { id: 'tailor', icon: FileText, label: 'Resume & Cover Letter' },
          { id: 'interview', icon: Brain, label: 'AI Mock Interview' },
          { id: 'search', icon: Search, label: 'Hybrid Search' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2"
            style={activeTab === t.id ? {
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            } : {
              color: '#958da1',
              background: 'transparent',
            }}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === 'parser' && (
          <motion.div
            key="parser"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Input panel */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 text-purple-300 font-semibold text-base mb-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Raw Job Description
              </div>
              <textarea
                value={jobText}
                onChange={e => setJobText(e.target.value)}
                placeholder="Paste the entire job description text here..."
                className="w-full h-80 rounded-xl p-4 bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-purple-500/80 transition-all font-sans leading-relaxed resize-none"
              />
              <button
                onClick={handleParseJob}
                disabled={isParsing}
                className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isParsing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Parsing with AI Agent...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Extract Structured Details
                  </>
                )}
              </button>
            </div>

            {/* Results panel */}
            <div className="rounded-2xl p-6 flex flex-col justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '400px' }}>
              {parsedJob ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-100">{parsedJob.role}</h3>
                      <p className="text-sm font-semibold text-purple-400 mt-1">{parsedJob.company}</p>
                    </div>
                    {parsedJob.salary_range && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {parsedJob.salary_range}
                      </span>
                    )}
                  </div>

                  {/* Requirements List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#958da1] mb-2.5">AI-Extracted Core Duties</h4>
                    <ul className="space-y-2">
                      {parsedJob.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex gap-2.5 items-start">
                          <span className="text-purple-400 font-bold mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Skills badging */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#958da1] mb-2.5">Key Technologies / Skills</h4>
                    <div className="flex gap-2 flex-wrap">
                      {parsedJob.key_skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddParsedJob}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add to Job Tracker
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center my-auto p-8 text-[#4a4455]">
                  <Sparkles className="w-12 h-12 mb-3 opacity-30 text-purple-400" />
                  <p className="text-base font-semibold text-slate-400">Structured Data Ready</p>
                  <p className="text-xs max-w-xs mt-1">Paste a job description on the left and analyze it using the AI Parser Agent.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'tailor' && (
          <motion.div
            key="tailor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Input Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm font-semibold text-purple-300 flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5" />
                  Paste Current Resume (Raw Text)
                </span>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your achievements, work experience, and profile details..."
                  className="w-full h-64 rounded-xl p-4 bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-purple-500/80 transition-all font-sans leading-relaxed resize-none"
                />
              </div>

              <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm font-semibold text-purple-300 flex items-center gap-1.5">
                  <Briefcase className="w-4.5 h-4.5" />
                  Target Job Description
                </span>
                <textarea
                  value={targetJobText}
                  onChange={e => setTargetJobText(e.target.value)}
                  placeholder="Paste the target job description details to align your materials against..."
                  className="w-full h-64 rounded-xl p-4 bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-purple-500/80 transition-all font-sans leading-relaxed resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleTailorResume}
              disabled={isTailoring}
              className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isTailoring ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Tailoring Resume & Generating Cover Letter...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-400" />
                  Generate Optimized Assets
                </>
              )}
            </button>

            {/* Results Displays */}
            {tailorResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Resume Suggestions (Summary & Bullets) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Summary card */}
                  <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-slate-200">Recommended Professional Summary</h4>
                      <button
                        onClick={() => handleCopy(tailorResult.tailored_summary, 'summary')}
                        className="p-1.5 rounded-lg hover:bg-white/8 text-[#958da1] hover:text-[#e4e1e9] transition-all"
                      >
                        {copiedField === 'summary' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                      {tailorResult.tailored_summary}
                    </p>
                  </div>

                  {/* Bullet points */}
                  <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h4 className="text-sm font-bold text-slate-200">Tailored Resume Bullet Points</h4>
                    <div className="space-y-3">
                      {tailorResult.tailored_bullets.map((bullet, idx) => (
                        <div key={idx} className="relative group bg-black/20 p-4 rounded-xl border border-white/5 flex justify-between items-start gap-4">
                          <p className="text-sm text-slate-300 leading-relaxed">{bullet}</p>
                          <button
                            onClick={() => handleCopy(bullet, `bullet-${idx}`)}
                            className="p-1 rounded-lg hover:bg-white/8 text-[#958da1] hover:text-[#e4e1e9] transition-all"
                          >
                            {copiedField === `bullet-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-slate-200">Generated Cover Letter</h4>
                      <button
                        onClick={() => handleCopy(tailorResult.cover_letter, 'letter')}
                        className="p-1.5 rounded-lg hover:bg-white/8 text-[#958da1] hover:text-[#e4e1e9] transition-all"
                      >
                        {copiedField === 'letter' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="text-sm text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-black/20 p-5 rounded-xl border border-white/5">
                      {tailorResult.cover_letter}
                    </pre>
                  </div>
                </div>

                {/* Gap & Keyword Analysis Sidebar */}
                <div className="space-y-6">
                  {/* Missing Keywords */}
                  <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Keywords to Add
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tailorResult.keywords_to_add.map((kw, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gap Analysis */}
                  <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      ATS Gap Analysis
                    </h4>
                    <div className="space-y-3">
                      {tailorResult.skill_gap_analysis.map((gap, idx) => (
                        <div key={idx} className="text-xs text-slate-300 leading-normal flex gap-2">
                          <span className="text-amber-500 font-bold">⚠️</span>
                          <span>{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'interview' && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {!interviewSession && !scorecard && (
              <div className="max-w-2xl mx-auto rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2.5 text-purple-300 font-semibold text-lg mb-2">
                  <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
                  Configure AI Mock Interview
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Target Role</label>
                    <input
                      value={interviewRole}
                      onChange={e => setInterviewRole(e.target.value)}
                      placeholder="e.g. Frontend Developer"
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Company</label>
                    <input
                      value={interviewCompany}
                      onChange={e => setInterviewCompany(e.target.value)}
                      placeholder="e.g. Google"
                      className="input-field mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Optional Job Details (custom questions)</label>
                  <textarea
                    value={interviewJD}
                    onChange={e => setInterviewJD(e.target.value)}
                    placeholder="Paste job details or requirements..."
                    className="w-full h-32 rounded-xl p-3 bg-black/40 border border-white/10 text-slate-100 text-sm mt-1 focus:outline-none focus:border-purple-500/80 transition-all font-sans leading-relaxed resize-none"
                  />
                </div>

                <button
                  onClick={handleStartInterview}
                  disabled={isStartingInterview}
                  className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {isStartingInterview ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting up Agent Loop...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Begin Interview Session
                    </>
                  )}
                </button>
              </div>
            )}

            {interviewSession && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Chat Panel */}
                <div className="lg:col-span-2 rounded-2xl p-6 space-y-6 flex flex-col justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '480px' }}>
                  {/* Progress Ring Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h4 className="font-bold text-slate-200">Interviewing: {interviewSession.role}</h4>
                      <p className="text-xs text-purple-400 font-semibold">{interviewSession.company}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300">
                      Question {currentQuestionNum} of 5
                    </div>
                  </div>

                  {/* Messaging bubbles */}
                  <div className="flex-1 space-y-6 my-4 overflow-y-auto pr-2">
                    {/* Interviewer */}
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold text-sm">
                        AI
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-200 leading-relaxed">
                        {currentQuestion}
                      </div>
                    </div>
                  </div>

                  {/* Response form */}
                  <div className="space-y-3">
                    <textarea
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      placeholder="Type your response here... Be detailed."
                      className="w-full h-32 rounded-xl p-4 bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-purple-500/80 transition-all font-sans leading-relaxed resize-none"
                    />
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isSubmittingAnswer}
                      className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      {isSubmittingAnswer ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Evaluating response...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Response
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-panel feedback on-the-fly */}
                <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#958da1] border-b border-white/10 pb-2.5">
                    Real-time Micro-Feedback
                  </h4>
                  {lastFeedback ? (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Previous Question:</span>
                        <p className="text-xs text-slate-300 italic mt-1">"{lastFeedback.question}"</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400">Critique & Score:</span>
                        <p className="text-sm text-slate-300 mt-1">{lastFeedback.feedback}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-[#4a4455] flex flex-col items-center">
                      <Zap className="w-8 h-8 opacity-20 mb-2 text-amber-400" />
                      <p className="text-xs">Critique will appear here after you submit your first response.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scorecard Results */}
            {scorecard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto rounded-3xl p-8 space-y-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(255,255,255,0.03) 100%)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                }}
              >
                {/* Stars + Rating */}
                <div className="text-center space-y-3 pb-6 border-b border-white/10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-purple-500/20 border border-purple-500/30 text-purple-300 mx-auto">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">Interview Evaluation Complete</h3>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => {
                      const active = star <= Math.round(scorecard.overall_rating);
                      return (
                        <Star
                          key={star}
                          className="w-6 h-6"
                          style={{
                            fill: active ? '#f59e0b' : 'none',
                            color: active ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                          }}
                        />
                      );
                    })}
                    <span className="text-lg font-bold text-amber-400 ml-2">{scorecard.overall_rating} / 5</span>
                  </div>
                  <p className="text-sm text-slate-300 max-w-lg mx-auto italic">
                    "{scorecard.summary}"
                  </p>
                </div>

                {/* Sub-scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#958da1]">Performance Metrics</h4>
                    
                    {[
                      { label: 'Technical Accuracy', score: scorecard.technical_score, color: '#06b6d4' },
                      { label: 'Communication Clarity', score: scorecard.communication_score, color: '#7c3aed' },
                      { label: 'Problem Solving', score: scorecard.problem_solving_score, color: '#f59e0b' },
                      { label: 'Cultural Fit', score: scorecard.cultural_fit_score, color: '#10b981' }
                    ].map(metric => (
                      <div key={metric.label} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-semibold">{metric.label}</span>
                          <span className="font-bold font-mono" style={{ color: metric.color }}>{metric.score} / 10</span>
                        </div>
                        <div className="h-2 rounded-full bg-black/40 border border-white/5">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: metric.color, boxShadow: `0 0 8px ${metric.color}60` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.score * 10}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1.5">
                        <Check className="w-4.5 h-4.5" /> Strengths Keyed
                      </h4>
                      <ul className="space-y-2">
                        {scorecard.strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] flex items-center gap-1.5">
                        <AlertCircle className="w-4.5 h-4.5" /> Recommended Improvements
                      </h4>
                      <ul className="space-y-2">
                        {scorecard.improvement_areas.map((imp, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setScorecard(null)}
                  className="btn-primary w-full py-3 mt-4"
                >
                  Start New Session
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Search inputs */}
            <form onSubmit={handleHybridSearch} className="flex gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Query applications or networking (e.g. 'Google React developer')..."
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500/80 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary px-6 font-semibold flex items-center gap-2"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </form>

            {/* Results */}
            <div className="max-w-3xl mx-auto space-y-3">
              {searchResults.length > 0 ? (
                searchResults.map((result, idx) => {
                  const item = result.item;
                  const scorePct = Math.round(result.relevance_score * 100);
                  const isKeyword = result.source === 'keyword';
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-xl flex items-center justify-between border group transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(255,255,255,0.06)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-300">
                            {item.type}
                          </span>
                          <span className="font-semibold text-sm text-slate-200">
                            {item.type === 'Application' ? `${item.role} @ ${item.company}` : `${item.name} (${item.role} @ ${item.company})`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{item.notes}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Search Source Badge */}
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                          style={{
                            background: isKeyword ? 'rgba(6,182,212,0.12)' : 'rgba(124,58,237,0.15)',
                            color: isKeyword ? '#06b6d4' : '#a855f7'
                          }}
                        >
                          {isKeyword ? 'exact match' : 'semantic match'}
                        </span>
                        
                        {/* Fused Score */}
                        <span className="text-xs font-bold font-mono text-purple-300">
                          {scorePct}% match
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-[#4a4455]">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-400" />
                  <p className="text-sm">Enter a search query to scan your local data store with Hybrid relevance scores.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

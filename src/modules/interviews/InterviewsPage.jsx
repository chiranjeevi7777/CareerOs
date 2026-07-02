import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, KpiCard, EmptyState } from '../../shared/ui';

const ROUND_TYPES = ['HR', 'Technical', 'Managerial', 'Final', 'System Design', 'Coding Round'];
const INTERVIEW_TYPES = ['Video Call', 'Phone', 'In-Person', 'Take-Home', 'Pair Programming'];
const RESULTS = ['Pending', 'Passed', 'Failed', 'No Show'];

const RESULT_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  Passed: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  'No Show': 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400',
};

const emptyForm = {
  company: '',
  role: '',
  round: 'Technical',
  date: new Date().toISOString().split('T')[0],
  time: '10:00',
  type: 'Video Call',
  result: 'Pending',
  feedback: '',
  notes: '',
};

export default function InterviewsPage() {
  const { interviews, addInterview, updateInterview, deleteInterview } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState('timeline');

  const setFormField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAddModal = () => {
    setForm(emptyForm);
    setEditItem(null);
    setShowModal(true);
  };

  const openEditModal = (iv) => {
    setForm(iv);
    setEditItem(iv);
    setShowModal(true);
  };

  // Group by company for timeline
  const grouped = interviews.reduce((acc, iv) => {
    const key = iv.company;
    if (!acc[key]) acc[key] = [];
    acc[key].push(iv);
    return acc;
  }, {});

  const upcoming = interviews.filter(iv => new Date(iv.date) >= new Date() && iv.result === 'Pending')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.company.trim()) {
      toast.error('Company is required');
      return;
    }
    if (editItem) {
      updateInterview(editItem.id, form);
      toast.success('Updated!');
    } else {
      addInterview(form);
      toast.success('Interview added!');
    }
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Interviews" value={interviews.length} color="#10b981" />
        <KpiCard label="Upcoming" value={upcoming.length} color="#f59e0b" />
        <KpiCard label="Passed" value={interviews.filter(i => i.result === 'Passed').length} color="#22c55e" />
        <KpiCard label="Companies" value={Object.keys(grouped).length} color="#6366f1" />
      </div>

      {/* Upcoming Interviews */}
      {upcoming.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" /> Upcoming Interviews
          </h3>
          <div className="space-y-3">
            {upcoming.map(iv => (
              <div key={iv.id} className="flex items-center gap-4 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
                <div className="text-center min-w-[48px]">
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{new Date(iv.date).getDate()}</p>
                  <p className="text-xs text-slate-500">{new Date(iv.date).toLocaleString('en-US', { month: 'short' })}</p>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{iv.company}</p>
                  <p className="text-xs text-slate-500">{iv.round} · {iv.type} · {iv.time}</p>
                </div>
                <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">{iv.round}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          {['timeline', 'table'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-0 ${
                view === v
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <Button onClick={openAddModal} variant="primary" className="text-sm">
          <Plus className="w-4 h-4" /> Add Interview
        </Button>
      </div>

      {/* Timeline View */}
      {view === 'timeline' && (
        <div className="space-y-4">
          {Object.entries(grouped).map(([company, ivs]) => (
            <div key={company} className="glass-card p-5">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">{company}</h4>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10" />
                <div className="space-y-4">
                  {ivs.sort((a, b) => new Date(a.date) - new Date(b.date)).map((iv, i) => (
                    <div key={iv.id} className="flex items-start gap-4 pl-10 relative">
                      <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-white dark:border-dark-800 ${iv.result === 'Passed' ? 'bg-success-500' : iv.result === 'Failed' ? 'bg-danger-500' : 'bg-amber-500'}`} />
                      <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">{iv.round}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">· {iv.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`badge ${RESULT_COLORS[iv.result] || 'bg-slate-100'}`}>{iv.result}</span>
                            <button onClick={() => openEditModal(iv)} className="text-slate-400 hover:text-primary-500 bg-transparent border-0 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => { if (confirm('Delete?')) { deleteInterview(iv.id); toast.success('Deleted'); }}} className="text-slate-400 hover:text-danger-500 bg-transparent border-0 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{new Date(iv.date).toLocaleDateString()} {iv.time && `at ${iv.time}`}</p>
                        {iv.feedback && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 italic">"{iv.feedback}"</p>}
                        {iv.notes && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Notes: {iv.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {interviews.length === 0 && (
            <div className="py-8">
              <EmptyState
                icon={<Calendar className="w-12 h-12 text-slate-400" />}
                title="No interviews tracked yet"
                description="Keep track of your scheduled screening calls, coding tests, or HR interviews."
                action={
                  <Button onClick={openAddModal} variant="primary" className="text-sm">
                    <Plus className="w-4 h-4" /> Add Interview
                  </Button>
                }
              />
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Round</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Result</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(iv => (
                  <tr key={iv.id}>
                    <td className="font-semibold dark:text-white">{iv.company}</td>
                    <td>{iv.role || '—'}</td>
                    <td>{iv.round}</td>
                    <td className="text-slate-500 text-xs">{iv.type}</td>
                    <td className="text-xs text-slate-500">{new Date(iv.date).toLocaleDateString()}</td>
                    <td><span className={`badge ${RESULT_COLORS[iv.result] || 'bg-slate-100'}`}>{iv.result}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(iv)} className="text-slate-400 hover:text-primary-500 bg-transparent border-0 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { if (confirm('Delete?')) { deleteInterview(iv.id); toast.success('Deleted'); }}} className="text-slate-400 hover:text-danger-500 bg-transparent border-0 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {interviews.length === 0 && (
              <div className="py-8">
                <EmptyState
                  icon={<Calendar className="w-12 h-12 text-slate-400" />}
                  title="No interviews tracked yet"
                  description="Keep track of your scheduled screening calls, coding tests, or HR interviews."
                  action={
                    <Button onClick={openAddModal} variant="primary" className="text-sm">
                      <Plus className="w-4 h-4" /> Add Interview
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Interview' : 'Add Interview'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Company *</label>
              <input
                className="input-field"
                value={form.company}
                onChange={e => setFormField('company', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Role</label>
              <input
                className="input-field"
                value={form.role}
                onChange={e => setFormField('role', e.target.value)}
                placeholder="Software Engineer..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Round Type</label>
              <select className="select-field" value={form.round} onChange={e => setFormField('round', e.target.value)}>
                {ROUND_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Interview Type</label>
              <select className="select-field" value={form.type} onChange={e => setFormField('type', e.target.value)}>
                {INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={e => setFormField('date', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Time</label>
              <input
                type="time"
                className="input-field"
                value={form.time}
                onChange={e => setFormField('time', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Result</label>
            <select className="select-field" value={form.result} onChange={e => setFormField('result', e.target.value)}>
              {RESULTS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Feedback</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.feedback}
              onChange={e => setFormField('feedback', e.target.value)}
              placeholder="Interviewer feedback..."
            />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.notes}
              onChange={e => setFormField('notes', e.target.value)}
              placeholder="Your notes..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">
              <Check className="w-4 h-4" /> {editItem ? 'Update' : 'Add Interview'}
            </Button>
            <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

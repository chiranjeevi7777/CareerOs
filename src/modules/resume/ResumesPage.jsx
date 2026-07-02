import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, FileText, Upload, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, KpiCard, EmptyState } from '../../shared/ui';

const emptyForm = {
  name: '',
  version: '1.0',
  targetRole: '',
  atsScore: '',
  notes: '',
  dateModified: new Date().toISOString().split('T')[0],
  applicationsUsed: 0,
};

function ATSScoreBar({ score }) {
  const s = Number(score) || 0;
  const color = s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500">ATS Score</span>
        <span className="font-bold" style={{ color }}>{s}%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: `${s}%` }} transition={{ duration: 1 }} />
      </div>
    </div>
  );
}

export default function ResumesPage() {
  const { resumes, addResume, updateResume, deleteResume } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const best = resumes.reduce((b, r) => (Number(r.atsScore) > Number(b?.atsScore || 0) ? r : b), null);

  const setFormField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAddModal = () => {
    setForm(emptyForm);
    setEditItem(null);
    setShowModal(true);
  };

  const openEditModal = (resume) => {
    setForm(resume);
    setEditItem(resume);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Resume name required');
      return;
    }
    if (editItem) {
      updateResume(editItem.id, form);
      toast.success('Updated!');
    } else {
      addResume(form);
      toast.success('Resume added!');
    }
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Total Resumes" value={resumes.length} color="#f97316" />
        <KpiCard label="Best ATS Score" value={best ? `${Number(best.atsScore) || 0}%` : '—'} color="#22c55e" />
        <KpiCard label="Top Resume" value={best?.name || '—'} color="#3b82f6" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resume Versions</h2>
        <Button onClick={openAddModal} variant="primary">
          <Plus className="w-4 h-4" /> Add Resume
        </Button>
      </div>

      {/* Resume Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {resumes.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-5 space-y-4 group hover:shadow-xl transition-all hover:-translate-y-1 relative ${r.id === best?.id ? 'ring-2 ring-success-500/50' : ''}`}>
              {r.id === best?.id && (
                <div className="absolute -top-2 -right-2 bg-success-500 text-white rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Best
                </div>
              )}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{r.name}</h4>
                    <p className="text-xs text-slate-500">v{r.version} · {r.targetRole || 'General'}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(r)} className="text-slate-400 hover:text-primary-500 p-1 bg-transparent border-0 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm('Delete?')) { deleteResume(r.id); toast.success('Deleted'); }}} className="text-slate-400 hover:text-danger-500 p-1 bg-transparent border-0 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <ATSScoreBar score={r.atsScore} />

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Modified: {r.dateModified}
              </div>
              {r.notes && <p className="text-xs text-slate-600 dark:text-slate-400 italic border-t border-slate-100 dark:border-white/10 pt-3">{r.notes}</p>}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add placeholder */}
        <motion.button
          onClick={openAddModal}
          className="glass-card p-5 border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-colors flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary-500 min-h-[180px] group cursor-pointer bg-transparent"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 group-hover:bg-primary-500/10 flex items-center justify-center transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="font-medium text-sm">Add Resume Version</p>
            <p className="text-xs mt-0.5">Track ATS scores and versions</p>
          </div>
        </motion.button>
      </div>

      {resumes.length === 0 && (
        <div className="py-8">
          <EmptyState
            icon={<FileText className="w-12 h-12 text-slate-400" />}
            title="No resumes tracked yet"
            description="Add your resume versions to track ATS scores and usage."
            action={
              <Button onClick={openAddModal} variant="primary" className="text-sm">
                <Plus className="w-4 h-4" /> Add Resume
              </Button>
            }
          />
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Resume' : 'Add Resume'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Resume Name *</label>
              <input
                className="input-field"
                value={form.name}
                onChange={e => setFormField('name', e.target.value)}
                placeholder="SDE Resume v2"
                required
              />
            </div>
            <div>
              <label className="form-label">Version</label>
              <input
                className="input-field"
                value={form.version}
                onChange={e => setFormField('version', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Target Role</label>
              <input
                className="input-field"
                value={form.targetRole}
                onChange={e => setFormField('targetRole', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="form-label">ATS Score (%)</label>
              <input
                type="number"
                className="input-field"
                value={form.atsScore}
                onChange={e => setFormField('atsScore', e.target.value)}
                min="0"
                max="100"
                placeholder="75"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Date Modified</label>
            <input
              type="date"
              className="input-field"
              value={form.dateModified}
              onChange={e => setFormField('dateModified', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.notes}
              onChange={e => setFormField('notes', e.target.value)}
              placeholder="Track version changes, specific platform updates, or tailoring notes..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">
              <Check className="w-4 h-4" /> Save
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

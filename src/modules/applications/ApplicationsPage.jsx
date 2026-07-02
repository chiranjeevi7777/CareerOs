import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, ExternalLink, Check, Download, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, KpiCard, EmptyState } from '../../shared/ui';
import { APPLICATION_STATUSES, PLATFORMS, WORK_MODES, STATUS_COLORS } from './constants';

const emptyForm = {
  company: '',
  role: '',
  platform: 'LinkedIn',
  workMode: 'Remote',
  applicationDate: new Date().toISOString().split('T')[0],
  jobUrl: '',
  status: 'Applied',
  notes: '',
};

export default function ApplicationsPage() {
  const { applications, addApplication, updateApplication, deleteApplication } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const setFormField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAddModal = () => {
    setForm(emptyForm);
    setEditItem(null);
    setShowModal(true);
  };

  const openEditModal = (app) => {
    setForm(app);
    setEditItem(app);
    setShowModal(true);
  };

  const filtered = useMemo(() => {
    return applications
      .filter(a => {
        const q = search.toLowerCase();
        const matchSearch = !q || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || (a.platform || '').toLowerCase().includes(q);
        const matchStatus = filterStatus === 'All' || a.status === filterStatus;
        const matchPlatform = filterPlatform === 'All' || a.platform === filterPlatform;
        return matchSearch && matchStatus && matchPlatform;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.createdAt || b.applicationDate) - new Date(a.createdAt || a.applicationDate);
        if (sortBy === 'company') return a.company.localeCompare(b.company);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return 0;
      });
  }, [applications, search, filterStatus, filterPlatform, sortBy]);

  const stats = useMemo(() => ({
    total: applications.length,
    thisWeek: applications.filter(a => (new Date() - new Date(a.createdAt || a.applicationDate)) < 7 * 86400000).length,
    thisMonth: applications.filter(a => (new Date() - new Date(a.createdAt || a.applicationDate)) < 30 * 86400000).length,
    interviews: applications.filter(a => a.status === 'Interview' || a.status === 'Technical' || a.status === 'HR Round').length,
    offers: applications.filter(a => a.status === 'Offer').length,
    conversionRate: applications.length > 0
      ? ((applications.filter(a => a.status === 'Interview' || a.status === 'Technical' || a.status === 'HR Round').length / applications.length) * 100).toFixed(1)
      : 0,
  }), [applications]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      toast.error('Company and role are required');
      return;
    }
    if (editItem) {
      updateApplication(editItem.id, form);
      toast.success('Application updated!');
    } else {
      addApplication(form);
      toast.success('Application added!');
    }
    setShowModal(false);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this application?')) {
      deleteApplication(id);
      toast.success('Deleted');
    }
  };

  const exportCSV = () => {
    const headers = ['Company', 'Role', 'Platform', 'Work Mode', 'Date', 'Status', 'URL', 'Notes'];
    const rows = applications.map(a => [a.company, a.role, a.platform, a.workMode || 'Remote', a.applicationDate, a.status, a.jobUrl, a.notes]);
    const csv = [headers, ...rows].map(r => r.map(val => `"${(val || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-applications.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Total" value={stats.total} color="#6366f1" />
        <KpiCard label="This Week" value={stats.thisWeek} color="#3b82f6" />
        <KpiCard label="This Month" value={stats.thisMonth} color="#06b6d4" />
        <KpiCard label="Interviews" value={stats.interviews} color="#10b981" />
        <KpiCard label="Offers" value={stats.offers} color="#22c55e" />
        <KpiCard label="Conv. Rate" value={`${stats.conversionRate}%`} color="#f59e0b" />
      </div>

      {/* Controls */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-10"
            placeholder="Search company, role, platform..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <select className="select-field text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="select-field text-sm" value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}>
            <option value="All">All Platforms</option>
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="select-field text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Sort: Date</option>
            <option value="company">Sort: Company</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
          <Button onClick={exportCSV} variant="secondary" className="flex-1 md:flex-initial text-sm">
            <Download className="w-4 h-4" /> CSV
          </Button>
          <Button onClick={openAddModal} variant="primary" className="flex-1 md:flex-initial text-sm">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Platform</th>
                <th>Work Mode</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((app, i) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  >
                    <td>
                      <div className="font-semibold text-slate-900 dark:text-white">{app.company}</div>
                    </td>
                    <td className="text-slate-600 dark:text-slate-300">{app.role}</td>
                    <td className="text-slate-500 dark:text-slate-400 text-xs">{app.platform}</td>
                    <td className="text-slate-500 dark:text-slate-400 text-xs">{app.workMode || 'Remote'}</td>
                    <td className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {new Date(app.applicationDate || app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-600'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="max-w-[180px]">
                      <span className="text-xs text-slate-400 dark:text-slate-500 truncate block">{app.notes || '—'}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {app.jobUrl && (
                          <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-400">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button onClick={() => openEditModal(app)} className="text-slate-400 hover:text-primary-500 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(app.id)} className="text-slate-400 hover:text-danger-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12">
              <EmptyState
                icon={<Briefcase className="w-12 h-12 text-slate-400" />}
                title="No applications found"
                description="Add your first application to get started!"
                action={
                  <Button onClick={openAddModal} variant="primary" className="text-sm">
                    <Plus className="w-4 h-4" /> Add Application
                  </Button>
                }
              />
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400">
          Showing {filtered.length} of {applications.length} applications
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Application' : 'Add Application'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Company *</label>
              <input
                className="input-field"
                value={form.company}
                onChange={e => setFormField('company', e.target.value)}
                placeholder="Google, Microsoft..."
                required
              />
            </div>
            <div>
              <label className="form-label">Role *</label>
              <input
                className="input-field"
                value={form.role}
                onChange={e => setFormField('role', e.target.value)}
                placeholder="SDE-1, Backend Eng..."
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Platform</label>
              <select className="select-field" value={form.platform} onChange={e => setFormField('platform', e.target.value)}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Work Mode</label>
              <select className="select-field" value={form.workMode} onChange={e => setFormField('workMode', e.target.value)}>
                {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Application Date</label>
              <input
                type="date"
                className="input-field"
                value={form.applicationDate}
                onChange={e => setFormField('applicationDate', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="select-field" value={form.status} onChange={e => setFormField('status', e.target.value)}>
                {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Job URL</label>
            <input
              className="input-field"
              value={form.jobUrl}
              onChange={e => setFormField('jobUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.notes}
              onChange={e => setFormField('notes', e.target.value)}
              placeholder="Any notes..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">
              <Check className="w-4 h-4" /> {editItem ? 'Update' : 'Add Application'}
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

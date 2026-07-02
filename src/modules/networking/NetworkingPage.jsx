import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, Search, Users, MessageSquare, Copy, Sparkles, Brain, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Button, KpiCard, EmptyState } from '../../shared/ui';
import { apiClient } from '../../shared/api/apiClient';

const PLATFORMS = ['LinkedIn', 'Twitter/X', 'GitHub', 'Email', 'Discord', 'Slack', 'Other'];

const emptyForm = {
  name: '',
  company: '',
  position: '',
  platform: 'LinkedIn',
  connectionDate: new Date().toISOString().split('T')[0],
  replied: false,
  referralRequested: false,
  referralReceived: false,
  notes: '',
};

function OutreachModal({ contact, onClose }) {
  const [goal, setGoal] = useState('informal chat');
  const [platform, setPlatform] = useState(contact.platform || 'LinkedIn');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);

  const generateDraft = async () => {
    setLoading(true);
    try {
      const data = await apiClient.post('/api/outreach-draft', {
        contact_name: contact.name,
        contact_role: contact.position || '',
        contact_company: contact.company || '',
        platform,
        goal,
        additional_context: context,
      });
      setDraft(data);
      toast.success('Outreach draft generated!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate draft.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>AI Outreach Drafter</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl text-xs text-slate-300">
          Drafting message for <span className="font-bold text-white">{contact.name}</span>
          {contact.position && ` (${contact.position})`}
          {contact.company && ` @ ${contact.company}`}.
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Outreach Goal</label>
            <select className="select-field" value={goal} onChange={e => setGoal(e.target.value)}>
              <option value="informal chat">Informal Chat / Coffee</option>
              <option value="referral">Referral Request</option>
              <option value="follow up">Follow-up Message</option>
            </select>
          </div>
          <div>
            <label className="form-label">Platform</label>
            <select className="select-field" value={platform} onChange={e => setPlatform(e.target.value)}>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Email">Email</option>
              <option value="Twitter/X">Twitter/X</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Additional Context / Personalization (Optional)</label>
          <textarea
            className="input-field resize-none text-xs"
            rows={2}
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="e.g. We both went to Stanford, or I saw their recent post about AI scaling..."
          />
        </div>

        <Button
          onClick={generateDraft}
          disabled={loading}
          variant="primary"
          className="w-full py-2.5 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {loading ? 'Drafting message...' : 'Draft with AI Copilot'}
        </Button>

        {draft && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400">AI GENERATED DRAFT</span>
              <button
                type="button"
                onClick={() => copyToClipboard(draft.body)}
                className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 font-semibold bg-transparent border-0 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Message
              </button>
            </div>

            {draft.subject && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs">
                <span className="text-slate-400 font-bold block mb-1">Subject:</span>
                <span className="text-slate-200">{draft.subject}</span>
              </div>
            )}

            <textarea
              className="input-field font-mono text-xs text-slate-200 resize-none bg-slate-950 border-white/10"
              rows={6}
              value={draft.body}
              onChange={e => setDraft(p => ({ ...p, body: e.target.value }))}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function NetworkingPage() {
  const { networking, addContact, updateContact, deleteContact } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [outreachContact, setOutreachContact] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const todayCount = networking.filter(n => n.connectionDate === today).length;
  const todayGoal = 5; // Reduced from 50 to a more realistic 5 daily goal as standard

  const setFormField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAddModal = () => {
    setForm(emptyForm);
    setEditItem(null);
    setShowModal(true);
  };

  const openEditModal = (contact) => {
    setForm(contact);
    setEditItem(contact);
    setShowModal(true);
  };

  const filtered = useMemo(() =>
    networking.filter(n => !search || [n.name, n.company, n.position, n.platform].some(v => v?.toLowerCase().includes(search.toLowerCase()))),
    [networking, search]
  );

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      return {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        count: networking.filter(n => n.connectionDate === key).length,
      };
    });
  }, [networking]);
  
  const maxWeekly = Math.max(...weeklyData.map(d => d.count), 1);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name required');
      return;
    }
    if (editItem) {
      updateContact(editItem.id, form);
      toast.success('Updated!');
    } else {
      addContact(form);
      toast.success('Contact added!');
    }
    setShowModal(false);
    setEditItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 glass-card p-6 flex items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-24 h-24">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
              <motion.circle
                cx="50" cy="50" r="40"
                stroke="#ec4899" strokeWidth="10" fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - Math.min(1, todayCount / todayGoal)) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{todayCount}</span>
              <span className="text-[10px] text-slate-500">/{todayGoal}</span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayCount} / {todayGoal}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Connections today</p>
            <p className="text-xs text-slate-400 mt-1">Total: {networking.length}</p>
          </div>
        </div>

        {/* Weekly chart */}
        <div className="md:col-span-2 glass-card p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-500" />
            Weekly Networking
          </h3>
          <div className="flex items-end gap-3 h-24">
            {weeklyData.map(({ day, count }, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{count}</span>
                <div className="w-full bg-slate-100 dark:bg-white/10 rounded-t-md overflow-hidden" style={{ height: '72px' }}>
                  <motion.div
                    className="w-full bg-pink-500 rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxWeekly) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ marginTop: 'auto', position: 'relative', bottom: 0 }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Contacts" value={networking.length} color="#ec4899" />
        <KpiCard label="Replied" value={networking.filter(n => n.replied).length} color="#10b981" />
        <KpiCard label="Referrals Requested" value={networking.filter(n => n.referralRequested).length} color="#f59e0b" />
        <KpiCard label="Referrals Received" value={networking.filter(n => n.referralReceived).length} color="#22c55e" />
      </div>

      {/* Table */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4 flex-col sm:flex-row">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className="input-field pl-10" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button onClick={openAddModal} variant="primary" className="whitespace-nowrap w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Position</th>
                <th>Platform</th>
                <th>Date</th>
                <th>Replied</th>
                <th>Referral</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(n => (
                <tr key={n.id}>
                  <td className="font-semibold dark:text-white">{n.name}</td>
                  <td>{n.company || '—'}</td>
                  <td className="text-slate-500 text-xs">{n.position || '—'}</td>
                  <td><span className="badge bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400">{n.platform}</span></td>
                  <td className="text-xs text-slate-500">{n.connectionDate}</td>
                  <td><span className={`text-sm ${n.replied ? 'text-success-500' : 'text-slate-400'}`}>{n.replied ? '✓' : '—'}</span></td>
                  <td>
                    {n.referralReceived ? <span className="badge bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">Received</span>
                      : n.referralRequested ? <span className="badge bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">Requested</span>
                        : <span className="text-slate-400 text-sm">—</span>}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => { setOutreachContact(n); setShowOutreachModal(true); }} className="text-slate-400 hover:text-purple-500 bg-transparent border-0 cursor-pointer" title="Draft outreach message"><MessageSquare className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openEditModal(n)} className="text-slate-400 hover:text-primary-500 bg-transparent border-0 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if (confirm('Delete?')) { deleteContact(n.id); toast.success('Deleted'); }}} className="text-slate-400 hover:text-danger-500 bg-transparent border-0 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12">
              <EmptyState
                icon={<Users className="w-12 h-12 text-slate-400" />}
                title="No contacts found"
                description="Add your first contact to start networking!"
                action={
                  <Button onClick={openAddModal} variant="primary" className="text-sm">
                    <Plus className="w-4 h-4" /> Add Contact
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Contact' : 'Add Contact'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Name *</label>
              <input
                className="input-field"
                value={form.name}
                onChange={e => setFormField('name', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Company</label>
              <input
                className="input-field"
                value={form.company}
                onChange={e => setFormField('company', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Position</label>
              <input
                className="input-field"
                value={form.position}
                onChange={e => setFormField('position', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Platform</label>
              <select className="select-field" value={form.platform} onChange={e => setFormField('platform', e.target.value)}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Connection Date</label>
            <input
              type="date"
              className="input-field"
              value={form.connectionDate}
              onChange={e => setFormField('connectionDate', e.target.value)}
            />
          </div>
          <div className="flex gap-4 py-1 flex-wrap">
            {[
              ['replied', 'Replied'],
              ['referralRequested', 'Referral Requested'],
              ['referralReceived', 'Referral Received']
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={e => setFormField(key, e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{label}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              value={form.notes}
              onChange={e => setFormField('notes', e.target.value)}
              placeholder="Add connection notes..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">
              <Check className="w-4 h-4" /> Save Contact
            </Button>
            <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <AnimatePresence>
        {showOutreachModal && (
          <OutreachModal
            contact={outreachContact}
            onClose={() => { setShowOutreachModal(false); setOutreachContact(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

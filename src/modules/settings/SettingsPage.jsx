import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { Save, Download, Upload, Trash2, Sun, Moon, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { exportAllData, importAllData } from '../../services/storage';
import { Button } from '../../shared/ui';

export default function SettingsPage() {
  const { settings, updateSettings, theme, toggleTheme } = useApp();
  const [form, setForm] = useState({
    name: settings.name || '',
    role: settings.role || 'Software Engineer',
    missionStartDate: settings.missionStartDate || new Date().toISOString().split('T')[0],
    missionDuration: settings.missionDuration || 60,
    targetApplications: settings.targetApplications || 2000,
    targetInterviews: settings.targetInterviews || 50,
    targetOffers: settings.targetOffers || 1,
  });
  const [saved, setSaved] = useState(false);

  const setFormField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    toast.success('Settings saved!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-hunt-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          importAllData(data);
          toast.success('Data imported! Refreshing...');
          setTimeout(() => window.location.reload(), 1500);
        } catch {
          toast.error('Invalid backup file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAll = () => {
    if (confirm('⚠️ This will delete ALL your data. Are you absolutely sure?')) {
      if (confirm('Last chance! This cannot be undone. Delete everything?')) {
        localStorage.clear();
        toast.success('All data cleared. Refreshing...');
        setTimeout(() => window.location.reload(), 1500);
      }
    }
  };

  const Section = ({ title, children }) => (
    <div className="glass-card p-6 space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-200 dark:border-white/10 pb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile */}
      <Section title="👤 Profile Settings">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Your Name</label>
            <input className="input-field" value={form.name} onChange={e => setFormField('name', e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="form-label">Target Role</label>
            <input className="input-field" value={form.role} onChange={e => setFormField('role', e.target.value)} placeholder="Software Engineer" />
          </div>
        </div>
      </Section>

      {/* Mission Settings */}
      <Section title="🎯 Mission Configuration">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Mission Start Date</label>
            <input type="date" className="input-field" value={form.missionStartDate} onChange={e => setFormField('missionStartDate', e.target.value)} />
          </div>
          <div>
            <label className="form-label">Mission Duration (Days)</label>
            <input type="number" className="input-field" value={form.missionDuration} onChange={e => setFormField('missionDuration', Number(e.target.value))} min="1" max="365" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="form-label">Target Applications</label>
            <input type="number" className="input-field" value={form.targetApplications} onChange={e => setFormField('targetApplications', Number(e.target.value))} min="1" />
          </div>
          <div>
            <label className="form-label">Target Interviews</label>
            <input type="number" className="input-field" value={form.targetInterviews} onChange={e => setFormField('targetInterviews', Number(e.target.value))} min="1" />
          </div>
          <div>
            <label className="form-label">Target Offers</label>
            <input type="number" className="input-field" value={form.targetOffers} onChange={e => setFormField('targetOffers', Number(e.target.value))} min="1" />
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="🎨 Appearance">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl flex-wrap gap-4">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Theme</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Currently: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
          </div>
          <button onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all border-0 cursor-pointer ${theme === 'dark' ? 'bg-yellow-500 hover:bg-yellow-400 text-dark-900' : 'bg-dark-800 hover:bg-dark-700 text-white'}`}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </Section>

      {/* Save */}
      <Button
        onClick={handleSave}
        variant={saved ? 'success' : 'primary'}
        className="w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
      >
        {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
        {saved ? 'Settings Saved!' : 'Save Settings'}
      </Button>

      {/* Data Management */}
      <Section title="💾 Data Management">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.button onClick={handleExport} whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-xl font-semibold transition-all border border-blue-200 dark:border-blue-500/20 cursor-pointer">
            <Download className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm">Export Backup</p>
              <p className="text-xs opacity-70">Download all data as JSON</p>
            </div>
          </motion.button>

          <motion.button onClick={handleImport} whileHover={{ scale: 1.02 }} className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 text-green-700 dark:text-green-400 rounded-xl font-semibold transition-all border border-green-200 dark:border-green-500/20 cursor-pointer">
            <Upload className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm">Import Backup</p>
              <p className="text-xs opacity-70">Restore from JSON backup</p>
            </div>
          </motion.button>
        </div>

        <div className="border-t border-slate-200 dark:border-white/10 pt-4">
          <motion.button onClick={handleClearAll} whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-4 w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 rounded-xl font-semibold transition-all border border-red-200 dark:border-red-500/20 cursor-pointer">
            <Trash2 className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm">Clear All Data</p>
              <p className="text-xs opacity-70">⚠️ This permanently deletes everything</p>
            </div>
          </motion.button>
        </div>
      </Section>

      {/* About */}
      <div className="glass-card p-6 text-center text-slate-500 dark:text-slate-400">
        <p className="text-2xl font-bold text-gradient mb-1">Job Hunt OS</p>
        <p className="text-sm">Your Personal Career Command Center</p>
        <p className="text-xs mt-3 opacity-60">v1.0.0 · All data stored locally in your browser · No account required</p>
      </div>
    </div>
  );
}

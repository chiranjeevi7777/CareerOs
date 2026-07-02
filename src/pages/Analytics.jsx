import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import { Sparkles, Brain, Lightbulb, RefreshCw, AlertTriangle, ArrowRight, Zap, Target } from 'lucide-react';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#22c55e', '#f97316', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
        {label && <p className="text-slate-400 mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-bold text-white">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

function ChartCard({ title, children, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card p-5 ${className}`}>
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function Analytics() {
  const { applications, interviews, dsa, missions, missionTemplates, networking } = useApp();

  // Applications per day (last 14 days)
  const appsPerDay = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().split('T')[0];
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        apps: applications.filter(a => (a.applicationDate || a.createdAt?.split('T')[0]) === key).length,
      };
    });
  }, [applications]);

  // Applications per platform
  const appsByPlatform = useMemo(() => {
    const counts = {};
    applications.forEach(a => { counts[a.platform || 'Other'] = (counts[a.platform || 'Other'] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  // Status distribution
  const statusDist = useMemo(() => {
    const counts = {};
    applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  // DSA by topic
  const dsaByTopic = useMemo(() => {
    const counts = {};
    dsa.forEach(d => { counts[d.topic] = (counts[d.topic] || 0) + 1; });
    return Object.entries(counts).map(([topic, count]) => ({ topic, count }));
  }, [dsa]);

  // DSA by difficulty
  const dsaByDiff = useMemo(() => {
    return [
      { name: 'Easy', value: dsa.filter(d => d.difficulty === 'Easy').length, color: '#22c55e' },
      { name: 'Medium', value: dsa.filter(d => d.difficulty === 'Medium').length, color: '#f59e0b' },
      { name: 'Hard', value: dsa.filter(d => d.difficulty === 'Hard').length, color: '#ef4444' },
    ];
  }, [dsa]);

  // Daily goal completion (last 7 days)
  const goalCompletion = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      const dayM = missions[key] || {};
      const done = missionTemplates.filter(t => {
        const v = dayM[t.id];
        return t.type === 'checkbox' ? v === true : Number(v) >= t.target;
      }).length;
      const pct = missionTemplates.length > 0 ? Math.round((done / missionTemplates.length) * 100) : 0;
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completion: pct,
      };
    });
  }, [missions, missionTemplates]);

  // Networking by day
  const networkingPerDay = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        connections: networking.filter(n => n.connectionDate === key).length,
      };
    });
  }, [networking]);

  // Interview success rate by round
  const interviewByRound = useMemo(() => {
    const rounds = {};
    interviews.forEach(iv => {
      if (!rounds[iv.round]) rounds[iv.round] = { total: 0, passed: 0 };
      rounds[iv.round].total++;
      if (iv.result === 'Passed') rounds[iv.round].passed++;
    });
    return Object.entries(rounds).map(([round, { total, passed }]) => ({
      round,
      total,
      passed,
      rate: total > 0 ? Math.round((passed / total) * 100) : 0,
    }));
  }, [interviews]);

  const chartTheme = {
    grid: 'rgba(255,255,255,0.05)',
    text: '#94a3b8',
  };

  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/analytics-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applications,
          interviews,
          dsa,
          networking,
          settings: {}
        })
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (e) {
      console.error("Failed to load AI insights", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [applications.length, interviews.length, dsa.length, networking.length]);

  return (
    <div className="space-y-6">
      {/* AI Performance Insights Header/Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden"
        style={{
          border: '1px solid rgba(139, 92, 246, 0.25)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: '#8b5cf6', filter: 'blur(30px)' }} />

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-1.5 text-base">
                AI Copilot Weekly Performance Insights <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Data-driven performance analysis and strategy recommendation</p>
            </div>
          </div>
          <button
            onClick={fetchInsights}
            disabled={loadingInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 text-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingInsights ? 'animate-spin' : ''}`} />
            {loadingInsights ? 'Analyzing...' : 'Re-Analyze'}
          </button>
        </div>

        {loadingInsights && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Evaluating historical pipeline logs and computing feedback metrics...</p>
          </div>
        )}

        {!loadingInsights && !insights && (
          <div className="text-center py-6 text-slate-500 text-sm">
            No insights compiled. Click "Re-Analyze" to generate.
          </div>
        )}

        {!loadingInsights && insights && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              {insights.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.insights.map((ins, i) => {
                const colors = {
                  positive: { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)', text: '#10b981', label: 'Positive Trend' },
                  warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)', text: '#f59e0b', label: 'Priority Action' },
                  info: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)', text: '#3b82f6', label: 'Recommendation' }
                }[ins.type || 'info'];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border flex flex-col justify-between gap-3 h-full"
                    style={{ background: colors.bg, borderColor: colors.border }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: colors.text }}>
                          {colors.label}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                          {ins.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm mt-2">{ins.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ins.description}</p>
                    </div>

                    <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                      <span className="text-[10px] font-bold text-purple-400 block mb-0.5">NEXT STEP:</span>
                      <p className="text-xs text-slate-300 font-medium">{ins.action_item}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
              <span className="font-bold text-purple-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                Weekly Target Focus
              </span>
              <span className="text-slate-300 font-medium">{insights.recommended_focus}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: applications.length, color: '#6366f1' },
          { label: 'Total Interviews', value: interviews.length, color: '#10b981' },
          { label: 'DSA Problems', value: dsa.length, color: '#8b5cf6' },
          { label: 'Network Size', value: networking.length, color: '#ec4899' },
        ].map(({ label, value, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="kpi-card">
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="📋 Applications Per Day (Last 14 Days)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appsPerDay} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: chartTheme.text }} />
              <YAxis tick={{ fontSize: 10, fill: chartTheme.text }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="apps" fill="#6366f1" radius={[4, 4, 0, 0]} name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🎯 Daily Goal Completion (Last 7 Days)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={goalCompletion} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: chartTheme.text }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: chartTheme.text }} />
              <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v}%`, 'Completion']} />
              <Line type="monotone" dataKey="completion" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} name="Completion %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="🌐 Applications by Platform">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={appsByPlatform} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {appsByPlatform.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {appsByPlatform.length === 0 && <p className="text-center text-slate-400 text-sm">No data yet</p>}
        </ChartCard>

        <ChartCard title="📊 Application Status Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {statusDist.map((entry, i) => {
                  const colors = { Applied: '#3b82f6', Assessment: '#f59e0b', Shortlisted: '#8b5cf6', Interview: '#10b981', Rejected: '#ef4444', Offer: '#22c55e' };
                  return <Cell key={i} fill={colors[entry.name] || COLORS[i % COLORS.length]} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
          {statusDist.length === 0 && <p className="text-center text-slate-400 text-sm">No data yet</p>}
        </ChartCard>

        <ChartCard title="💡 DSA Difficulty Breakdown">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={dsaByDiff} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {dsaByDiff.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
          {dsa.length === 0 && <p className="text-center text-slate-400 text-sm">No data yet</p>}
        </ChartCard>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="🧩 DSA Problems by Topic">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dsaByTopic} layout="vertical" margin={{ top: 5, right: 15, bottom: 5, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: chartTheme.text }} />
              <YAxis type="category" dataKey="topic" tick={{ fontSize: 10, fill: chartTheme.text }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Problems" />
            </BarChart>
          </ResponsiveContainer>
          {dsaByTopic.length === 0 && <p className="text-center text-slate-400 text-sm">No data yet</p>}
        </ChartCard>

        <ChartCard title="🤝 Networking Activity (Last 7 Days)">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={networkingPerDay} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: chartTheme.text }} />
              <YAxis tick={{ fontSize: 10, fill: chartTheme.text }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="connections" fill="#ec4899" radius={[4, 4, 0, 0]} name="Connections" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Interview Success Rate */}
      {interviewByRound.length > 0 && (
        <ChartCard title="🎤 Interview Success Rate by Round">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Round</th><th>Total</th><th>Passed</th><th>Success Rate</th></tr></thead>
              <tbody>
                {interviewByRound.map(({ round, total, passed, rate }) => (
                  <tr key={round}>
                    <td className="font-semibold dark:text-white">{round}</td>
                    <td>{total}</td>
                    <td className="text-success-500 font-semibold">{passed}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-success-500 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-xs font-bold text-success-500">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}
    </div>
  );
}

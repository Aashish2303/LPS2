import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  User
} from 'lucide-react';
import { LPSData, MetricRecord, NavItemKey } from '../../types';
import { formatDate, getCoachingDiagnosis } from '../../services/storage';

interface DashboardViewProps {
  data: LPSData;
  currentWeek: string;
  metrics: MetricRecord;
  onNavigate: (nav: NavItemKey) => void;
  onResolveConstraint?: (constraintId: string) => void;
  onQuickLogConstraint?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  currentWeek,
  metrics,
  onNavigate,
  onResolveConstraint
}) => {
  const coaching = getCoachingDiagnosis(metrics.ppc, metrics.tmr);

  // Open constraints with task description, area, and days open
  const openConstraints = data.constraints
    .filter((c) => c.status !== 'Resolved')
    .map((c) => {
      const task = data.tasks.find((t) => t.id === c.task_id);
      const raisedTime = new Date(c.raised_date || '2026-08-20').getTime();
      const nowTime = new Date('2026-08-25').getTime();
      const daysOpen = Math.max(1, Math.floor((nowTime - raisedTime) / 86400000));
      return {
        ...c,
        taskDescription: task?.description || c.task_id,
        taskArea: task?.location || 'General Site',
        taskTrade: task?.trade || 'General',
        daysOpen
      };
    });

  return (
    <div id="dashboard-view" className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* 4 Top KPI Metric Cards Grid */}
      <div id="dashboard-kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. PPC Card */}
        <div
          id="kpi-card-ppc"
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-t-4 border-amber-500 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-all duration-200"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            PPC (Percent Plan Complete)
          </p>
          <p className="text-4xl font-bold text-amber-500 mt-2 font-mono">
            {metrics.ppc !== null ? `${metrics.ppc}%` : '78%'}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            {metrics.total_committed > 0
              ? `${metrics.total_done} of ${metrics.total_committed} promises completed`
              : 'Target ≥ 80% on-time completion'}
          </p>
          <div className="absolute bottom-0 right-0 p-4 opacity-10 text-6xl select-none group-hover:scale-110 transition-transform">
            📈
          </div>
        </div>

        {/* 2. TA Card */}
        <div
          id="kpi-card-ta"
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-t-4 border-emerald-500 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-all duration-200"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            TA (Tasks Available)
          </p>
          <p className="text-4xl font-bold text-emerald-500 mt-2 font-mono">
            {metrics.ta || 14}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Unblocked tasks in lookahead horizon
          </p>
          <div className="absolute bottom-0 right-0 p-4 opacity-10 text-6xl select-none group-hover:scale-110 transition-transform">
            📦
          </div>
        </div>

        {/* 3. TMR Card */}
        <div
          id="kpi-card-tmr"
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-t-4 border-amber-600 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-all duration-200"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            TMR (Made Ready %)
          </p>
          <p className="text-4xl font-bold text-amber-600 mt-2 font-mono">
            {metrics.tmr !== null ? `${metrics.tmr}%` : '62%'}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Lookahead make-ready filtration rate
          </p>
          <div className="absolute bottom-0 right-0 p-4 opacity-10 text-6xl select-none group-hover:scale-110 transition-transform">
            🛠️
          </div>
        </div>

        {/* 4. CRR Card */}
        <div
          id="kpi-card-crr"
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-t-4 border-red-500 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-all duration-200"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            CRR (Constraint Resolution)
          </p>
          <p className="text-4xl font-bold text-red-500 mt-2 font-mono">
            {metrics.crr !== null ? `${metrics.crr}%` : '45%'}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            {openConstraints.length} active roadblock{openConstraints.length === 1 ? '' : 's'} remaining
          </p>
          <div className="absolute bottom-0 right-0 p-4 opacity-10 text-6xl select-none group-hover:scale-110 transition-transform">
            ⛓️
          </div>
        </div>
      </div>

      {/* Coaching Insight Banner */}
      <div
        id="dashboard-coaching-banner"
        className="bg-amber-900/20 border border-amber-500/50 p-4 rounded-xl flex items-start gap-4 shadow-lg"
      >
        <div className="p-2 bg-amber-500 rounded-lg text-slate-900 text-xl leading-none font-bold shrink-0">
          💡
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-amber-400 font-bold text-sm uppercase tracking-wide">
              {coaching?.title || 'Coaching Insight: Planning quality needs attention'}
            </h3>
            <button
              id="btn-coaching-link"
              onClick={() => onNavigate('metrics-coaching')}
              className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Coaching Panel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-300 text-sm mt-1 leading-relaxed">
            {coaching?.message ||
              'High TMR (62%) combined with lower PPC (78%) suggests tasks are being made ready but execution variability is high. Review crew supervision and daily coordination.'}
          </p>
        </div>
      </div>

      {/* Critical Open Constraints Table Section */}
      <div
        id="dashboard-constraints-card"
        className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">
            Critical Open Constraints
          </h3>
          <span className="bg-red-500/20 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
            {openConstraints.length} ACTIVE BLOCKS
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          {openConstraints.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-200">Zero Open Constraints</p>
              <p className="text-xs text-slate-400 mt-1">
                All scheduled tasks in the lookahead horizon are 100% make-ready.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-900/40 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3">Task Description</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Responsible</th>
                  <th className="px-6 py-3">Target Date</th>
                  <th className="px-6 py-3 text-right">Days Open</th>
                  {onResolveConstraint && <th className="px-6 py-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {openConstraints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-100">{c.taskDescription}</p>
                      <p className="text-[10px] text-slate-500">Area: {c.taskArea}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-700 px-2 py-1 rounded text-xs text-slate-300 font-medium">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{c.responsible}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                      {formatDate(c.target_date)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs">
                      <span className={c.daysOpen >= 5 ? 'text-red-400 font-bold' : c.daysOpen >= 2 ? 'text-amber-500 font-semibold' : 'text-slate-400'}>
                        {c.daysOpen}d
                      </span>
                    </td>
                    {onResolveConstraint && (
                      <td className="px-6 py-4 text-right">
                        <button
                          id={`btn-resolve-dash-${c.id}`}
                          onClick={() => onResolveConstraint(c.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Resolve
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};


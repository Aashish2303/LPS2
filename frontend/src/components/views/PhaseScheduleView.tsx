import React, { useState } from 'react';
import { Plus, GitBranch, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';
import { LPSData, Phase } from '../../types';
import { formatDate, generateId } from '../../services/storage';

interface PhaseScheduleViewProps {
  data: LPSData;
  onAddPhase: (phase: Phase) => void;
  onUpdatePhaseStatus: (phaseId: string, status: Phase['status']) => void;
}

export const PhaseScheduleView: React.FC<PhaseScheduleViewProps> = ({
  data,
  onAddPhase,
  onUpdatePhaseStatus
}) => {
  const [phaseName, setPhaseName] = useState('');
  const [milestone, setMilestone] = useState('');
  const [plannedStart, setPlannedStart] = useState('');
  const [plannedFinish, setPlannedFinish] = useState('');
  const [responsible, setResponsible] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseName.trim() || !milestone.trim() || !plannedStart || !plannedFinish) return;

    const newPhase: Phase = {
      id: generateId('PHA'),
      phase_name: phaseName.trim(),
      milestone: milestone.trim(),
      planned_start: plannedStart,
      planned_finish: plannedFinish,
      responsible: responsible.trim() || 'Site Superintendent',
      status: 'Planned'
    };

    onAddPhase(newPhase);
    setPhaseName('');
    setMilestone('');
    setPlannedStart('');
    setPlannedFinish('');
    setResponsible('');
  };

  const calculatePhaseFloat = (finishDateStr: string) => {
    if (!finishDateStr) return 0;
    const finish = new Date(finishDateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    return Math.floor((finish - today) / 86400000);
  };

  return (
    <div id="phase-schedule-view" className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-5 rounded-lg bg-[#1e293b] border border-[#334155] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#f8fafc] flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-[#f59e0b]" />
            <span>Master Phase Schedule & Milestone Baseline</span>
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1">
            Top-tier LPS structure. Pull planning reverse-engineers backwards from these milestones.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-[#334155] text-[#94a3b8]">
            <span className="text-[#f8fafc] font-bold">{data.phases.length}</span> Milestones Defined
          </div>
        </div>
      </div>

      {/* Add Milestone Form Card */}
      <div id="card-add-phase" className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg">
        <h3 className="text-sm font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#f59e0b]" />
          <span>Add New Project Milestone</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-phase-name">
                Phase / Section Name *
              </label>
              <input
                id="input-phase-name"
                type="text"
                required
                value={phaseName}
                onChange={(e) => setPhaseName(e.target.value)}
                placeholder="e.g. Phase 4: Tower Superstructure L5-L10"
                className="w-full px-3.5 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-milestone-desc">
                Milestone Handoff Description *
              </label>
              <input
                id="input-milestone-desc"
                type="text"
                required
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                placeholder="e.g. All columns Level 9 poured and cured"
                className="w-full px-3.5 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-phase-start">
                Planned Start Date *
              </label>
              <input
                id="input-phase-start"
                type="date"
                required
                value={plannedStart}
                onChange={(e) => setPlannedStart(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-phase-finish">
                Planned Finish (Target Milestone Date) *
              </label>
              <input
                id="input-phase-finish"
                type="date"
                required
                value={plannedFinish}
                onChange={(e) => setPlannedFinish(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-phase-responsible">
                Responsible Phase Lead / Trade Coordinator
              </label>
              <input
                id="input-phase-responsible"
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="e.g. Rajesh Kumar (Senior Structural Lead)"
                className="w-full px-3.5 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="btn-add-milestone"
              type="submit"
              className="px-5 py-2.5 bg-[#f59e0b] hover:bg-amber-600 active:scale-[0.98] text-[#0f172a] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Milestone</span>
            </button>
          </div>
        </form>
      </div>

      {/* Phase Visual Timeline Section */}
      <div id="phase-timeline-section" className="space-y-4">
        <h3 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#f59e0b]" />
          <span>Milestone Sequence & Float Timeline</span>
        </h3>

        {data.phases.length === 0 ? (
          <div className="p-12 text-center bg-[#1e293b] border border-dashed border-[#334155] rounded-lg text-[#94a3b8]">
            <GitBranch className="w-10 h-10 mx-auto text-[#64748b] mb-2" />
            <p className="font-semibold text-[#f8fafc]">No Milestones Added Yet</p>
            <p className="text-xs mt-1">Add your first project milestone above to kick off pull planning.</p>
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-[#334155] ml-4 space-y-6">
            {data.phases.map((phase) => {
              const floatDays = calculatePhaseFloat(phase.planned_finish);
              const isCritical = floatDays <= 0;
              const isWarning = floatDays > 0 && floatDays <= 14;

              const floatBadge = isCritical ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-[#ef4444] border border-red-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>⚠️ CRITICAL ({floatDays}d float)</span>
                </span>
              ) : isWarning ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-[#f59e0b] border border-amber-500/30">
                  {floatDays} days float
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-[#10b981] border border-emerald-500/30">
                  {floatDays} days float
                </span>
              );

              return (
                <div key={phase.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] top-6 w-4 h-4 rounded-full border-2 border-[#0f172a] shadow-xs ${
                      phase.status === 'Complete'
                        ? 'bg-[#10b981]'
                        : phase.status === 'Active'
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#64748b]'
                    }`}
                  />

                  {/* Phase Card */}
                  <div className="p-5 rounded-lg bg-[#1e293b] border border-[#334155] hover:border-[#64748b] transition-all shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#334155]/60">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-[#f59e0b] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {phase.id}
                          </span>
                          <h4 className="text-sm font-bold text-[#f8fafc]">{phase.phase_name}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {floatBadge}
                        <select
                          id={`select-status-${phase.id}`}
                          value={phase.status}
                          onChange={(e) => onUpdatePhaseStatus(phase.id, e.target.value as Phase['status'])}
                          className="bg-[#0f172a] border border-[#334155] rounded-md px-2.5 py-1 text-xs text-[#f8fafc] font-medium focus:border-[#f59e0b] focus:outline-none"
                        >
                          <option value="Planned">Planned</option>
                          <option value="Active">Active</option>
                          <option value="Complete">Complete</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3.5 space-y-2">
                      <div className="text-xs font-semibold text-[#f8fafc] flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-[#10b981]" />
                        <span>Milestone Criteria: {phase.milestone}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#94a3b8] pt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                          <span>
                            {formatDate(phase.planned_start)} → <strong className="text-[#f8fafc]">{formatDate(phase.planned_finish)}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#94a3b8]" />
                          <span>Lead: {phase.responsible}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

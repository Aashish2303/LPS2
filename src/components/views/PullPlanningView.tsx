import React, { useState } from 'react';
import {
  Layers,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  User,
  MapPin,
  Clock,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { Constraint, ConstraintType, LPSData, Task } from '../../types';
import { computeFloat, formatDate, generateId, getOpenConstraintCount } from '../../services/storage';
import { Modal } from '../Modal';

interface PullPlanningViewProps {
  data: LPSData;
  onAddTask: (task: Task) => void;
  onAddConstraint: (constraint: Constraint) => void;
}

export const PullPlanningView: React.FC<PullPlanningViewProps> = ({
  data,
  onAddTask,
  onAddConstraint
}) => {
  // New Task form state
  const [phaseId, setPhaseId] = useState(data.phases[0]?.id || '');
  const [trade, setTrade] = useState(data.trades[0]?.name || 'Civil & Earthworks');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [location, setLocation] = useState(data.areas[0]?.name || 'Zone A - Level 1');
  const [durationDays, setDurationDays] = useState(3);
  const [mustFinishBy, setMustFinishBy] = useState('');
  const [uom, setUom] = useState('nos');

  // Constraint Modal state
  const [isConstraintModalOpen, setIsConstraintModalOpen] = useState(false);
  const [selectedTaskForConstraint, setSelectedTaskForConstraint] = useState<Task | null>(null);
  const [cType, setCType] = useState<ConstraintType>('Materials');
  const [cDesc, setCDesc] = useState('');
  const [cRaisedBy, setCRaisedBy] = useState('');
  const [cResponsible, setCResponsible] = useState('');
  const [cTargetDate, setCTargetDate] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !mustFinishBy || !phaseId) return;

    const newTask: Task = {
      id: generateId('TSK'),
      phase_id: phaseId,
      trade: trade.trim(),
      description: description.trim(),
      responsible: responsible.trim() || 'Trade Foreman',
      location: location.trim() || 'Main Deck',
      duration_days: Number(durationDays) || 3,
      must_finish_by: mustFinishBy,
      uom: uom.trim() || 'unit',
      status: 'Planned'
    };

    onAddTask(newTask);
    setDescription('');
    setResponsible('');
    setMustFinishBy('');
  };

  const handleOpenConstraintModal = (task: Task) => {
    setSelectedTaskForConstraint(task);
    setCDesc('');
    setCRaisedBy(task.responsible || '');
    setCResponsible('');
    setCTargetDate(task.must_finish_by || '');
    setIsConstraintModalOpen(true);
  };

  const handleSaveConstraint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForConstraint || !cDesc.trim() || !cResponsible.trim() || !cTargetDate) return;

    const newConstraint: Constraint = {
      id: generateId('CON'),
      task_id: selectedTaskForConstraint.id,
      type: cType,
      description: cDesc.trim(),
      raised_by: cRaisedBy.trim() || 'Site Team',
      responsible: cResponsible.trim(),
      raised_date: new Date().toISOString().split('T')[0],
      target_date: cTargetDate,
      status: 'Open'
    };

    onAddConstraint(newConstraint);
    setIsConstraintModalOpen(false);
    setSelectedTaskForConstraint(null);
  };

  return (
    <div id="pull-planning-view" className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Overview Card */}
      <div className="p-5 rounded-lg bg-[#1e293b] border border-[#334155] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#f8fafc] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#f59e0b]" />
            <span>Pull Planning & Handoff Task Board</span>
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1">
            Work backwards from target milestones. Keep tasks short (&lt;5 days) with clear trade handoffs.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-[#334155] text-[#94a3b8]">
            <strong className="text-[#f8fafc]">{data.tasks.length}</strong> Pull Tasks
          </span>
        </div>
      </div>

      {/* Add Task Form Card */}
      <div id="card-add-task" className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg">
        <h3 className="text-sm font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#f59e0b]" />
          <span>Add Pull Planning Task (Handoff Note)</span>
        </h3>

        {data.phases.length === 0 ? (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            ⚠️ Please add at least one Milestone Phase under Plan → Phase Schedule first.
          </div>
        ) : (
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Phase Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="select-task-phase">
                  Phase / Milestone *
                </label>
                <select
                  id="select-task-phase"
                  required
                  value={phaseId}
                  onChange={(e) => setPhaseId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
                >
                  {data.phases.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.phase_name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Trade */}
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-task-trade">
                  Trade *
                </label>
                <select
                  id="input-task-trade"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
                >
                  {data.trades.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.abbr})
                    </option>
                  ))}
                </select>
              </div>

              {/* Responsible */}
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-task-responsible">
                  Responsible Person / Foreman
                </label>
                <input
                  id="input-task-responsible"
                  type="text"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  placeholder="e.g. Gopal Krishna"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-task-location">
                  Location / Zone
                </label>
                <select
                  id="input-task-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
                >
                  {data.areas.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} ({a.zone})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Task Description */}
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-task-desc">
                  Task Description (Granular, &lt;5 days) *
                </label>
                <input
                  id="input-task-desc"
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Level 1 column rebar tying and starter ties (24 nos)"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              {/* Duration Days */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-task-duration">
                  Duration (Days) *
                </label>
                <input
                  id="input-task-duration"
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              {/* Must Finish By */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-task-finish">
                  Must Finish By *
                </label>
                <input
                  id="input-task-finish"
                  type="date"
                  required
                  value={mustFinishBy}
                  onChange={(e) => setMustFinishBy(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              {/* UOM */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-task-uom">
                  UOM (Unit)
                </label>
                <input
                  id="input-task-uom"
                  type="text"
                  value={uom}
                  onChange={(e) => setUom(e.target.value)}
                  placeholder="e.g. m², nos, m"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="btn-add-task-submit"
                type="submit"
                className="px-5 py-2.5 bg-[#f59e0b] hover:bg-amber-600 active:scale-[0.98] text-[#0f172a] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Task to Pull Plan</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Task Cards Grid */}
      <div id="pull-tasks-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#f8fafc] flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#f59e0b]" />
            <span>Pull Plan Tasks ({data.tasks.length})</span>
          </h3>
          <span className="text-xs text-[#94a3b8]">
            Float = (Must Finish By - Today) - Duration Days
          </span>
        </div>

        {data.tasks.length === 0 ? (
          <div className="p-12 text-center bg-[#1e293b] border border-dashed border-[#334155] rounded-lg text-[#94a3b8]">
            <Layers className="w-10 h-10 mx-auto text-[#64748b] mb-2" />
            <p className="font-semibold text-[#f8fafc]">No Pull Plan Tasks Yet</p>
            <p className="text-xs mt-1">Use the form above to add granular task handoffs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.tasks.map((task) => {
              const floatVal = computeFloat(task);
              const openConstraints = getOpenConstraintCount(task.id, data.constraints);
              const isReady = openConstraints === 0;

              // Float bar width clamp between 5% and 100%
              const floatPercent = Math.min(100, Math.max(5, (floatVal / 20) * 100));
              const floatColor =
                floatVal <= 0
                  ? { bar: 'bg-red-500', text: 'text-red-400', pill: 'bg-red-500/20 border-red-500/30' }
                  : floatVal <= 7
                  ? { bar: 'bg-amber-500', text: 'text-amber-400', pill: 'bg-amber-500/20 border-amber-500/30' }
                  : { bar: 'bg-emerald-500', text: 'text-emerald-400', pill: 'bg-emerald-500/20 border-emerald-500/30' };

              return (
                <div
                  key={task.id}
                  id={`card-task-${task.id}`}
                  className="p-5 rounded-lg bg-[#1e293b] border border-[#334155] hover:border-[#64748b] transition-all duration-200 shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Trade & Constraint Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#0f172a] border border-[#334155] text-[#38bdf8]">
                        {task.trade}
                      </span>
                      {isReady ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-[#10b981] border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>✅ Ready</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-[#ef4444] border border-red-500/30 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>⛔ {openConstraints} blocked</span>
                        </span>
                      )}
                    </div>

                    {/* Task Title */}
                    <h4 className="text-sm font-bold text-[#f8fafc] mb-2 leading-snug line-clamp-2">
                      {task.description}
                    </h4>

                    {/* Meta info */}
                    <div className="space-y-1.5 text-xs text-[#94a3b8] mb-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#64748b]" />
                        <span className="text-[#f8fafc]">{task.responsible}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
                        <span>Must Finish: {formatDate(task.must_finish_by)} ({task.duration_days}d dur)</span>
                      </div>
                    </div>
                  </div>

                  {/* Float & Actions */}
                  <div className="pt-3 border-t border-[#334155]/60 space-y-3">
                    {/* Float bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-[#94a3b8]">Buffer Float:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${floatColor.pill} ${floatColor.text}`}>
                          {floatVal <= 0 ? `⚠️ ${floatVal}d (Zero/Neg)` : `${floatVal} days float`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${floatColor.bar} transition-all duration-300`}
                          style={{ width: `${floatPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Add Constraint Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#64748b] font-mono">{task.id}</span>
                      <button
                        id={`btn-add-constraint-${task.id}`}
                        onClick={() => handleOpenConstraintModal(task)}
                        className="px-2.5 py-1 text-xs text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#334155] border border-[#334155] rounded-md transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldAlert className="w-3 h-3 text-[#f59e0b]" />
                        <span>+ Add Constraint</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Constraint Modal */}
      <Modal
        isOpen={isConstraintModalOpen}
        onClose={() => setIsConstraintModalOpen(false)}
        title="Log Task Constraint / Roadblock"
        subtitle={selectedTaskForConstraint ? `For Task: ${selectedTaskForConstraint.description}` : ''}
      >
        <form onSubmit={handleSaveConstraint} className="space-y-4">
          <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] text-xs space-y-1">
            <div className="text-[#94a3b8]">Associated Task:</div>
            <div className="font-bold text-[#f8fafc]">{selectedTaskForConstraint?.description}</div>
            <div className="text-[#38bdf8]">{selectedTaskForConstraint?.trade} • Must finish: {formatDate(selectedTaskForConstraint?.must_finish_by)}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="select-constraint-type">
                Constraint Type *
              </label>
              <select
                id="select-constraint-type"
                value={cType}
                onChange={(e) => setCType(e.target.value as ConstraintType)}
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
              >
                <option value="Materials">Materials (Delivery, Spec, QA)</option>
                <option value="Drawings">Drawings / RFI / Specs</option>
                <option value="Workforce">Workforce & Trade Crew</option>
                <option value="Equipment">Equipment & Plant Crane</option>
                <option value="Approvals">Approvals & Permits</option>
                <option value="Prerequisite">Prerequisite Preceding Trade</option>
                <option value="Space">Space & Site Logistics</option>
                <option value="Safety">Safety & Environmental Hold</option>
                <option value="Client">Client / Consultant Decision</option>
                <option value="Other">Other Operational Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-constraint-target-date">
                Committed Target Clearance Date *
              </label>
              <input
                id="input-constraint-target-date"
                type="date"
                required
                value={cTargetDate}
                onChange={(e) => setCTargetDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-constraint-raised-by">
                Raised By (Foreman / Trade)
              </label>
              <input
                id="input-constraint-raised-by"
                type="text"
                value={cRaisedBy}
                onChange={(e) => setCRaisedBy(e.target.value)}
                placeholder="e.g. Gopal Krishna"
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-constraint-responsible">
                Responsible Owner (To Clear) *
              </label>
              <input
                id="input-constraint-responsible"
                type="text"
                required
                value={cResponsible}
                onChange={(e) => setCResponsible(e.target.value)}
                placeholder="e.g. Murugan (Storekeeper) / Ananya (Design)"
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-constraint-desc">
                Constraint Description & Action Required *
              </label>
              <textarea
                id="input-constraint-desc"
                rows={3}
                required
                value={cDesc}
                onChange={(e) => setCDesc(e.target.value)}
                placeholder="Describe the exact missing condition (e.g. Need revised structural shop drawings for column splices before rebar can proceed)"
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] placeholder-[#64748b] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#334155]">
            <button
              type="button"
              onClick={() => setIsConstraintModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#334155] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-constraint"
              type="submit"
              className="px-4 py-2 bg-[#f59e0b] hover:bg-amber-600 text-[#0f172a] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Log Constraint</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

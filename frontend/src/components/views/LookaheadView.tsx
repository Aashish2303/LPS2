import React, { useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight,
  User,
  MapPin,
  Clock
} from 'lucide-react';

import {
  LPSData,
  LookaheadItem
} from '../../types';

import {
  computeFloat,
  formatDate,
  getOpenConstraintCount
} from '../../services/storage';

interface LookaheadViewProps {
  data: LPSData;
  currentWeek: string;
  onAddToLookahead: (item: LookaheadItem) => void;
  onRefreshReadiness: () => void;
  onResolveConstraint: (constraintId: string) => void;
  onNavigateToCommit: () => void;
}

export const LookaheadView: React.FC<LookaheadViewProps> = ({
  data,
  currentWeek,
  onAddToLookahead,
  onRefreshReadiness,
  onResolveConstraint,
  onNavigateToCommit
}) => {
  /*
   * ---------------------------------------------------------
   * STATE
   * ---------------------------------------------------------
   */

  /*
   * ---------------------------------------------------------
   * CURRENT LOOKAHEAD ITEMS
   * ---------------------------------------------------------
   */

  const lookaheadItems = data.lookahead.filter(
    (item) =>
      data.tasks.some(
        (task) =>
          task.id === item.task_id &&
          task.pull_planned === true
      )
  );

  const totalTasks = lookaheadItems.length;

  const readyTasks = lookaheadItems.filter((item) => {
    const openCount = getOpenConstraintCount(
      item.task_id,
      data.constraints
    );

    return openCount === 0;
  });

  const blockedTasks = lookaheadItems.filter((item) => {
    const openCount = getOpenConstraintCount(
      item.task_id,
      data.constraints
    );

    return openCount > 0;
  });

  const tmr =
    totalTasks > 0
      ? Math.round(
          (readyTasks.length / totalTasks) * 100
        )
      : null;

  const isTmrLow =
    tmr !== null && tmr < 70;

  /*
   * ---------------------------------------------------------
   * TMR BADGE
   * ---------------------------------------------------------
   */

  const getTmrBadgeColor = (
    val: number | null
  ) => {
    if (val === null) {
      return 'text-[#94a3b8] bg-slate-800';
    }

    if (val >= 80) {
      return 'text-[#10b981] bg-emerald-500/10 border-emerald-500/30';
    }

    if (val >= 70) {
      return 'text-[#f59e0b] bg-amber-500/10 border-amber-500/30';
    }

    return 'text-[#ef4444] bg-red-500/10 border-red-500/30';
  };

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div
      id="lookahead-view"
      className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in"
    >

      {/* =====================================================
          TOP STATS
          ===================================================== */}

      <div
        id="lookahead-stats-grid"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >

        {/* Active Week */}
        <div className="p-4 rounded-lg bg-[#1e293b] border border-[#334155] shadow-sm">
          <div className="text-xs text-[#94a3b8] uppercase tracking-wider font-semibold">
            Active Lookahead Window
          </div>

          <div className="text-2xl font-extrabold text-[#f59e0b] mt-1.5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#f59e0b]" />
            <span>Week {currentWeek}</span>
          </div>

          <div className="text-xs text-[#94a3b8] mt-1">
            3-6 Week Make-Ready Horizon
          </div>
        </div>

        {/* Pipeline */}
        <div className="p-4 rounded-lg bg-[#1e293b] border border-[#334155] shadow-sm">
          <div className="text-xs text-[#94a3b8] uppercase tracking-wider font-semibold">
            Lookahead Pipeline Size
          </div>

          <div className="text-2xl font-extrabold text-[#f8fafc] mt-1.5 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#38bdf8]" />
            <span>{totalTasks} Tasks</span>
          </div>

          <div className="text-xs text-[#94a3b8] mt-1">
            <span className="text-[#10b981] font-semibold">
              {readyTasks.length} ready
            </span>

            {' • '}

            <span className="text-[#ef4444] font-semibold">
              {blockedTasks.length} blocked
            </span>
          </div>
        </div>

        {/* TMR */}
        <div className="p-4 rounded-lg bg-[#1e293b] border border-[#334155] shadow-sm">
          <div className="text-xs text-[#94a3b8] uppercase tracking-wider font-semibold">
            Tasks Made Ready (TMR)
          </div>

          <div className="text-2xl font-extrabold mt-1.5 flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-md border text-xl ${getTmrBadgeColor(
                tmr
              )}`}
            >
              {tmr !== null
                ? `${tmr}%`
                : 'n/a'}
            </span>
          </div>

          <div className="text-xs text-[#94a3b8] mt-1">
            Target: ≥ 70% make-ready throughput
          </div>
        </div>
      </div>

      {/* =====================================================
          TMR WARNING
          ===================================================== */}

      {isTmrLow && (
        <div
          id="alert-low-tmr"
          className="p-4 rounded-lg bg-red-500/15 border-2 border-red-500/50 text-[#f8fafc] flex items-center gap-3 animate-pulse"
        >
          <AlertTriangle className="w-6 h-6 text-[#ef4444] shrink-0" />

          <div className="flex-1 text-xs">
            <div className="font-bold text-sm text-[#ef4444]">
              TMR below 70% ({tmr}%)
              — Constraints are not being cleared fast enough!
            </div>

            <div className="text-slate-300 mt-0.5">
              Work cannot flow reliably into the Weekly Work Plan.
              Escalate blocked drawings, material arrivals, and approvals immediately.
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Automatically pulled from Pull Planning
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Tasks selected in Pull Planning are automatically added
              to the Lookahead horizon.
            </p>
          </div>

          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {lookaheadItems.length} task
            {lookaheadItems.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* =====================================================
          KANBAN BOARD
          ===================================================== */}

      <div
        id="lookahead-kanban-board"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >

        {/* ===================================================
            LEFT: NEEDS CLEARING
            =================================================== */}

        <div
          id="kanban-column-blocked"
          className="bg-[#1e293b] border border-red-500/30 rounded-lg p-5 flex flex-col shadow-md"
        >

          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#334155]">

            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#ef4444]" />

              <h3 className="text-sm font-bold text-[#f8fafc]">
                ⛔ Needs Clearing (Open Constraints)
              </h3>
            </div>

            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-red-500/20 text-[#ef4444] border border-red-500/30">
              {blockedTasks.length}
            </span>

          </div>

          {blockedTasks.length === 0 ? (

            <div className="py-12 text-center text-[#94a3b8] border border-dashed border-[#334155] rounded-lg">

              <CheckCircle2 className="w-8 h-8 text-[#10b981] mx-auto mb-2 opacity-80" />

              <p className="text-xs font-semibold text-[#f8fafc]">
                Zero Blocked Tasks!
              </p>

              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                All lookahead items are fully make-ready.
              </p>

            </div>

          ) : (

            <div className="space-y-3 flex-1 overflow-y-auto">

              {blockedTasks.map((item) => {

                const task = data.tasks.find(
                  (t) => t.id === item.task_id
                );

                if (!task) return null;

                const taskConstraints =
                  data.constraints.filter(
                    (c) =>
                      c.task_id === task.id &&
                      c.status !== 'Resolved'
                  );

                const floatVal =
                  computeFloat(task);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-[#0f172a] border border-[#334155] hover:border-red-500/50 transition-all duration-200 shadow-sm space-y-3"
                  >

                    <div className="flex items-start justify-between gap-2">

                      <div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-[#38bdf8] border border-slate-700">
                          {task.trade}
                        </span>

                        <h4 className="text-xs font-bold text-[#f8fafc] mt-1.5 leading-snug">
                          {task.description}
                        </h4>

                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-[#ef4444] border border-red-500/30 shrink-0">
                        ⛔ {taskConstraints.length} open
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">

                      <span>
                        Week: {item.week_key}
                        {' • '}
                        Qty: {item.planned_qty} {task.uom}
                      </span>

                      <span className="font-mono text-[10px]">
                        Float: {floatVal}d
                      </span>

                    </div>

                    {item.notes && (
                      <div className="text-[11px] text-[#64748b] bg-slate-900/80 p-2 rounded border border-slate-800">
                        {item.notes}
                      </div>
                    )}

                    <div className="space-y-2 pt-2 border-t border-[#334155]/60">

                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#ef4444]">
                        Blocking Constraints:
                      </div>

                      {taskConstraints.map((c) => (
                        <div
                          key={c.id}
                          className="p-2 rounded bg-slate-900 border border-[#334155] text-xs flex items-center justify-between gap-2"
                        >

                          <div>

                            <div className="font-semibold text-[11px] text-[#f8fafc]">
                              [{c.type}] {c.description}
                            </div>

                            <div className="text-[10px] text-[#94a3b8]">
                              Owner: {c.responsible}
                              {' • '}
                              Target: {formatDate(c.target_date)}
                            </div>

                          </div>

                          <button
                            id={`btn-resolve-lkh-${c.id}`}
                            onClick={() =>
                              onResolveConstraint(c.id)
                            }
                            className="px-2 py-1 rounded bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#10b981] border border-[#10b981]/40 font-bold text-[10px] transition-all shrink-0 cursor-pointer"
                          >
                            Resolve
                          </button>

                        </div>
                      ))}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ===================================================
            RIGHT: READY TO COMMIT
            =================================================== */}

        <div
          id="kanban-column-ready"
          className="bg-[#1e293b] border border-emerald-500/30 rounded-lg p-5 flex flex-col shadow-md"
        >

          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#334155]">

            <div className="flex items-center gap-2">

              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />

              <h3 className="text-sm font-bold text-[#f8fafc]">
                ✅ Ready to Commit (Zero Roadblocks)
              </h3>

            </div>

            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-[#10b981] border border-emerald-500/30">
              {readyTasks.length}
            </span>

          </div>

          {readyTasks.length === 0 ? (

            <div className="py-12 text-center text-[#94a3b8] border border-dashed border-[#334155] rounded-lg">

              <AlertTriangle className="w-8 h-8 text-[#f59e0b] mx-auto mb-2 opacity-80" />

              <p className="text-xs font-semibold text-[#f8fafc]">
                No Ready Tasks Available
              </p>

              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Resolve constraints in the left column to unblock tasks.
              </p>

            </div>

          ) : (

            <div className="space-y-3 flex-1 overflow-y-auto">

              {readyTasks.map((item) => {

                const task = data.tasks.find(
                  (t) => t.id === item.task_id
                );

                if (!task) return null;

                const floatVal =
                  computeFloat(task);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-[#0f172a] border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 shadow-sm space-y-2.5"
                  >

                    <div className="flex items-start justify-between gap-2">

                      <div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-[#38bdf8] border border-slate-700">
                          {task.trade}
                        </span>

                        <h4 className="text-xs font-bold text-[#f8fafc] mt-1.5 leading-snug">
                          {task.description}
                        </h4>

                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-[#10b981] border border-emerald-500/30 shrink-0">
                        ✅ 100% Ready
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">

                      <span>
                        Week: {item.week_key}
                        {' • '}
                        Qty: {item.planned_qty} {task.uom}
                      </span>

                      <span className="font-mono text-[10px] text-emerald-400">
                        Float: {floatVal}d
                      </span>

                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-1">

                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.responsible}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {task.location}
                      </span>

                    </div>

                    {item.notes && (
                      <div className="text-[11px] text-[#64748b] bg-slate-900/80 p-2 rounded border border-slate-800">
                        {item.notes}
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

          {/* Proceed */}
          <div className="mt-4 pt-3 border-t border-[#334155] text-center">

            <button
              id="btn-goto-weekly-commit"
              onClick={onNavigateToCommit}
              className="w-full py-2.5 bg-[#10b981] hover:bg-emerald-600 active:scale-[0.98] text-[#0f172a] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>
                Proceed to Weekly Commitments
              </span>

              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      {/* =====================================================
          FLOW INFORMATION
          ===================================================== */}

      <div
        id="lookahead-flow-info"
        className="p-4 rounded-lg bg-slate-900/60 border border-[#334155]"
      >

        <div className="flex items-start gap-3">

          <Clock className="w-4 h-4 text-[#38bdf8] mt-0.5 shrink-0" />

          <div>

            <div className="text-xs font-bold text-[#f8fafc]">
              LPS Flow
            </div>

            <div className="text-[11px] text-[#94a3b8] mt-1">
              Imported Phase Schedule → Pull Planning → Lookahead → Weekly Commitments
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
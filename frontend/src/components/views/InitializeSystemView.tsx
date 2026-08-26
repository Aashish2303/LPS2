import React from 'react';
import { Database, RefreshCw, Sparkles, PlusCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LPSData } from '../../types';

interface InitializeSystemViewProps {
  onLoadSampleData: () => void;
  onLoadBlankProject: () => void;
  onNavigateToDashboard: () => void;
}

export const InitializeSystemView: React.FC<InitializeSystemViewProps> = ({
  onLoadSampleData,
  onLoadBlankProject,
  onNavigateToDashboard
}) => {
  return (
    <div id="init-system-view" className="space-y-8 max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-lg font-bold text-[#f8fafc]">System Bootstrap & Project Initialization</h2>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Choose how to populate your Last Planner System environment. All project states are strictly stored in LocalStorage under key <code className="text-[#f59e0b] font-mono">lps_data</code>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preset 1: Full Commercial Sample */}
        <div className="p-6 rounded-xl bg-[#1e293b] border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-[#f59e0b] border border-amber-500/30">
                Recommended
              </span>
              <Sparkles className="w-5 h-5 text-[#f59e0b]" />
            </div>

            <h3 className="text-base font-extrabold text-[#f8fafc]">
              Load Commercial High-Rise Benchmark Project
            </h3>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Populates a realistic 45-storey commercial tower schedule with pre-configured phase milestones, pull planning cards with constraints, lookahead items, and 8 weeks of historical PPC metrics.
            </p>

            <div className="space-y-1.5 text-xs text-[#f8fafc] bg-[#0f172a] p-3.5 rounded-lg border border-[#334155]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>6 Phase Milestones & Backward Schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>12 Pull Planning Sticky Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>8 Constraint Records (Drawings, Permits, Info)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>8 Weeks Performance Log & Trend History</span>
              </div>
            </div>
          </div>

          <button
            id="btn-load-sample-project"
            type="button"
            onClick={() => {
              onLoadSampleData();
              onNavigateToDashboard();
            }}
            className="w-full py-3 bg-[#f59e0b] hover:bg-amber-600 active:scale-[0.98] text-[#0f172a] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Load Commercial Project Preset</span>
          </button>
        </div>

        {/* Preset 2: Clean Blank Project */}
        <div className="p-6 rounded-xl bg-[#1e293b] border border-[#334155] hover:border-slate-500 transition-all shadow-lg space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-[#94a3b8] border border-slate-700">
                Fresh Start
              </span>
              <PlusCircle className="w-5 h-5 text-[#38bdf8]" />
            </div>

            <h3 className="text-base font-extrabold text-[#f8fafc]">
              Initialize Clean Blank Project
            </h3>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Start with empty milestone buffers and pristine task boards. Includes standard Lean trades (Civil, Structural, MEP, Envelope) and basic zone configurations.
            </p>

            <div className="space-y-1.5 text-xs text-[#f8fafc] bg-[#0f172a] p-3.5 rounded-lg border border-[#334155]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Blank Milestone Sequence</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Clean Pull Planning & Lookahead Boards</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Standard Trade Foremen Roster</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>15 Lean Failure Reason Codes Pre-loaded</span>
              </div>
            </div>
          </div>

          <button
            id="btn-init-blank-project"
            type="button"
            onClick={() => {
              onLoadBlankProject();
              onNavigateToDashboard();
            }}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-[#f8fafc] font-bold text-xs rounded-lg border border-[#334155] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#38bdf8]" />
            <span>Create Empty Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

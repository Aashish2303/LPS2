import React, { useState } from 'react';
import { Settings, Save, Download, Upload, Trash2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { LPSData, ProjectConfig } from '../../types';

interface ProjectConfigViewProps {
  data: LPSData;
  onUpdateConfig: (config: ProjectConfig) => void;
  onExportJSON: () => void;
  onImportJSON: (importedData: LPSData) => void;
  onResetData: () => void;
}

export const ProjectConfigView: React.FC<ProjectConfigViewProps> = ({
  data,
  onUpdateConfig,
  onExportJSON,
  onImportJSON,
  onResetData
}) => {
  const [config, setConfig] = useState<ProjectConfig>({ ...data.config });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.config && Array.isArray(parsed.tasks)) {
          onImportJSON(parsed);
        } else {
          alert('Invalid LPS JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="project-config-view" className="space-y-8 max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-lg font-bold text-[#f8fafc]">Project Parameters & Workspace Settings</h2>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Configure site metadata, current operating cycle, milestones, and data backup / restore utilities.
          </p>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg space-y-6">
        <h3 className="text-sm font-bold text-[#f8fafc] border-b border-[#334155] pb-3">
          Site Identity & Active Scheduling Window
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-cfg-name">
              Project Name *
            </label>
            <input
              id="input-cfg-name"
              type="text"
              required
              value={config.project_name}
              onChange={(e) => setConfig({ ...config, project_name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-cfg-week">
              Active Current Week Key (e.g. 2026-W35) *
            </label>
            <input
              id="input-cfg-week"
              type="text"
              required
              value={config.current_week_key}
              onChange={(e) => setConfig({ ...config, current_week_key: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-cfg-lookahead">
              Lookahead Horizon Window (Weeks)
            </label>
            <input
              id="input-cfg-lookahead"
              type="number"
              min="2"
              max="12"
              value={config.lookahead_weeks}
              onChange={(e) => setConfig({ ...config, lookahead_weeks: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-cfg-start">
              Project Start Date
            </label>
            <input
              id="input-cfg-start"
              type="date"
              value={config.start_date}
              onChange={(e) => setConfig({ ...config, start_date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1" htmlFor="input-cfg-end">
              Project End / Substantial Completion Date
            </label>
            <input
              id="input-cfg-end"
              type="date"
              value={config.end_date}
              onChange={(e) => setConfig({ ...config, end_date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#334155]">
          {isSaved ? (
            <span className="text-xs text-[#10b981] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Project settings successfully updated!</span>
            </span>
          ) : (
            <div />
          )}

          <button
            id="btn-save-project-config"
            type="submit"
            className="px-6 py-2.5 bg-[#f59e0b] hover:bg-amber-600 active:scale-[0.98] text-[#0f172a] font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Data Backup & Migration Operations */}
      <div className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-[#f8fafc] border-b border-[#334155] pb-3">
          Data Management & LocalStorage Persistence
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Export JSON */}
          <div className="p-4 rounded-lg bg-[#0f172a] border border-[#334155] flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-[#f8fafc] flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#38bdf8]" />
                <span>Export System Data</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-1">
                Download a complete JSON snapshot of milestones, tasks, constraints, and metrics.
              </p>
            </div>
            <button
              id="btn-export-json"
              type="button"
              onClick={onExportJSON}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-[#f8fafc] text-xs font-bold rounded-lg border border-[#334155] transition-colors cursor-pointer"
            >
              Export JSON
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-lg bg-[#0f172a] border border-[#334155] flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-[#f8fafc] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#f59e0b]" />
                <span>Restore / Import Data</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-1">
                Upload a previously exported LPS JSON dataset to overwrite local state.
              </p>
            </div>
            <label className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-[#f8fafc] text-xs font-bold rounded-lg border border-[#334155] transition-colors text-center cursor-pointer block">
              <span>Choose File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Reset Data */}
          <div className="p-4 rounded-lg bg-[#0f172a] border border-red-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-[#ef4444] flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-[#ef4444]" />
                <span>Reset to Seed Data</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-1">
                Restore default commercial high-rise sample dataset and recalculate all metrics.
              </p>
            </div>
            <button
              id="btn-reset-data"
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data back to the default LPS dataset?')) {
                  onResetData();
                }
              }}
              className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-[#ef4444] text-xs font-bold rounded-lg border border-red-500/40 transition-colors cursor-pointer"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

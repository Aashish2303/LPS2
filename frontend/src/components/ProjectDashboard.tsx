import React, { useState } from 'react';
import { FolderKanban, Plus, ArrowRight, X, CalendarDays, MapPin, Building2, LogOut } from 'lucide-react';
import { LPSData, ProjectRecord } from '../types';

interface ProjectDashboardProps {
  projects: ProjectRecord[];
  onSelect: (project: ProjectRecord) => void;
  onCreate: (project: ProjectRecord) => void;
  createProjectData: (details: ProjectDetails) => LPSData;
  onLogout: () => void;
}

interface ProjectDetails {
  name: string;
  client: string;
  location: string;
  projectCode: string;
  startDate: string;
  endDate: string;
  description: string;
}

const emptyDetails: ProjectDetails = {
  name: '', client: '', location: '', projectCode: '', startDate: '', endDate: '', description: ''
};

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projects,
  onSelect,
  onCreate,
  createProjectData,
  onLogout
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [details, setDetails] = useState<ProjectDetails>(emptyDetails);

  const update = (field: keyof ProjectDetails, value: string) => setDetails((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!details.name.trim() || !details.client.trim() || !details.location.trim() || !details.startDate) return;
    const data = createProjectData(details);
    onCreate({
      id: `PRJ-${Date.now()}`,
      name: details.name.trim(),
      client: details.client.trim(),
      location: details.location.trim(),
      projectCode: details.projectCode.trim(),
      startDate: details.startDate,
      endDate: details.endDate,
      description: details.description.trim(),
      data
    });
    setDetails(emptyDetails);
    setIsAdding(false);
  };

  const field = (key: keyof ProjectDetails, label: string, type = 'text', required = false) => (
    <label className="block text-xs font-semibold text-slate-300">
      {label}{required && ' *'}
      <input
        required={required}
        type={type}
        value={details[key]}
        onChange={(event) => update(key, event.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500"
      />
    </label>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-6 text-slate-100 sm:px-8 sm:py-8">
      <header className="mx-auto flex max-w-6xl flex-col items-start gap-5 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500 p-2.5 text-slate-950"><FolderKanban className="h-6 w-6" /></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500">LPS Tool</p><h1 className="text-2xl font-bold">Project Dashboard</h1></div>
          </div>
          <p className="mt-3 text-sm text-slate-400">Select a project workspace to continue.</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
          <button type="button" onClick={onLogout} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white sm:flex-none sm:px-4">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <button type="button" onClick={() => setIsAdding(true)} className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 px-3 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 sm:flex-none sm:px-4">
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl py-8">
        {projects.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 p-16 text-center text-slate-400">No projects yet. Create your first workspace.</div> :
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <button key={project.id} type="button" onClick={() => onSelect(project)} className="group text-left rounded-xl border border-slate-700 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-950/30">
                <div className="flex items-start justify-between"><div className="rounded-lg bg-sky-500/15 p-2.5 text-sky-400"><Building2 className="h-5 w-5" /></div><ArrowRight className="h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-amber-500" /></div>
                <h2 className="mt-5 text-lg font-bold text-slate-100">{project.name}</h2>
                <p className="mt-1 text-sm text-amber-500">{project.projectCode || 'Project workspace'}</p>
                <div className="mt-5 space-y-2 text-xs text-slate-400"><p className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" />{project.client}</p><p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{project.location}</p><p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{project.startDate} {project.endDate ? `to ${project.endDate}` : ''}</p></div>
              </button>
            ))}
          </div>
        }
      </main>

      {isAdding && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 p-4"><form onSubmit={handleSubmit} className="my-4 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6"><div className="flex items-center justify-between border-b border-slate-700 pb-4"><div><h2 className="text-xl font-bold">Create New Project</h2><p className="mt-1 text-xs text-slate-400">Set the workspace details before entering the LPS boards.</p></div><button type="button" onClick={() => setIsAdding(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{field('name', 'Project name', 'text', true)}{field('client', 'Client / owner', 'text', true)}{field('location', 'Site location', 'text', true)}{field('projectCode', 'Project code')}{field('startDate', 'Start date', 'date', true)}{field('endDate', 'Target completion', 'date')}<label className="block text-xs font-semibold text-slate-300 sm:col-span-2">Description<textarea value={details.description} onChange={(event) => update('description', event.target.value)} rows={3} className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500" /></label></div><div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row"><button type="button" onClick={() => setIsAdding(false)} className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300">Cancel</button><button type="submit" className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950">Create Project</button></div></form></div>}
    </div>
  );
};

export type { ProjectDetails };

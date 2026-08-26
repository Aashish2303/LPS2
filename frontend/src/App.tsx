import React, { useState, useEffect, useMemo } from 'react';
import {
  LPSData,
  NavItemKey,
  UserSession,
  Task,
  Constraint,
  LookaheadItem,
  Commitment,
  ActualEntry,
  ProjectConfig,
  TradeItem,
  Phase,
  ProjectRecord
} from './types';
import {
  loadLPSData,
  saveLPSData,
  resetToSampleData,
  computeMetrics,
  refreshLookaheadReadiness,
  exportDataAsJSON,
  exportDataAsSpreadsheet,
  importDataFromJSON,
  getOpenConstraintsCountTotal,
  loadProjects,
  saveProjects
} from './services/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { Toast } from './components/Toast';

// Views
import { DashboardView } from './components/views/DashboardView';
import { PhaseScheduleView } from './components/views/PhaseScheduleView';
import { PullPlanningView } from './components/views/PullPlanningView';
import { LookaheadView } from './components/views/LookaheadView';
import { MakeCommitmentsView } from './components/views/MakeCommitmentsView';
import { DailyCheckInView } from './components/views/DailyCheckInView';
import { CloseOutWeekView } from './components/views/CloseOutWeekView';
import { ThisWeekMetricsView } from './components/views/ThisWeekMetricsView';
import { TrendsView } from './components/views/TrendsView';
import { CoachingView } from './components/views/CoachingView';
import { LearningCentreView } from './components/views/LearningCentreView';
import { FacilitatorGuidesView } from './components/views/FacilitatorGuidesView';
import { ProjectConfigView } from './components/views/ProjectConfigView';
import { TradesAreasView } from './components/views/TradesAreasView';
import { InitializeSystemView } from './components/views/InitializeSystemView';
import { ProjectDashboard } from './components/ProjectDashboard';

export function App() {
  // 1. User Session state
  const [user, setUser] = useState<UserSession | null>(null);

  // 2. Main LPS Dataset state
  const [data, setData] = useState<LPSData>(() => loadLPSData());
  const [projects, setProjects] = useState<ProjectRecord[]>(() => loadProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // 3. Navigation & Mobile Drawer state
  const [activeNav, setActiveNav] = useState<NavItemKey>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // 4. Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Sync data to localStorage on changes
  const updateData = (newData: LPSData) => {
    setData(newData);
    saveLPSData(newData);
    if (selectedProjectId) {
      const updatedProjects = projects.map((project) =>
        project.id === selectedProjectId ? { ...project, data: newData } : project
      );
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
    }
  };

  const handleLogin = (email: string) => {
    const newUser: UserSession = {
      id: `USR-${Date.now()}`,
      name: email.split('@')[0].replace(/[._-]+/g, ' '),
      email,
      role: 'Project Manager'
    };
    setUser(newUser);
    setSelectedProjectId(null);
    showToast(`Welcome back, ${newUser.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lps_user_session');
    setSelectedProjectId(null);
    showToast('Logged out of LPS session', 'info');
  };

  const currentWeek = data.config.current_week_key;

  // Compute live metrics for the current week
  const metrics = useMemo(() => computeMetrics(currentWeek, data), [currentWeek, data]);

  // Compute total open constraints
  const openConstraintsCount = useMemo(() => getOpenConstraintsCountTotal(data.constraints), [data.constraints]);

  // Current available weeks list for the header dropdown
  const availableWeeks = useMemo(() => {
    const set = new Set<string>();
    data.metrics.forEach((m) => set.add(m.week_key));
    data.lookahead.forEach((l) => set.add(l.week_key));
    data.commitments.forEach((c) => set.add(c.week_key));
    set.add(data.config.current_week_key);
    return Array.from(set).sort();
  }, [data]);

  // Week change handler
  const handleSelectWeek = (week: string) => {
    const updated = {
      ...data,
      config: {
        ...data.config,
        current_week_key: week
      }
    };
    updateData(updated);
    showToast(`Switched active workspace to ${week}`, 'info');
  };

  // Milestone Actions
  const handleAddPhase = (phase: Phase) => {
    const updated = { ...data, phases: [...data.phases, phase] };
    updateData(updated);
    showToast(`Milestone '${phase.phase_name}' added`, 'success');
  };

  const handleUpdatePhaseStatus = (phaseId: string, status: Phase['status']) => {
    const updated = {
      ...data,
      phases: data.phases.map((phase) => (phase.id === phaseId ? { ...phase, status } : phase))
    };
    updateData(updated);
  };

  // Task Actions
  const handleAddTask = (t: Task) => {
    const updated = { ...data, tasks: [...data.tasks, t] };
    updateData(updated);
    showToast(`Task '${t.description}' created`, 'success');
  };

  const handleDeleteTask = (id: string) => {
    const updated = {
      ...data,
      tasks: data.tasks.filter((t) => t.id !== id),
      lookahead: data.lookahead.filter((l) => l.task_id !== id),
      commitments: data.commitments.filter((c) => c.task_id !== id),
      constraints: data.constraints.filter((cn) => cn.task_id !== id)
    };
    updateData(updated);
    showToast('Task removed from all boards', 'info');
  };

  // Constraint Actions
  const handleAddConstraint = (c: Constraint) => {
    const updated = { ...data, constraints: [...data.constraints, c] };
    // Also re-evaluate lookahead readiness
    const refreshedLookahead = refreshLookaheadReadiness(updated.lookahead, updated.constraints);
    updateData({ ...updated, lookahead: refreshedLookahead });
    showToast(`Constraint [${c.type}] logged for task`, 'warning');
  };

  const handleResolveConstraint = (constraintId: string) => {
    const updatedConstraints = data.constraints.map((c) =>
      c.id === constraintId ? { ...c, status: 'Resolved' as const } : c
    );
    const refreshedLookahead = refreshLookaheadReadiness(data.lookahead, updatedConstraints);
    updateData({
      ...data,
      constraints: updatedConstraints,
      lookahead: refreshedLookahead
    });
    showToast('Constraint resolved! Task readiness updated.', 'success');
  };

  // Lookahead Actions
  const handleAddToLookahead = (item: LookaheadItem) => {
    // Avoid duplicate task in the same week
    const existing = data.lookahead.find(
      (l) => l.task_id === item.task_id && l.week_key === item.week_key
    );
    let updatedItems = data.lookahead;
    if (existing) {
      updatedItems = data.lookahead.map((l) => (l.id === existing.id ? item : l));
    } else {
      updatedItems = [...data.lookahead, item];
    }
    const refreshed = refreshLookaheadReadiness(updatedItems, data.constraints);
    updateData({ ...data, lookahead: refreshed });
    showToast('Task placed into Lookahead Horizon', 'success');
  };

  const handleRefreshReadiness = () => {
    const refreshed = refreshLookaheadReadiness(data.lookahead, data.constraints);
    updateData({ ...data, lookahead: refreshed });
    showToast('Readiness statuses recalculated against open constraints', 'info');
  };

  // Commitment Actions
  const handleAddCommitment = (com: Commitment) => {
    const updated = { ...data, commitments: [...data.commitments, com] };
    updateData(updated);
    showToast('Commitment promised and locked to Weekly Work Plan', 'success');
  };

  const handleUpdateCommitmentOutcome = (
    commitmentId: string,
    outcome: 'done' | 'not_done',
    reasonCode?: number
  ) => {
    const updatedCommitments = data.commitments.map((c) => {
      if (c.id === commitmentId) {
        return {
          ...c,
          outcome,
          reason_code: reasonCode,
          progress_percent: outcome === 'done' ? 100 : c.progress_percent
        };
      }
      return c;
    });
    updateData({ ...data, commitments: updatedCommitments });
  };

  const handleSaveDailyActual = (actual: ActualEntry) => {
    const existingIndex = data.actuals.findIndex(
      (a) => a.commitment_id === actual.commitment_id && a.day_date === actual.day_date
    );
    let updatedActuals = [...data.actuals];
    if (existingIndex >= 0) {
      updatedActuals[existingIndex] = actual;
    } else {
      updatedActuals.push(actual);
    }
    updateData({ ...data, actuals: updatedActuals });
    showToast('Daily production actual recorded', 'success');
  };

  const handleCloseOutWeek = (weekKey: string, finalPpc: number) => {
    // Record or update in metrics history
    const existingIdx = data.metrics.findIndex((m) => m.week_key === weekKey);
    let updatedMetrics = [...data.metrics];
    const newRecord = {
      ...metrics,
      week_key: weekKey,
      ppc: finalPpc,
      status: 'Closed' as const
    };

    if (existingIdx >= 0) {
      updatedMetrics[existingIdx] = newRecord;
    } else {
      updatedMetrics.push(newRecord);
    }

    updateData({ ...data, metrics: updatedMetrics });
    showToast(`Week ${weekKey} successfully sealed with PPC ${finalPpc}%!`, 'success');
  };

  // Learning Progress
  const handleSaveLearnProgress = (topicId: number, score: number, passed: boolean) => {
    const existingIdx = data.learnProgress.findIndex((p) => p.topic_id === topicId);
    let updated = [...data.learnProgress];
    if (existingIdx >= 0) {
      updated[existingIdx] = { topic_id: topicId, score, passed };
    } else {
      updated.push({ topic_id: topicId, score, passed });
    }
    updateData({ ...data, learnProgress: updated });
    if (passed) {
      showToast('Quiz passed! Master progress saved.', 'success');
    }
  };

  // Config & Preset handlers
  const handleUpdateConfig = (newConfig: ProjectConfig) => {
    updateData({ ...data, config: newConfig });
    showToast('Project configuration saved', 'success');
  };

  const handleUpdateTrades = (newTrades: TradeItem[]) => {
    updateData({ ...data, trades: newTrades });
    showToast('Trade directory updated', 'success');
  };

  const handleUpdateAreas = (newAreas: string[]) => {
    updateData({ ...data, areas: newAreas });
    showToast('Project work zones updated', 'success');
  };

  const handleExportJSON = () => {
    exportDataAsJSON(data);
    showToast('Downloaded lps_data_backup.json', 'info');
  };

  const handleExportSpreadsheet = () => {
    exportDataAsSpreadsheet(data);
    showToast('Downloaded LPS spreadsheet export', 'info');
  };

  const handleSelectProject = (project: ProjectRecord) => {
    setSelectedProjectId(project.id);
    setData(project.data);
    saveLPSData(project.data);
    setActiveNav('dashboard');
  };

  const createProjectData = (details: {
    name: string;
    client: string;
    location: string;
    projectCode: string;
    startDate: string;
    endDate: string;
  }): LPSData => ({
    ...loadLPSData(),
    config: {
      projectName: details.name,
      project_name: details.name,
      client: details.client,
      projectCode: details.projectCode,
      startDate: details.startDate,
      start_date: details.startDate,
      endDate: details.endDate,
      end_date: details.endDate,
      current_week_key: '2026-W35',
      lookahead_weeks: 4,
      projectManager: '',
      leanChampion: ''
    },
    phases: [],
    milestones: [],
    tasks: [],
    constraints: [],
    lookahead: [],
    commitments: [],
    actuals: [],
    metrics: [],
    closeouts: [],
    learnProgress: []
  });

  const handleCreateProject = (project: ProjectRecord) => {
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    handleSelectProject(project);
    showToast(`Project '${project.name}' created`, 'success');
  };

  const handleImportJSON = (imported: LPSData) => {
    updateData(imported);
    showToast('LPS workspace restored from file', 'success');
  };

  const handleResetSampleData = () => {
    const seed = resetToSampleData();
    setData(seed);
    showToast('Reset to Commercial High-Rise benchmark dataset', 'info');
  };

  const handleLoadBlankProject = () => {
    const blank: LPSData = {
      config: {
        projectName: 'New Lean Construction Project',
        project_name: 'New Lean Construction Project',
        current_week_key: '2026-W35',
        lookahead_weeks: 4,
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      },
      phases: [],
      milestones: [],
      tasks: [],
      constraints: [],
      lookahead: [],
      commitments: [],
      actuals: [],
      metrics: [],
      closeouts: [],
      learnProgress: [],
      trades: [
        { id: 't1', code: 'STRUC', name: 'Structural', lead: 'Foreman Dave', color: '#f59e0b' },
        { id: 't2', code: 'MEP', name: 'Mechanical & Plumbing', lead: 'Foreman Sarah', color: '#38bdf8' },
        { id: 't3', code: 'ELEC', name: 'Electrical', lead: 'Foreman Mike', color: '#eab308' },
        { id: 't4', code: 'FINISH', name: 'Fit-Out & Finishes', lead: 'Foreman Alex', color: '#10b981' }
      ],
      areas: ['Substructure', 'Podium Level', 'Tower Floor 01', 'Roof Level']
    };
    updateData(blank);
    showToast('Initialized clean blank project template', 'info');
  };

  // If user is not logged in, show the Login / Persona Screen
  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (!selectedProjectId) {
    return (
      <ProjectDashboard
        projects={projects}
        onSelect={handleSelectProject}
        onCreate={handleCreateProject}
        createProjectData={(details) => createProjectData(details)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div id="lps-app-root" className="flex h-screen w-full font-sans bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* Toast Notification Container */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 md:hidden transition-opacity cursor-pointer"
          aria-label="Close navigation sidebar"
        />
      )}

      {/* Left Sidebar (w-64 on mobile, w-56 on desktop) */}
      <Sidebar
        activeNav={activeNav}
        onNavigate={(nav) => {
          setActiveNav(nav);
          setIsMobileMenuOpen(false);
        }}
        openConstraintsCount={openConstraintsCount}
        user={user}
        onLogout={handleLogout}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentNav={activeNav}
          currentWeek={currentWeek}
          config={data.config}
          availableWeeks={availableWeeks}
          onSelectWeek={handleSelectWeek}
          user={user}
          onNavigate={(nav) => {
            setActiveNav(nav);
            setIsMobileMenuOpen(false);
          }}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Dynamic View Scrollable Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full">
          {activeNav === 'dashboard' && (
            <DashboardView
              data={data}
              currentWeek={currentWeek}
              metrics={metrics}
              onNavigate={(nav) => setActiveNav(nav)}
              onResolveConstraint={handleResolveConstraint}
              onQuickLogConstraint={() => setActiveNav('plan-pull')}
            />
          )}

          {activeNav === 'plan-phase' && (
            <PhaseScheduleView
              data={data}
              onAddPhase={handleAddPhase}
              onUpdatePhaseStatus={handleUpdatePhaseStatus}
            />
          )}

          {activeNav === 'plan-pull' && (
            <PullPlanningView
              data={data}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onAddConstraint={handleAddConstraint}
            />
          )}

          {activeNav === 'plan-lookahead' && (
            <LookaheadView
              data={data}
              currentWeek={currentWeek}
              onAddToLookahead={handleAddToLookahead}
              onRefreshReadiness={handleRefreshReadiness}
              onResolveConstraint={handleResolveConstraint}
              onNavigateToCommit={() => setActiveNav('week-commit')}
            />
          )}

          {activeNav === 'week-commit' && (
            <MakeCommitmentsView
              data={data}
              currentWeek={currentWeek}
              onAddCommitment={handleAddCommitment}
              onNavigateToCloseout={() => setActiveNav('week-closeout')}
            />
          )}

          {activeNav === 'week-daily' && (
            <DailyCheckInView
              data={data}
              currentWeek={currentWeek}
              onSaveDailyActual={handleSaveDailyActual}
              onResolveConstraint={handleResolveConstraint}
            />
          )}

          {activeNav === 'week-closeout' && (
            <CloseOutWeekView
              data={data}
              currentWeek={currentWeek}
              onUpdateCommitmentOutcome={handleUpdateCommitmentOutcome}
              onCloseOutWeek={handleCloseOutWeek}
              onNavigateToDashboard={() => setActiveNav('dashboard')}
            />
          )}

          {activeNav === 'metrics-this-week' && (
            <ThisWeekMetricsView
              data={data}
              currentWeek={currentWeek}
              metrics={metrics}
              onNavigate={(nav) => setActiveNav(nav)}
            />
          )}

          {activeNav === 'metrics-trends' && (
            <TrendsView data={data} />
          )}

          {activeNav === 'metrics-coaching' && (
            <CoachingView
              data={data}
              currentWeek={currentWeek}
              metrics={metrics}
            />
          )}

          {activeNav === 'learn-centre' && (
            <LearningCentreView
              data={data}
              onSaveProgress={handleSaveLearnProgress}
            />
          )}

          {activeNav === 'learn-guides' && (
            <FacilitatorGuidesView />
          )}

          {activeNav === 'setup-config' && (
            <ProjectConfigView
              data={data}
              onUpdateConfig={handleUpdateConfig}
              onExportJSON={handleExportJSON}
              onExportSpreadsheet={handleExportSpreadsheet}
              onImportJSON={handleImportJSON}
              onResetData={handleResetSampleData}
            />
          )}

          {activeNav === 'setup-trades' && (
            <TradesAreasView
              data={data}
              onUpdateTrades={handleUpdateTrades}
              onUpdateAreas={handleUpdateAreas}
            />
          )}

          {activeNav === 'setup-init' && (
            <InitializeSystemView
              onLoadSampleData={handleResetSampleData}
              onLoadBlankProject={handleLoadBlankProject}
              onNavigateToDashboard={() => setActiveNav('dashboard')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

import { LPSData, MetricRecord, Task } from '../types';
import { getInitialSampleData } from '../data/initialData';

const STORAGE_KEY = 'lps_data';
const SESSION_KEY = 'lps_session_user';

export function getSessionUser(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionUser(email: string): void {
  try {
    localStorage.setItem(SESSION_KEY, email);
  } catch (e) {
    console.error('Failed to set session user', e);
  }
}

export function clearSessionUser(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

export function getData(): LPSData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSampleData();
      saveData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as LPSData;
    // ensure all arrays exist
    if (!parsed.trades) parsed.trades = [];
    if (!parsed.areas) parsed.areas = [];
    if (!parsed.phases) parsed.phases = [];
    if (!parsed.tasks) parsed.tasks = [];
    if (!parsed.constraints) parsed.constraints = [];
    if (!parsed.lookahead) parsed.lookahead = [];
    if (!parsed.commitments) parsed.commitments = [];
    if (!parsed.actuals) parsed.actuals = [];
    if (!parsed.metrics) parsed.metrics = [];
    if (!parsed.closeouts) parsed.closeouts = [];
    if (!parsed.learnProgress) parsed.learnProgress = [];
    return parsed;
  } catch (e) {
    console.error('Error loading LPS data from localStorage', e);
    const initial = getInitialSampleData();
    saveData(initial);
    return initial;
  }
}

export function saveData(data: LPSData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving LPS data to localStorage', e);
  }
}

export function generateId(prefix: string): string {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${num}${rand.substring(0, 1)}`;
}

export function currentWeekKey(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getWeekStart(weekKey: string): Date {
  try {
    const parts = weekKey.split('-W');
    if (parts.length !== 2) return new Date();
    const year = parseInt(parts[0], 10);
    const week = parseInt(parts[1], 10);
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const isoWeekStart = simple;
    if (dow <= 4) {
      isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    isoWeekStart.setHours(0, 0, 0, 0);
    return isoWeekStart;
  } catch {
    return new Date();
  }
}

export function getWeekEnd(weekKey: string): Date {
  const start = getWeekStart(weekKey);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function computeFloat(task: Task, todayDate: Date = new Date()): number {
  if (!task.must_finish_by) return 0;
  const finishTime = new Date(task.must_finish_by).getTime();
  const todayTime = new Date(todayDate.toISOString().split('T')[0]).getTime();
  const daysRemaining = Math.floor((finishTime - todayTime) / 86400000);
  return daysRemaining - (task.duration_days || 1);
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
}

export function computeMetrics(weekKey: string, data: LPSData = getData()): MetricRecord {
  const comms = data.commitments.filter((c) => c.week_key === weekKey);
  const lookahead = data.lookahead.filter((l) => l.week_key === weekKey);
  const allConstraints = data.constraints;

  // PPC — binary
  const totalCommitted = comms.length;
  const totalDone = comms.filter((c) => c.outcome === 'done').length;
  const ppc = totalCommitted > 0 ? Math.round((totalDone / totalCommitted) * 100) : null;

  // TA — tasks made available (ready) in lookahead
  const ta = lookahead.filter((l) => l.ready === true).length;

  // TMR — null when no tasks in lookahead (CRITICAL: never 0% if empty)
  const tmr = lookahead.length > 0 ? Math.round((ta / lookahead.length) * 100) : null;

  // CRR — null when no constraints raised this week (CRITICAL: never 0% if empty)
  const weekStart = getWeekStart(weekKey);
  const weekEnd = getWeekEnd(weekKey);
  const raised = allConstraints.filter((c) => {
    if (!c.raised_date) return false;
    const d = new Date(c.raised_date);
    return d >= weekStart && d <= weekEnd;
  });
  const resolved = raised.filter((c) => c.status === 'Resolved');
  const crr = raised.length > 0 ? Math.round((resolved.length / raised.length) * 100) : null;

  const existingRecord = data.metrics.find((m) => m.week_key === weekKey);

  return {
    week_key: weekKey,
    ppc,
    ta,
    tmr,
    crr,
    total_committed: totalCommitted,
    total_done: totalDone,
    status: existingRecord?.status || 'Open'
  };
}

export function getOpenConstraintCount(taskId: string, constraints: LPSData['constraints']): number {
  return constraints.filter((c) => c.task_id === taskId && c.status !== 'Resolved').length;
}

export function refreshLookaheadReadiness(
  lookahead: LPSData['lookahead'],
  constraints: LPSData['constraints']
): LPSData['lookahead'] {
  return lookahead.map((item) => {
    const openCount = getOpenConstraintCount(item.task_id, constraints);
    return {
      ...item,
      ready: openCount === 0
    };
  });
}

export function refreshReadiness(data: LPSData): LPSData {
  const updatedLookahead = refreshLookaheadReadiness(data.lookahead, data.constraints);
  const updatedData = { ...data, lookahead: updatedLookahead };
  saveData(updatedData);
  return updatedData;
}

export function getCoachingDiagnosis(ppc: number | null, tmr: number | null) {
  if (ppc === null && tmr === null) {
    return {
      status: 'neutral',
      title: 'Awaiting Weekly Cycle Data',
      badge: 'No Data Yet',
      borderClass: 'border-[#334155]',
      badgeClass: 'bg-slate-700 text-slate-300',
      message: 'No weekly cycle data recorded yet. Make trade commitments and close out a weekly plan to trigger automated Lean diagnostics.',
      actionItems: [
        'Organize a Weekly Work Plan (WWP) session with all trade foremen.',
        'Screen upcoming 3-week tasks in Lookahead and log critical constraints.',
        'Record daily check-ins to monitor variance early.'
      ]
    };
  }

  const p = ppc ?? 0;
  const t = tmr ?? 0;

  if (p < 70 && t < 70) {
    return {
      status: 'danger',
      title: 'Make-Ready Process Is Failing',
      badge: 'Critical Bottleneck',
      borderClass: 'border-[#ef4444]',
      badgeClass: 'bg-red-500/20 text-red-400 border border-red-500/30',
      message: 'Both commitment reliability (PPC) and make-ready preparation (TMR) are below acceptable thresholds. Foremen are committing to unready work riddled with open drawings, material, or prerequisite roadblocks.',
      actionItems: [
        'Enforce the Make-Ready Gate: Strictly forbid committing any task with open constraints.',
        'Conduct a dedicated Constraint Clearance War Room with Project Engineers and Procurement.',
        'Review the 15 Reason Codes from recent closeouts to eliminate repeating supplier failures.'
      ]
    };
  }

  if (p < 70 && t >= 70) {
    return {
      status: 'warning',
      title: 'Planning Quality & Execution Needs Attention',
      badge: 'Execution Variance',
      borderClass: 'border-[#f59e0b]',
      badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      message: 'Tasks are entering the week fully prepared (high TMR), but commitments are still being broken. This indicates overly optimistic task sizing, labor shortages, craft skill deficits, or poor supervisor presence on site.',
      actionItems: [
        'Calibrate task durations: Break 5-day tasks into 2-day or 3-day explicit measurable chunks.',
        'Review manpower gang sizing and daily craft attendance records with trade foremen.',
        'Conduct 10-minute daily check-in standups to prevent small delays from compounding.'
      ]
    };
  }

  if (p >= 70 && t < 70) {
    return {
      status: 'warning',
      title: 'Warning: Unsustainable Execution (Firefighting)',
      badge: 'Heroic Bias',
      borderClass: 'border-[#f97316]',
      badgeClass: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      message: 'Current commitments are being delivered heroically, but the lookahead pipeline is dry and choked with constraints (low TMR). The site is running on borrowed momentum and will hit a severe stoppage in 2 to 3 weeks if make-ready is neglected.',
      actionItems: [
        'Shift management focus immediately from today’s fires to the 3-6 week lookahead horizon.',
        'Assign concrete target clearance dates to all drawings, permits, and long-lead material RFIs.',
        'Schedule a mid-week Lookahead Make-Ready session with all subcontractor leads.'
      ]
    };
  }

  return {
    status: 'success',
    title: 'System Is Working Well — High Reliability Flow',
    badge: 'High Reliability',
    borderClass: 'border-[#10b981]',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    message: 'Healthy synergy between Lookahead filtration and Weekly commitment fulfillment. Trades are receiving clear handoffs and delivering promises predictably.',
    actionItems: [
      'Celebrate weekly reliability achievements in the Big Room to reinforce lean culture.',
      'Maintain standard operating discipline; do not relax constraint tracking.',
      'Look for opportunities to pull forward non-critical float activities.'
    ]
  };
}

export function exportDataAsJSON(customData?: LPSData): void {
  const data = customData || getData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lps_data_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(jsonString: string): LPSData | null {
  try {
    const parsed = JSON.parse(jsonString) as LPSData;
    saveData(parsed);
    return parsed;
  } catch (e) {
    console.error('Failed to import JSON data', e);
    return null;
  }
}

export function resetToSampleData(): LPSData {
  const sample = getInitialSampleData();
  saveData(sample);
  return sample;
}

export function getOpenConstraintsCountTotal(constraints: { status: string }[]): number {
  return constraints.filter((c) => c.status !== 'Resolved').length;
}

export const loadLPSData = getData;
export const saveLPSData = saveData;


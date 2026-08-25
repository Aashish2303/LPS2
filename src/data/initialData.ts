import { LPSData, LearnTopic } from '../types';

export const SAMPLE_LEARN_TOPICS: LearnTopic[] = [
  {
    id: 1,
    title: '1. What is Last Planner System?',
    summary: 'The Last Planner System (LPS) is a collaborative, commitment-based planning system designed to produce predictable workflow and rapid learning in construction.',
    content: [
      'The Last Planner System (LPS) was developed by Glenn Ballard and Gregory Howell in the 1990s as a cornerstone of Lean Construction. Traditional project management focuses on what SHOULD be done (the master schedule), but frequently ignores what CAN be done and what WILL be done.',
      'LPS shifts focus to the "Last Planner" — the individual directly responsible for producing the work (usually a trade foreman, site superintendent, or squad leader). Instead of push scheduling from a remote office, LPS relies on pull planning and conversational promises.',
      'The 5 core tiers of LPS are: Master Scheduling (Milestones), Phase/Pull Planning (Working backwards from milestones), Lookahead Planning (Make-ready process 3-6 weeks ahead), Weekly Work Planning (Committed promises for the week), and Daily Coordination / Learning (PPC & Reason analysis).'
    ],
    keyTakeaways: [
      'Focus shifts from "SHOULD do" to "CAN do" and finally "WILL do".',
      'The Last Planner is the person directly directing craft workers in the field.',
      'Predictability of commitments protects downstream crews from variability.'
    ],
    quiz: [
      {
        id: 101,
        question: 'Who is considered the "Last Planner" in the Last Planner System?',
        options: [
          'The Project Client or Developer',
          'The Corporate Master Scheduler',
          'The field supervisor/foreman directly assigning work to crews',
          'The Lead Architect'
        ],
        correctIndex: 2,
        explanation: 'The Last Planner is the frontline person who makes the actual daily/weekly operational commitment to put workers on a specific task.'
      },
      {
        id: 102,
        question: 'What is the primary objective of the Last Planner System?',
        options: [
          'To generate complex 10,000-line Gantt charts',
          'To produce predictable workflow, clear constraints, and continuous learning',
          'To penalize subcontractors for bad weather',
          'To eliminate all trade foreman meetings'
        ],
        correctIndex: 1,
        explanation: 'LPS creates reliable workflow by systematically removing constraints before work starts and analyzing breakdowns to prevent recurring failures.'
      }
    ]
  },
  {
    id: 2,
    title: '2. Why PPC Must Be Binary',
    summary: 'Percent Plan Complete (PPC) is strictly binary (1 or 0). 99% done is recorded as 0% done. Understanding the discipline behind this rule is vital.',
    content: [
      'In traditional construction reporting, a task that is 90% finished is often marked as 90% complete. In Lean LPS, a task that is 90% finished is marked as NOT DONE (0%).',
      'Why such a strict rule? Because downstream trades cannot occupy the physical space or start their work until the preceding task is 100% finished and handed over cleanly. A 90% completed concrete slab cannot support drywall installation or waterproofing.',
      'Binary scoring eliminates wishful thinking and exposes hidden bottlenecks. If a commitment failed, we do not blame the trade — we identify the root cause Reason Code to fix the system.'
    ],
    keyTakeaways: [
      '99% done is scored as Not Done (0).',
      'Downstream handoffs require 100% completion.',
      'Binary measurement triggers actionable root-cause problem solving.'
    ],
    quiz: [
      {
        id: 201,
        question: 'A trade completed 18 out of 20 columns poured and cured during the weekly plan. How is this task scored in LPS PPC?',
        options: [
          '90% Complete (Partial credit given)',
          'Not Done (0%)',
          'Excluded from calculation',
          'Done with a footnote'
        ],
        correctIndex: 1,
        explanation: 'PPC is strictly binary. If the commitment was to pour all 20 columns, leaving 2 unfinished means the commitment was not fulfilled 100%.'
      },
      {
        id: 202,
        question: 'What happens when a task is marked "Not Done" in LPS weekly closeout?',
        options: [
          'The trade is fined immediately',
          'A standard Reason Code is assigned to discover why the plan failed',
          'The scheduler deletes the task from records',
          'The project milestone date is automatically pushed back'
        ],
        correctIndex: 1,
        explanation: 'Failures are learning opportunities. Assigning a reason code exposes systemic issues like material delays, missing drawings, or labor diversion.'
      }
    ]
  },
  {
    id: 3,
    title: '3. Pull Planning: Working Backwards',
    summary: 'Pull Planning begins with the target milestone and works backwards, identifying the exact prerequisite conditions each trade needs to start.',
    content: [
      'Traditional "Push" scheduling plans work from left to right based on assumed durations. "Pull Planning" starts with a defined phase milestone on the right and asks each preceding trade: "What must be completed by others before you can release your work?"',
      'Pull sessions use physical or digital sticky notes on a grid. Each note represents a specific, measurable handoff with a duration (typically < 5 days) and a required trade.',
      'By working right to left, teams uncover hidden dependencies, eliminate unnecessary buffers, and build collaborative ownership among trade partners.'
    ],
    keyTakeaways: [
      'Work backwards from the target milestone to the current state.',
      'Define handoffs explicitly from customer (downstream trade) to supplier (upstream trade).',
      'Keep task durations short (typically under 5 days) for high granularity.'
    ],
    quiz: [
      {
        id: 301,
        question: 'In a Pull Planning session, what direction does the planning conversation move?',
        options: [
          'Top to bottom based on contract cost',
          'Right to left, working backwards from the milestone date',
          'Left to right, pushing work as fast as possible',
          'Random order based on who speaks first'
        ],
        correctIndex: 1,
        explanation: 'Pull planning starts at the target milestone on the right and works backwards to identify true prerequisites and handoffs.'
      }
    ]
  },
  {
    id: 4,
    title: '4. The Lookahead: Make-Ready Process',
    summary: 'The 3 to 6-week lookahead window is where tasks are systematically prepared by identifying and removing constraints.',
    content: [
      'The lookahead is NOT just a zoom-in on the master schedule. It is an active "Make-Ready" filtration engine.',
      'Every task entering the 6-week lookahead is screened across 8 flows of construction: Drawings/Specs, Materials, Preceding Tasks, Labor/Skills, Equipment, Space/Access, Approvals/Permits, and Safety/Environment.',
      'If any condition is missing, an explicit Constraint is logged with a designated owner and a target resolution date prior to the commitment week.'
    ],
    keyTakeaways: [
      'Lookahead is an active make-ready engine, not a passive calendar.',
      'Never allow unready tasks with open constraints into the weekly work plan.',
      'Track the Tasks Made Ready (TMR) metric to gauge lookahead health.'
    ],
    quiz: [
      {
        id: 401,
        question: 'What is the primary objective of the Lookahead meeting?',
        options: [
          'To discuss monthly billing and invoicing',
          'To identify constraints and ensure tasks are made 100% ready before commitment',
          'To award bonuses to the fastest trade',
          'To rewrite the entire master contract'
        ],
        correctIndex: 1,
        explanation: 'The lookahead process is designed to proactively surface and clear constraints so tasks are completely ready before crews are dispatched.'
      }
    ]
  },
  {
    id: 5,
    title: '5. The Four Measures: PPC, TA, TMR, CRR',
    summary: 'The Last Planner System relies on four core diagnostic metrics to track workflow reliability and health.',
    content: [
      '1. **PPC (Percent Plan Complete)**: (Total Tasks Completed 100% / Total Tasks Committed) × 100. Target is typically ≥ 80%.',
      '2. **TA (Tasks Made Available / Ready)**: The absolute count of tasks in the lookahead whose constraints are fully cleared and ready for field execution.',
      '3. **TMR (Tasks Made Ready %)**: (Tasks Made Ready / Total Tasks in Lookahead Window) × 100. Measures make-ready efficiency. Note: If lookahead has 0 tasks, TMR is n/a (never false 0%).',
      '4. **CRR (Constraint Resolution Rate %)**: (Constraints Resolved on Time / Total Constraints Raised) × 100. Measures management responsiveness in unblocking trade foremen.'
    ],
    keyTakeaways: [
      'PPC measures commitment reliability.',
      'TMR measures make-ready filtration quality.',
      'CRR measures management unblocking velocity.'
    ],
    quiz: [
      {
        id: 501,
        question: 'If a project committed 10 tasks this week and 8 were 100% finished, what is the PPC?',
        options: ['70%', '80%', '90%', '88%'],
        correctIndex: 1,
        explanation: '8 / 10 = 80% PPC.'
      },
      {
        id: 502,
        question: 'What does a high PPC combined with a low TMR indicate?',
        options: [
          'The project is in perfect balance',
          'Warning: Unsustainable execution — teams are firefighting today without preparing upcoming work',
          'The client has terminated the contract',
          'Labor costs are zero'
        ],
        correctIndex: 1,
        explanation: 'High PPC with low TMR indicates teams are executing current work heroically, but the lookahead is dry and future weeks will soon crash.'
      }
    ]
  },
  {
    id: 6,
    title: '6. Using Reason Codes for Learning',
    summary: 'Standardized Reason for Non-Completion (RNC) codes allow the project team to spot recurring systemic trends rather than placing blame.',
    content: [
      'Whenever a commitment is not achieved (Not Done), the team must record the primary reason code among the 15 standard LPS categories.',
      'Categories span Workforce, Materials, Drawings, Equipment, Sequencing, Quality, Weather, Safety, and Approvals.',
      'Pareto analysis of reason codes over 4-8 weeks reveals the root systemic failures on site (e.g. 45% of failures caused by late RFI responses from engineering).'
    ],
    keyTakeaways: [
      'Every Not Done commitment requires an assigned reason code.',
      'Use reason codes for systemic root-cause problem solving (5 Whys), not punitive blame.',
      'Track multi-week reason code Pareto trends.'
    ],
    quiz: [
      {
        id: 601,
        question: 'Why are reason codes captured in LPS?',
        options: [
          'To generate penal deduction invoices for trade contractors',
          'To identify systemic root causes and implement lasting process improvements',
          'To satisfy legal litigation archives',
          'To rank foremen by failure rate'
        ],
        correctIndex: 1,
        explanation: 'Reason codes illuminate systemic breakdowns so project leadership can remove recurring roadblocks.'
      }
    ]
  },
  {
    id: 7,
    title: '7. The Weekly Close-Out Ceremony',
    summary: 'The weekly close-out meeting is the sacred learning ritual where commitments are reviewed, scored, and reason codes agreed upon.',
    content: [
      'Occurring at the end of the work week (e.g. Friday afternoon or Monday morning), the close-out meeting takes 30-45 minutes.',
      'The facilitator walks through each promise made for the week. The trade foreman explicitly states whether the promise was completed 100%.',
      'The team calculates the final weekly PPC, celebrates successes, and analyzes breakdowns before opening the next week commitment sheet.'
    ],
    keyTakeaways: [
      'Weekly closeout is non-negotiable and requires honesty and psychological safety.',
      'Calculate PPC openly in front of all trade partners.',
      'Close out the current week before committing to the next.'
    ],
    quiz: [
      {
        id: 701,
        question: 'When should the Weekly Close-Out ceremony take place?',
        options: [
          'Once every quarter',
          'At the conclusion of each weekly planning cycle before committing the next week',
          'Only after an accident occurs',
          'Whenever the client visits the site'
        ],
        correctIndex: 1,
        explanation: 'Weekly close-out closes the weekly learning loop and sets the baseline before new commitments are made.'
      }
    ]
  },
  {
    id: 8,
    title: '8. Constraint Management',
    summary: 'Constraints are conditions that prevent a task from proceeding smoothly. LPS turns constraint logging into an early warning radar.',
    content: [
      'A constraint is anything that prevents work from starting or flowing continuously without interruption.',
      'Constraints must have a single designated owner (e.g. Field Engineer, Procurement Manager, Architect) and a hard "Target Date" at least 1 week before planned execution.',
      'Constraint tracking meetings review all open roadblocks weekly to maintain high Constraint Resolution Rate (CRR).'
    ],
    keyTakeaways: [
      'Raise constraints early during lookahead screening.',
      'Assign an individual responsible owner and a target clearance date.',
      'Monitor CRR to keep constraint resolution speed above project burn rate.'
    ],
    quiz: [
      {
        id: 801,
        question: 'What is required when logging a constraint on a task?',
        options: [
          'A general complaint without details',
          'A specific description, constraint type, single responsible owner, and target resolution date',
          'A signature from the local municipal council',
          'Immediate work stoppage on all project zones'
        ],
        correctIndex: 1,
        explanation: 'Effective constraint management requires clear ownership, actionable description, and a committed target clearance date.'
      }
    ]
  },
  {
    id: 9,
    title: '9. The Four LPS Meetings',
    summary: 'The operational rhythm of LPS is structured around four interlocking collaborative meetings.',
    content: [
      '1. **Phase/Pull Planning Meeting**: Held at major milestones (every 2-4 months). Focuses on handoff sequences.',
      '2. **Lookahead Make-Ready Meeting**: Held weekly (45-60 min). Screens tasks 3-6 weeks ahead and logs/reviews constraints.',
      '3. **Weekly Work Plan Meeting (WWP)**: Held weekly (30-45 min). Foremen make reliable, constraint-free commitments for the upcoming week.',
      '4. **Daily Stand-Up / Check-In**: Held daily (10-15 min). Foremen review daily progress, unexpected impediments, and trade handoffs.'
    ],
    keyTakeaways: [
      'Each meeting has a distinct planning horizon and participant group.',
      'Daily check-ins catch variances within 24 hours rather than 7 days.',
      'Combine Weekly Close-Out with the WWP meeting for smooth rhythm.'
    ],
    quiz: [
      {
        id: 901,
        question: 'How long should a daily LPS check-in / standup meeting typically last?',
        options: ['1 to 2 hours', '10 to 15 minutes', 'Half a day', '45 minutes'],
        correctIndex: 1,
        explanation: 'Daily check-ins are rapid, standing 10-15 minute huddles to verify commitments and adjust coordination.'
      }
    ]
  },
  {
    id: 10,
    title: '10. Implementing LPS on Your Project',
    summary: 'Practical roadmap for establishing high-performance Lean Last Planner culture on a real-world construction site.',
    content: [
      'Step 1: Secure leadership sponsorship and establish a physical / digital "Big Room" command center.',
      'Step 2: Train trade foremen and site engineers on LPS principles, focusing on promises and binary PPC.',
      'Step 3: Start with a Phase Pull session on an upcoming milestone to build team alignment.',
      'Step 4: Maintain consistent cadence — never cancel lookahead or close-out meetings.',
      'Step 5: Celebrate PPC milestones (e.g. reaching 85% PPC for 4 consecutive weeks) to solidify collaborative culture.'
    ],
    keyTakeaways: [
      'LPS is a social system supported by tools, not just software.',
      'Create psychological safety where declaring delays and constraints is encouraged.',
      'Consistency of weekly rituals drives sustained performance.'
    ],
    quiz: [
      {
        id: 1001,
        question: 'What is the most critical cultural foundation for successful LPS adoption?',
        options: [
          'Fear of punishment for missed deadlines',
          'Psychological safety, mutual respect, and reliable promise-making',
          'Hiring the most expensive consulting firm',
          'Replacing all trade foremen every month'
        ],
        correctIndex: 1,
        explanation: 'LPS thrives when team members feel safe to declare obstacles early and make genuine commitments without fear.'
      }
    ]
  }
];

export const FACILITATOR_GUIDES = [
  {
    id: 'guide-pull',
    title: 'Phase / Pull Planning Meeting',
    frequency: 'At Phase Kickoff (Every 6-12 Weeks)',
    duration: '2 to 4 Hours',
    participants: 'Project Manager, Lean Facilitator, All Trade Foremen, Design Leads, Safety Lead',
    description: 'Collaborative session to reverse-engineer the work flow from a key project milestone back to the current date.',
    agenda: [
      { step: '1. Set the Target Milestone', time: '15 min', notes: 'Clearly define the completion criteria, physical scope, and handoff condition of the target milestone.' },
      { step: '2. Explain Ground Rules & Color Codes', time: '15 min', notes: 'Assign distinct sticky note colors to each trade. Remind team that durations should be realistic and handoffs explicit.' },
      { step: '3. Pull Backwards (Right-to-Left)', time: '90 min', notes: 'Ask the final trade what prerequisite condition they require. Upstream trade responds with their handoff sticky. Repeat backwards.' },
      { step: '4. Identify Bottlenecks & Network Logic', time: '30 min', notes: 'Look for congested work areas, stacked trades, or unrealistic lead times. Adjust sequencing collaboratively.' },
      { step: '5. Commit to Agreed Phase Baseline', time: '30 min', notes: 'Foremen sign off on the pull schedule. Photograph the wall and log into digital LPS system.' }
    ]
  },
  {
    id: 'guide-lookahead',
    title: 'Lookahead Make-Ready Meeting',
    frequency: 'Weekly (Mid-Week e.g. Wednesday)',
    duration: '45 to 60 Minutes',
    participants: 'Superintendent, Project Engineers, Field Coordinators, Key Trade Leads',
    description: 'Filtration meeting focused on the 3 to 6-week horizon to discover, assign, and aggressively clear all constraints.',
    agenda: [
      { step: '1. Review Status of Open Constraints', time: '15 min', notes: 'Check all constraints due this week. Update CRR. Confirm cleared items are marked Resolved.' },
      { step: '2. 6-Week Window Scope Review', time: '20 min', notes: 'Walk through tasks in weeks 3, 4, 5, 6. Check 8 flows (drawings, materials, equipment, permits, space, labor).' },
      { step: '3. Log New Constraints & Owners', time: '15 min', notes: 'For every roadblock, create a constraint ticket with an owner and committed target date.' },
      { step: '4. Confirm Next Week Ready Pool', time: '10 min', notes: 'Verify which tasks are 100% constraint-free and eligible for the upcoming Weekly Work Plan.' }
    ]
  },
  {
    id: 'guide-wwp',
    title: 'Weekly Work Plan (WWP) Meeting',
    frequency: 'Weekly (e.g. Friday Afternoon or Monday 7 AM)',
    duration: '30 to 45 Minutes',
    participants: 'All Trade Foremen, Site Superintendent, Field Quality & Safety Leads',
    description: 'Operational commitment session where foremen promise what work WILL be accomplished during the upcoming 5 to 6 working days.',
    agenda: [
      { step: '1. Verify Ready Task List', time: '10 min', notes: 'Enforce LPS Rule: Only tasks with zero open constraints can be committed. Reject unready tasks.' },
      { step: '2. Foremen Commitments', time: '20 min', notes: 'Each trade foreman stands and declares: "My crew commits to [Task], [Location], [Quantity] by [Day]."' },
      { step: '3. Spatial & Trade Coordination', time: '10 min', notes: 'Check for zone clashes, shared crane slots, or material delivery logistics.' },
      { step: '4. Publish & Display Weekly Plan', time: '5 min', notes: 'Print and post the WWP commitment sheet in the field trailer and mobile boards.' }
    ]
  },
  {
    id: 'guide-closeout',
    title: 'Weekly Close-Out & Learning Ceremony',
    frequency: 'Weekly (Closing previous week cycle)',
    duration: '30 to 45 Minutes',
    participants: 'All Trade Foremen, Project Manager, Lean Champion, Site Superintendent',
    description: 'Sacred reflection ritual to measure binary PPC, record Reason Codes, celebrate wins, and systematically learn from failures.',
    agenda: [
      { step: '1. Walk the Commitments (Binary 1/0)', time: '15 min', notes: 'Foremen state status: Done or Not Done. 95% is scored as Not Done without exception.' },
      { step: '2. Assign Reason Codes for Non-Completion', time: '15 min', notes: 'Select primary reason from the 15 LPS codes. Facilitate root cause inquiry without pointing fingers.' },
      { step: '3. Reveal Live PPC & Diagnostic Metrics', time: '10 min', notes: 'Calculate team PPC. Review coaching diagnosis. Recognize high reliability performers.' },
      { step: '4. Action Items for Root Causes', time: '5 min', notes: 'Document 1-2 systemic fixes to eliminate top repeating breakdown reasons next week.' }
    ]
  }
];

export function getInitialSampleData(): LPSData {
  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];

  return {
    config: {
      projectName: 'Chittor Site — Residential Block B',
      projectCode: 'CS-RB2-2026',
      client: 'Apex Urban Infratech',
      contractor: 'Horizon Buildcon Ltd.',
      startDate: '2026-06-01',
      endDate: '2027-04-30',
      projectManager: 'Ramesh Krishnan',
      leanChampion: 'Priya Menon'
    },
    trades: [
      { id: 'TRD-01', name: 'Civil & Earthworks', abbr: 'CIV' },
      { id: 'TRD-02', name: 'Formwork & Shuttering', abbr: 'FRM' },
      { id: 'TRD-03', name: 'Rebar & Steel Fixing', abbr: 'RBR' },
      { id: 'TRD-04', name: 'Concrete Pouring', abbr: 'CNC' },
      { id: 'TRD-05', name: 'MEP Services', abbr: 'MEP' },
      { id: 'TRD-06', name: 'Blockwork & Masonry', abbr: 'MSN' },
      { id: 'TRD-07', name: 'Waterproofing', abbr: 'WPF' }
    ],
    areas: [
      { id: 'ARA-01', name: 'Basement B1 Parking', zone: 'Zone A' },
      { id: 'ARA-02', name: 'Podium Level & Deck', zone: 'Zone B' },
      { id: 'ARA-03', name: 'Tower L1 to L4 Core', zone: 'Zone C' },
      { id: 'ARA-04', name: 'Tower L5 to L8 Typical', zone: 'Zone C' },
      { id: 'ARA-05', name: 'External Yard & Utilities', zone: 'Zone D' }
    ],
    phases: [
      {
        id: 'PHA-001',
        phase_name: 'Phase 1: Substructure & Raft',
        milestone: 'Raft foundation cast & cured with baseline waterproofing',
        planned_start: '2026-06-01',
        planned_finish: '2026-08-31',
        responsible: 'Suresh Verma (Civil Lead)',
        status: 'Active'
      },
      {
        id: 'PHA-002',
        phase_name: 'Phase 2: Superstructure RCC Frame',
        milestone: 'Columns and slab poured up to Level 5 deck',
        planned_start: '2026-09-01',
        planned_finish: '2026-12-15',
        responsible: 'Amit Patel (Structures)',
        status: 'Planned'
      },
      {
        id: 'PHA-003',
        phase_name: 'Phase 3: MEP & Internal Finishes',
        milestone: 'First-fix MEP risers and masonry up to Level 4',
        planned_start: '2026-11-15',
        planned_finish: '2027-03-30',
        responsible: 'Kavita Rao (Services)',
        status: 'Planned'
      }
    ],
    tasks: [
      {
        id: 'TSK-101',
        phase_id: 'PHA-001',
        description: 'Level 1 column rebar tying and starter ties (24 nos)',
        trade: 'Rebar & Steel Fixing',
        responsible: 'Gopal Krishna',
        location: 'Tower L1 to L4 Core',
        duration_days: 3,
        must_finish_by: '2026-08-30',
        uom: 'nos',
        status: 'In Progress'
      },
      {
        id: 'TSK-102',
        phase_id: 'PHA-001',
        description: 'Level 1 perimeter formwork erection and alignment',
        trade: 'Formwork & Shuttering',
        responsible: 'Venkatesh Babu',
        location: 'Tower L1 to L4 Core',
        duration_days: 4,
        must_finish_by: '2026-09-05',
        uom: 'm²',
        status: 'Planned'
      },
      {
        id: 'TSK-103',
        phase_id: 'PHA-001',
        description: 'MEP electrical conduits & box fixings in column cages',
        trade: 'MEP Services',
        responsible: 'Pradeep Nair',
        location: 'Tower L1 to L4 Core',
        duration_days: 2,
        must_finish_by: '2026-09-07',
        uom: 'points',
        status: 'Planned'
      },
      {
        id: 'TSK-104',
        phase_id: 'PHA-001',
        description: 'Pour Grade M40 Self-Compacting Concrete Level 1 cols',
        trade: 'Concrete Pouring',
        responsible: 'Rajesh Sharma',
        location: 'Tower L1 to L4 Core',
        duration_days: 2,
        must_finish_by: '2026-09-12',
        uom: 'm³',
        status: 'Planned'
      },
      {
        id: 'TSK-105',
        phase_id: 'PHA-002',
        description: 'Scaffolding staging & table forms for Level 2 slab',
        trade: 'Formwork & Shuttering',
        responsible: 'Venkatesh Babu',
        location: 'Podium Level & Deck',
        duration_days: 5,
        must_finish_by: '2026-09-20',
        uom: 'm²',
        status: 'Planned'
      }
    ],
    constraints: [
      {
        id: 'CON-001',
        task_id: 'TSK-101',
        type: 'Materials',
        description: 'Fe500D 25mm rebar bundles needed at Tower 1 base',
        raised_by: 'Gopal Krishna',
        responsible: 'Murugan (Storekeeper)',
        raised_date: '2026-08-20',
        target_date: '2026-08-24',
        status: 'Resolved',
        resolved_date: '2026-08-23'
      },
      {
        id: 'CON-002',
        task_id: 'TSK-102',
        type: 'Drawings',
        description: 'Architectural column chamfer detail Rev-C approval',
        raised_by: 'Venkatesh Babu',
        responsible: 'Ananya Deshmukh (Design Coord)',
        raised_date: '2026-08-21',
        target_date: '2026-08-25',
        status: 'Resolved',
        resolved_date: '2026-08-25'
      },
      {
        id: 'CON-003',
        task_id: 'TSK-103',
        type: 'Approvals',
        description: 'Consultant sign-off on fire conduit sleeve placement',
        raised_by: 'Pradeep Nair',
        responsible: 'Ramesh Krishnan (PM)',
        raised_date: '2026-08-24',
        target_date: '2026-08-29',
        status: 'Open'
      }
    ],
    lookahead: [
      {
        id: 'LKH-001',
        task_id: 'TSK-101',
        week_key: '2026-W35',
        planned_qty: 24,
        ready: true,
        notes: 'Steel bundles verified at yard'
      },
      {
        id: 'LKH-002',
        task_id: 'TSK-102',
        week_key: '2026-W35',
        planned_qty: 180,
        ready: true,
        notes: 'Form panels cleaned & oiled'
      },
      {
        id: 'LKH-003',
        task_id: 'TSK-103',
        week_key: '2026-W35',
        planned_qty: 48,
        ready: false,
        notes: 'Awaiting consultant fire sleeve approval'
      },
      {
        id: 'LKH-004',
        task_id: 'TSK-104',
        week_key: '2026-W36',
        planned_qty: 65,
        ready: true,
        notes: 'Batching plant pump slot booked'
      }
    ],
    commitments: [
      {
        id: 'COM-001',
        task_id: 'TSK-101',
        week_key: '2026-W35',
        committed_by: 'Gopal Krishna (Rebar Foreman)',
        outcome: 'done',
        progress_percent: 100,
        closed_at: '2026-08-25'
      },
      {
        id: 'COM-002',
        task_id: 'TSK-102',
        week_key: '2026-W35',
        committed_by: 'Venkatesh Babu (Formwork Lead)',
        outcome: 'done',
        progress_percent: 100,
        closed_at: '2026-08-25'
      },
      {
        id: 'COM-003',
        task_id: 'TSK-103',
        week_key: '2026-W35',
        committed_by: 'Pradeep Nair (MEP Lead)',
        outcome: 'not_done',
        reason_code: 7,
        reason_notes: 'Heavy grade PVC sleeves delayed at port customs',
        progress_percent: 40,
        closed_at: '2026-08-25'
      }
    ],
    actuals: [
      {
        id: 'ACT-001',
        commitment_id: 'COM-001',
        day_date: '2026-08-25',
        planned_qty: 24,
        achieved_qty: 24,
        note: 'All 24 column cages tied cleanly'
      },
      {
        id: 'ACT-002',
        commitment_id: 'COM-002',
        day_date: '2026-08-25',
        planned_qty: 180,
        achieved_qty: 180,
        note: 'Perimeter shutters plumbed & aligned'
      },
      {
        id: 'ACT-003',
        commitment_id: 'COM-003',
        day_date: '2026-08-25',
        planned_qty: 48,
        achieved_qty: 18,
        note: 'Only partial sleeves placed'
      }
    ],
    metrics: [
      {
        week_key: '2026-W33',
        ppc: 75,
        ta: 5,
        tmr: 83,
        crr: 80,
        total_committed: 8,
        total_done: 6,
        status: 'Closed'
      },
      {
        week_key: '2026-W34',
        ppc: 88,
        ta: 7,
        tmr: 88,
        crr: 100,
        total_committed: 8,
        total_done: 7,
        status: 'Closed'
      },
      {
        week_key: '2026-W35',
        ppc: 67,
        ta: 3,
        tmr: 75,
        crr: 67,
        total_committed: 3,
        total_done: 2,
        status: 'Open'
      }
    ],
    closeouts: [
      {
        week_key: '2026-W33',
        closed_by: 'Priya Menon (Lean Champion)',
        closed_at: '2026-08-15T17:00:00Z',
        ppc: 75,
        notes: 'Good coordination on rebar delivery.'
      },
      {
        week_key: '2026-W34',
        closed_by: 'Priya Menon (Lean Champion)',
        closed_at: '2026-08-22T17:30:00Z',
        ppc: 88,
        notes: 'Excellent make-ready flow. Zero safety stoppages.'
      }
    ],
    learnProgress: [
      { topic_id: 1, score: 100, passed: true, completed_at: '2026-08-20' },
      { topic_id: 2, score: 100, passed: true, completed_at: '2026-08-21' }
    ]
  };
}

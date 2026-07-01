# InfinitySheets Clone — PRD

## Original Problem Statement
Clone `https://infinitysheets.netlify.app/#dashboard-view` as a pixel-perfect, fully functional MVP with:
- Replicated Landing Page and Dashboard UI
- Personalized exam prep (Worksheets, Mistake tracking, Subject Overviews)
- Dark Mode & Demo Mode
- Multi-subject Course Onboarding wizard, interactive Tutorial, Progress analytics
- Frontend-only w/ localStorage now; backend + AI explicitly *deferred* by user

## Tech Stack
- **Frontend**: React + TailwindCSS + Shadcn UI + Recharts + Lucide-React
- **State**: React Context (`AppContext.jsx`) + localStorage persistence
- **Backend**: FastAPI + Motor (MongoDB) — boilerplate only, not wired to frontend
- **Worksheets**: 100% placeholder questions from `QUESTION_BANK` / `FALLBACK_QUESTIONS` (no AI, per user)

## Design System
- **Primary**: Royal Blue `#2563eb`
- **Secondary**: Purple `#7c3aed`
- **Tertiary**: Red `#dc2626` (kept as palette token but used sparingly)
- **Success**: Emerald `#10b981`
- **Dark Mode**: True off-black (`#0a0a0a` bg, `#171717` cards, `#262626` borders)
- **No gradients, no glow shadows, no blur decorations** — clean flat design
- **No emojis** — all iconography via Lucide-React; subject badges use letter symbols
- Sharp corners (custom rounded overrides), Instrument Serif for italic accents

## Completed (Feb 2026)
- Full landing page (Hero, WhatIs, HowItWorks, Features, Research, ExamPathways, Pricing, Testimonials, Signup, FinalCTA, Footer)
- Full dashboard app (12 pages)
- Multi-subject Course Wizard with per-subject exam dates
- 5-step interactive tutorial overlay with DOM highlighting
- Dark Mode + Demo Mode + Reset Demo flow
- Line-chart Progress View tracking % deltas over time
- Hand-drawn laboratory/cobweb empty state scenes
- Color palette swap (Royal Blue / Purple / Red)
- Removed all gradients, glows, blur decorations, and emojis
- **P2 refactor**: Split AppShell → Sidebar + DemoBanner + TopHeader; SubjectOverview → SubjectHero + TopicsList + SubjectSidePanels; StudyPlanModal → PlanGeneratingState + PlanDayCard + useMockStudyPlan hook
- **P2 cleanup**: Stable keys in list maps, removed unused eslint-disable directives

## In Progress
- None

## Deferred by User
- Backend integration (FastAPI models + endpoints for Users/Courses/Worksheets/Progress/Mistakes)
- AI worksheet generation (Emergent LLM Key) — explicitly deferred, worksheets stay placeholder-only
- Authentication (JWT or Google OAuth) — explicitly deferred

## Backlog
- Deeper red integration if user changes their mind (currently just palette-level accents)
- Progress view: filter by date range
- Worksheet history: search + pagination

## Key Files
- `/app/frontend/src/index.css` — CSS variables, dark mode overrides, global gradient/glow suppression
- `/app/frontend/src/data/mock.js` — SUBJECT_INFO (letter symbols), SUBJECTS, QUESTION_BANK, FALLBACK_QUESTIONS
- `/app/frontend/src/context/AppContext.jsx` — global state + localStorage
- `/app/frontend/src/components/app/AppShell.jsx` — thin composition of shell sub-components
- `/app/frontend/src/components/app/shell/` — Sidebar, DemoBanner, TopHeader
- `/app/frontend/src/components/app/subject/` — SubjectHero, TopicsList, SubjectSidePanels
- `/app/frontend/src/components/app/plan/` — PlanDayCard, PlanGeneratingState, useMockStudyPlan
- `/app/frontend/src/components/decor/` — InfinityBackground, StudyDecor, EmptyStateScene

## Health
- All services running via supervisor (hot-reload enabled)
- Lint: 0 errors on app components
- Broken: None
- Mocked: DB, Auth, worksheet generation, study plans

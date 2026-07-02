# InfinitySheets Clone — PRD

## Original Problem Statement
Clone `https://infinitysheets.netlify.app/#dashboard-view` as a pixel-perfect, fully functional MVP with:
- Replicated Landing Page and Dashboard UI
- Personalized exam prep (Worksheets, Mistake tracking, Subject Overviews)
- Dark Mode & Demo Mode
- Multi-subject Course Onboarding wizard, interactive Tutorial, Progress analytics
- **Admin content management**: upload syllabus PDFs, past papers, mark schemes, examiner reports; auto-extract + categorize by subject/topic; auto-populate the Question Bank

## Tech Stack
- **Frontend**: React + TailwindCSS + Shadcn UI + Recharts + Lucide-React
- **State**: React Context (`AppContext.jsx`) + localStorage (study data) + httpOnly cookies (auth session)
- **Backend**: FastAPI + Motor (MongoDB async) + PyJWT + bcrypt
- **Worksheets (current)**: 100% placeholder questions from `QUESTION_BANK` / `FALLBACK_QUESTIONS`
- **Worksheets (planned Phase 3)**: Populated from Claude-parsed past papers

## Design System
- **Primary**: Royal Blue `#2563eb` · **Secondary**: Purple `#7c3aed` · **Tertiary**: Red `#dc2626` · **Success**: Emerald `#10b981`
- **Dark Mode**: True off-black `#0a0a0a` bg
- No gradients, no glow shadows, no blur decorations, no emojis (letter symbols + Lucide icons)

## Phase 1 COMPLETE — JWT Authentication (this session)
- Backend `/app/backend/auth/` module: `security.py` (bcrypt + PyJWT), `models.py`, `deps.py` (get_current_user + require_admin), `routes.py` (register / login / logout / me / refresh), `seed.py` (idempotent admin seed + indexes + writes test_credentials.md)
- httpOnly cookies (`SameSite=None`, `Secure`) for cross-domain access on the preview URL
- Brute-force lockout: 5 attempts per `ip:email` → 15 minute lockout
- MongoDB indexes: `users.email` unique, `login_attempts.identifier`, `password_reset_tokens.expires_at` TTL
- CORS: explicit frontend URL + regex for `*.preview.emergentagent.com` + `allow_credentials=True`
- Admin seeded on every startup: `admin@infinitysheets.com` / `admin123` / role `admin`
- Frontend: `apiRegister` / `apiLogin` / `apiLogout` in AppContext; `/api/auth/me` on mount; SignupSection wired to real API; `role === 'admin'` conditional Admin nav + `AdminPlaceholder` page

## Phase 2 — Deferred: Admin file management
- Emergent object storage integration for PDF uploads (up to 20 MB)
- Admin UI: upload with subject/topic/type metadata (past paper / mark scheme / syllabus / examiner report)
- File list + delete endpoints
- pdfplumber text extraction

## Phase 3 — Deferred: AI question parsing
- Claude Sonnet 4.5 pipeline: PDF text → structured `[{question, options, correct, topic, subject}]`
- Populate `question_bank` MongoDB collection
- Wire Worksheets page to query DB (falling back to static mock for topics with no parsed content)

## Deferred by user
- Demo mode still fully client-side / localStorage — untouched

## Completed prior work (context)
- Full landing page, 12 dashboard pages
- 4-step Course Wizard (Exam → Subjects → Dates → Schedule)
- 5-step interactive tutorial overlay
- Dark Mode + Demo Mode + Reset Demo
- Line-chart Progress View
- Hand-drawn empty state scenes
- Color palette swap, no gradients/glows/emojis
- Component splits: AppShell → shell/, SubjectOverview → subject/, StudyPlanModal → plan/
- Stable keys in list maps; lint clean

## Key Files
- `/app/backend/server.py` — startup: create indexes, seed admin, write test_credentials.md
- `/app/backend/auth/` — all auth logic
- `/app/backend/.env` — `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL`
- `/app/frontend/src/context/AppContext.jsx` — apiRegister/apiLogin/apiLogout + /me hydration
- `/app/frontend/src/components/landing/SignupSection.jsx` — real signup/login forms
- `/app/frontend/src/components/app/AdminPlaceholder.jsx` — admin landing page
- `/app/frontend/src/components/app/AppShell.jsx` — conditional Admin nav
- `/app/memory/test_credentials.md` — admin credentials + endpoint list

## Health
- Services running via supervisor
- Lint: 0 errors, 1 harmless unused-eslint-disable warning
- Broken: None
- Verified: admin login via curl + browser, /me via cookie, admin nav gate, brute-force lockout

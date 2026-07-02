import React from 'react';
import { Shield, Upload, FileText, Sparkles } from 'lucide-react';

/**
 * Admin dashboard placeholder. Only rendered when the current user's
 * role === 'admin'. The upload / extraction / question-parsing features
 * arrive in Phase 2 and Phase 3.
 */
export default function AdminPlaceholder() {
  return (
    <div className="max-w-[880px]" data-testid="admin-placeholder">
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </span>
          <div>
            <div className="text-[11px] tracking-[0.16em] uppercase font-semibold text-blue-600">Admin</div>
            <h2 className="text-[24px] font-semibold tracking-tight text-slate-900">Content management</h2>
          </div>
        </div>
        <p className="text-[14px] text-slate-500 max-w-[620px] leading-relaxed">
          You are signed in as an administrator. This is the workspace where you&apos;ll upload syllabus PDFs, past papers, mark schemes and examiner reports, and the AI extraction pipeline will parse them into the shared question bank.
        </p>

        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          <FeatureCard Icon={Upload} title="Upload PDFs" hint="Syllabus · Past papers · Mark schemes · Examiner reports" status="Coming next session" />
          <FeatureCard Icon={FileText} title="Text extraction" hint="pdfplumber → clean text per document" status="Coming next session" />
          <FeatureCard Icon={Sparkles} title="AI question parsing" hint="Claude Sonnet 4.5 → structured Q&A JSON" status="Phase 3" />
        </div>

        <div className="mt-8 rounded-xl border border-blue-200/70 bg-blue-50 p-4 text-[13px] text-slate-700">
          <div className="font-semibold text-blue-700 mb-1">Phase 1 complete: authentication</div>
          Your admin session is verified via secure httpOnly cookies. All admin-only endpoints will require this role.
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ Icon, title, hint, status }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-slate-50/70 p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4 text-blue-600" />
        <div className="text-[13.5px] font-semibold text-slate-900">{title}</div>
      </div>
      <div className="text-[12px] text-slate-500 leading-snug">{hint}</div>
      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wider bg-violet-100 text-violet-700">
        {status}
      </div>
    </div>
  );
}

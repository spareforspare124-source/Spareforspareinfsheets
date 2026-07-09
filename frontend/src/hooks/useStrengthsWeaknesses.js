import { useEffect, useMemo, useState } from 'react';

// Clamp helper
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// localStorage key shared with the Strengths page for user overrides.
const PREFS_KEY = 'infinitysheets_sw_prefs_v1';

/**
 * Read the user's saved threshold overrides (set on the Strengths page) so
 * that Dashboard / Smart Recommendations reflect the same classification the
 * student is using. Listens to `storage` events so changes made in another
 * tab (or by the Strengths page after the current page has mounted) show up.
 */
export function useSavedSwOverrides() {
  const read = () => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(PREFS_KEY) : null;
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (!p || !p.overrides) return null;
      const ov = p.overrides;
      return {
        strengthMin: ov.strengthMin != null ? Number(ov.strengthMin) : null,
        weaknessMax: ov.weaknessMax != null ? Number(ov.weaknessMax) : null,
      };
    } catch (_e) {
      return null;
    }
  };
  const [overrides, setOverrides] = useState(read);
  useEffect(() => {
    const handler = (e) => {
      if (!e || e.key === PREFS_KEY || e.key === null) setOverrides(read());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handler);
      // Also poll once shortly after mount, since same-tab writes don't fire storage events.
      const t = setTimeout(() => setOverrides(read()), 300);
      return () => { window.removeEventListener('storage', handler); clearTimeout(t); };
    }
    return undefined;
  }, []);
  return overrides;
}

/**
 * Shared strengths/weaknesses computation used across the app (Strengths page,
 * Dashboard, Smart Recommendations).
 *
 * Adaptive thresholds are derived from the student's own weighted-average
 * accuracy across all completed topics:
 *
 *   adaptiveStrengthMin = round(avg + 10), clamped to [60, 90]
 *   adaptiveWeaknessMax = round(avg - 10), clamped to [20, 55]
 *
 * A minimum 10-pt gap is enforced so the buckets never overlap.
 *
 * The caller may override either threshold via the `overrides` argument to
 * support "Customize" mode. `isCustom` is true whenever the effective values
 * differ from the adaptive defaults.
 *
 * @param {Array} worksheets  - list of worksheet records ({subject, topic, correct, total})
 * @param {{strengthMin?: number|null, weaknessMax?: number|null}} [overrides]
 */
export function useStrengthsWeaknesses(worksheets, overrides) {
  const ws = worksheets || [];

  const byTopic = useMemo(() => {
    const t = {};
    ws.forEach((w) => {
      if (!t[w.topic]) t[w.topic] = { correct: 0, total: 0, subject: w.subject };
      t[w.topic].correct += w.correct;
      t[w.topic].total += w.total;
    });
    return Object.entries(t)
      .map(([k, v]) => ({ topic: k, ...v, acc: v.total ? Math.round((v.correct / v.total) * 100) : 0 }))
      .sort((a, b) => b.acc - a.acc);
  }, [ws]);

  const adaptive = useMemo(() => {
    const totalCorrect = byTopic.reduce((s, t) => s + t.correct, 0);
    const totalQ = byTopic.reduce((s, t) => s + t.total, 0);
    const avg = totalQ ? Math.round((totalCorrect / totalQ) * 100) : 0;
    let strengthMin = clamp(Math.round(avg + 10), 60, 90);
    let weaknessMax = clamp(Math.round(avg - 10), 20, 55);
    if (weaknessMax >= strengthMin - 10) weaknessMax = strengthMin - 10;
    return { avg, strengthMin, weaknessMax };
  }, [byTopic]);

  const effective = useMemo(() => {
    const ov = overrides || {};
    let strengthMin = ov.strengthMin != null ? Number(ov.strengthMin) : adaptive.strengthMin;
    let weaknessMax = ov.weaknessMax != null ? Number(ov.weaknessMax) : adaptive.weaknessMax;
    // Guardrails: keep sensible bounds & minimum 5-pt gap
    strengthMin = clamp(strengthMin, 10, 100);
    weaknessMax = clamp(weaknessMax, 0, 90);
    if (weaknessMax >= strengthMin - 5) weaknessMax = Math.max(0, strengthMin - 5);
    return { strengthMin, weaknessMax };
  }, [adaptive, overrides]);

  const isCustom = useMemo(() => {
    return (
      effective.strengthMin !== adaptive.strengthMin ||
      effective.weaknessMax !== adaptive.weaknessMax
    );
  }, [effective, adaptive]);

  const strengths = useMemo(
    () => byTopic.filter((t) => t.acc >= effective.strengthMin),
    [byTopic, effective.strengthMin]
  );
  const weaknesses = useMemo(
    () => byTopic.filter((t) => t.acc < effective.weaknessMax),
    [byTopic, effective.weaknessMax]
  );

  return {
    byTopic,
    avg: adaptive.avg,
    adaptiveStrengthMin: adaptive.strengthMin,
    adaptiveWeaknessMax: adaptive.weaknessMax,
    strengthMin: effective.strengthMin,
    weaknessMax: effective.weaknessMax,
    isCustom,
    strengths,
    weaknesses,
  };
}

export default useStrengthsWeaknesses;

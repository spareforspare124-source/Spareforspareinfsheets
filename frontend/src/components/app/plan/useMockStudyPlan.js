import { useMemo } from 'react';

/**
 * Build a lightweight, deterministic 7-day study plan.
 * Blends the student's subject list with their weakest topics
 * (lowest accuracy from completed worksheets) to pick each day's focus.
 * All output is placeholder data — no AI, no network calls.
 */
export default function useMockStudyPlan({ worksheets, subjects, days }) {
  return useMemo(() => {
    const weakTopics = {};
    (worksheets || []).forEach((w) => {
      const k = w.topic;
      if (!weakTopics[k]) weakTopics[k] = { total: 0, correct: 0, subject: w.subject };
      weakTopics[k].total += w.total;
      weakTopics[k].correct += w.correct;
    });
    const weakArr = Object.entries(weakTopics)
      .map(([k, v]) => ({ topic: k, ...v, acc: v.total ? v.correct / v.total : 0 }))
      .sort((a, b) => a.acc - b.acc);

    const out = [];
    const ndays = Math.min(7, Math.max(3, days || 7));
    for (let d = 0; d < ndays; d++) {
      const subj = subjects[d % subjects.length];
      const weak = weakArr[d % Math.max(1, weakArr.length)];
      out.push({
        day: d + 1,
        subject: subj,
        focus: weak && weak.subject === subj ? weak.topic : null,
        minutes: 30 + (d % 3) * 15,
        items: [
          `${10 + (d % 3) * 5}-question ${subj} worksheet`,
          d % 2 === 0 ? 'Review yesterday’s mistakes' : 'Re-solve 3 hardest questions',
        ],
      });
    }
    return out;
  }, [worksheets, subjects, days]);
}

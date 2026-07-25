import { ShieldCheck } from 'lucide-react';
import { FEEDBACK_OPTIONS } from '../data/sampleData.jsx';

export default function AdminReviewQueue({ entries }) {
  const counts = { helpful: 0, wrong: 0, incomplete: 0, outdated: 0 };
  entries.forEach((e) => { if (counts[e.rating] !== undefined) counts[e.rating] += 1; });

  const recentComments = entries
    .filter((e) => e.comment)
    .slice()
    .reverse();

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated queue — saved in this browser, visible to Quality Manager role only</div>
        <div className="qg-page-title">Feedback &amp; Review</div>
        <div className="qg-page-sub">
          Feedback submitted on Q&amp;A answers and NCR summaries collects here for review.
          Totals and comments remain after refresh until Reset Demo Data is selected.
        </div>
      </div>

      <div className="qg-review-stat-row">
        {FEEDBACK_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <div className="qg-review-stat-card" key={opt.id}>
              <div className="qg-review-stat-num">{counts[opt.id]}</div>
              <div className="qg-review-stat-label"><Icon size={12} /> {opt.label}</div>
            </div>
          );
        })}
      </div>

      <div className="qg-panel">
        <div className="qg-panel-title">Recent comments</div>
        <div className="qg-panel-sub">{entries.length} total saved submission{entries.length === 1 ? '' : 's'}</div>
        {recentComments.length === 0 ? (
          <div className="qg-empty">No comments have been submitted yet.</div>
        ) : (
          recentComments.map((e) => {
            const opt = FEEDBACK_OPTIONS.find((o) => o.id === e.rating);
            return (
              <div className="qg-review-comment-item" key={e.id}>
                <div className="qg-review-comment-top">
                  <span className={`qg-review-badge ${e.rating}`}>{opt ? opt.label : e.rating}</span>
                  <span className="qg-review-context">{e.resultType === 'ncr' ? 'NCR Assistant' : 'Q&A'} · {e.contextLabel}</span>
                </div>
                <div className="qg-review-comment-text">{e.comment}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NCR Assistant                                                        */
/* ------------------------------------------------------------------ */

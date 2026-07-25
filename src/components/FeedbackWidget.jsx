import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { FEEDBACK_OPTIONS } from '../data/sampleData.jsx';
import { makeId } from '../utils/qualiguide.js';

export default function FeedbackWidget({ resultId, resultType, contextLabel, entries, onSubmit }) {
  const [pendingRating, setPendingRating] = useState(null);
  const [comment, setComment] = useState('');

  const existing = entries.find((e) => e.resultId === resultId);

  if (existing) {
    const opt = FEEDBACK_OPTIONS.find((o) => o.id === existing.rating);
    const Icon = opt ? opt.icon : ThumbsUp;
    return (
      <div className="qg-feedback-wrap">
        <div className="qg-feedback-confirm">
          <Icon size={14} /> Feedback submitted — marked "{opt ? opt.label : existing.rating}". Thank you.
        </div>
      </div>
    );
  }

  function submit() {
    if (!pendingRating) return;
    onSubmit({
      id: makeId(),
      resultId,
      resultType,
      contextLabel,
      rating: pendingRating,
      comment: comment.trim(),
      timestamp: Date.now(),
    });
  }

  return (
    <div className="qg-feedback-wrap">
      <div className="qg-feedback-label">Was this useful?</div>
      <div className="qg-feedback-row">
        {FEEDBACK_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              className={`qg-feedback-btn ${pendingRating === opt.id ? `selected ${opt.id}` : ''}`}
              onClick={() => setPendingRating(opt.id)}
            >
              <Icon size={13} /> {opt.label}
            </button>
          );
        })}
      </div>
      {pendingRating && (
        <>
          <textarea
            aria-label="Optional feedback comment"
            className="qg-feedback-comment"
            placeholder="Optional comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="qg-feedback-submit" onClick={submit}>Submit feedback</button>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Admin Review Queue (Quality Manager only)                           */
/* ------------------------------------------------------------------ */

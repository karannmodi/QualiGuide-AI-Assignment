import { useState } from 'react';
import { AlertTriangle, Search, ShieldCheck } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../data/sampleData.jsx';
import { makeId, matchQuestion } from '../utils/qualiguide.js';
import FeedbackWidget from './FeedbackWidget.jsx';

export default function QAPanel({ documents, feedbackEntries, onSubmitFeedback }) {
  const [question, setQuestion] = useState('');
  const [thread, setThread] = useState([]);
  const [qaError, setQaError] = useState('');

  function ask(q) {
    const text = q.trim();
    if (!text) return;
    if (text.length > 500) {
      setQaError('Question cannot exceed 500 characters.');
      return;
    }
    setQaError('');
    const doc = matchQuestion(text, documents);
    setThread([{ id: makeId(), question: text, doc }, ...thread]);
    setQuestion('');
  }

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated matching — no model or network call, just local keyword rules over sample data</div>
        <div className="qg-page-title">Ask a Question</div>
        <div className="qg-page-sub">
          Answers are only generated when a sample document supports them, and every
          supported answer shows its source. If nothing matches, the system says so
          instead of guessing.
        </div>
      </div>

      <div className="qg-ask-box">
        <div className="qg-ask-row">
          <input
            aria-label="Type your question"
            aria-describedby={qaError ? 'qg-qa-error' : undefined}
            placeholder="e.g. What PPE is required for ESD-sensitive parts?"
            maxLength={500}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (qaError && e.target.value.length <= 500) setQaError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && ask(question)}
          />
          <button className="qg-ask-btn" disabled={!question.trim()} onClick={() => ask(question)}>
            <Search size={14} /> Ask
          </button>
        </div>
        {qaError && <div id="qg-qa-error" className="qg-field-err" style={{ marginTop: 6 }}>{qaError}</div>}
        <div className="qg-chip-row">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button key={q} className="qg-chip" onClick={() => ask(q)}>{q}</button>
          ))}
        </div>
      </div>

      <div className="qg-qa-thread">
        {thread.map((item) => (
          <div key={item.id}>
            <div className="qg-q-bubble"><b>You asked:</b> {item.question}</div>
            <div style={{ height: 8 }} />
            {item.doc ? (
              <div className="qg-stamp-card">
                <div className="qg-stamp-head">
                  <div className="qg-stamp-seal"><ShieldCheck size={12} /> Supported answer</div>
                </div>
                <div className="qg-stamp-answer">
                  Per <b>{item.doc.title}</b>: {item.doc.fullText}
                </div>
                <div className="qg-cite-box">
                  <div className="qg-cite-doc">
                    {item.doc.title}
                    <span className="qg-cite-rev">REV {item.doc.revision} · {item.doc.status.toUpperCase()} · {item.doc.department}</span>
                  </div>
                  <div className="qg-cite-excerpt">"{item.doc.fullText}"</div>
                </div>
                <FeedbackWidget
                  resultId={item.id}
                  resultType="qa"
                  contextLabel={item.question}
                  entries={feedbackEntries}
                  onSubmit={onSubmitFeedback}
                />
              </div>
            ) : (
              <div className="qg-refusal-card">
                <div className="qg-refusal-head"><AlertTriangle size={14} /> No approved source found</div>
                <div className="qg-refusal-text">
                  None of the sample documents in this library support an answer to that
                  question. Rather than guess, QualiGuide AI is refusing to answer — in
                  production this would route to a quality manager or trigger a document
                  gap review.
                </div>
                <FeedbackWidget
                  resultId={item.id}
                  resultType="qa"
                  contextLabel={item.question}
                  entries={feedbackEntries}
                  onSubmit={onSubmitFeedback}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feedback widget (reused on Q&A answers and NCR summaries)            */
/* ------------------------------------------------------------------ */

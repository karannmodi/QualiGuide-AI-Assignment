import { ShieldCheck, MessageSquareText, ChevronRight, ClipboardList, FileStack } from 'lucide-react';

export default function Dashboard({ persona, documents, setView }) {
  const current = documents.filter((d) => d.status === 'current').length;
  const archived = documents.filter((d) => d.status === 'archived').length;
  const depts = new Set(documents.map((d) => d.department)).size;

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated demo data — nothing here is a real customer or document</div>
        <div className="qg-page-title">Welcome back, {persona.label.split(' — ')[0]}</div>
        <div className="qg-page-sub">
          This dashboard summarizes the sample document library saved in this browser. Nothing is fetched from a server, and simulated additions remain after refresh.
        </div>
      </div>

      <div className="qg-stat-row">
        <div className="qg-stat-card">
          <div className="qg-stat-num">{documents.length}</div>
          <div className="qg-stat-label">Total sample documents</div>
        </div>
        <div className="qg-stat-card">
          <div className="qg-stat-num">{current}</div>
          <div className="qg-stat-label">Marked current</div>
        </div>
        <div className="qg-stat-card">
          <div className="qg-stat-num">{archived}</div>
          <div className="qg-stat-label">Marked archived</div>
        </div>
        <div className="qg-stat-card">
          <div className="qg-stat-num">{depts}</div>
          <div className="qg-stat-label">Departments covered</div>
        </div>
      </div>

      <div className="qg-panel-row">
        <div className="qg-panel">
          <div className="qg-panel-title">Jump back in</div>
          <div className="qg-panel-sub">These modules are ready to try in this build.</div>
          <button className="qg-quicklink" onClick={() => setView('qa')}>
            <span className="qg-quicklink-label"><MessageSquareText size={15} /> Ask a quality question</span>
            <ChevronRight size={15} color="#8992A0" />
          </button>
          <button className="qg-quicklink" onClick={() => setView('ncr')}>
            <span className="qg-quicklink-label"><ClipboardList size={15} /> Start an NCR summary</span>
            <ChevronRight size={15} color="#8992A0" />
          </button>
          <button className="qg-quicklink" onClick={() => setView('library')}>
            <span className="qg-quicklink-label"><FileStack size={15} /> Browse the document library</span>
            <ChevronRight size={15} color="#8992A0" />
          </button>
        </div>
        <div className="qg-panel">
          <div className="qg-panel-title">Why you're here</div>
          <div className="qg-panel-sub">Based on the selected role</div>
          <div className="qg-persona-need">
            <b>{persona.label}</b> — {persona.need.toLowerCase()}. The Feedback &amp; Review
            queue is visible only to the Quality Manager role, which is reflected in the
            navigation on the left.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simulated document upload (Quality Manager only)                    */
/* ------------------------------------------------------------------ */

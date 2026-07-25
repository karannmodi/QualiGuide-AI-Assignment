import { ChevronRight, ShieldCheck } from 'lucide-react';
import { PERSONAS } from '../data/sampleData.jsx';

export default function RoleSelector({ onSelect }) {
  return (
    <div className="qg-login-wrap">
      <div className="qg-login-card">
        <div className="qg-login-eyebrow">QualiGuide AI — Prototype</div>
        <div className="qg-login-title">Choose a role to explore</div>
        <div className="qg-login-sub">
          This is a simulated sign-in for demo purposes only. No credentials, accounts, or
          real identity provider are involved — selecting a role just changes what the
          prototype shows you.
        </div>
        <div className="qg-role-list">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.id} className="qg-role-btn" onClick={() => onSelect(p)}>
                <div className="qg-role-icon"><Icon size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div className="qg-role-name">{p.label}</div>
                  <div className="qg-role-need">{p.need}</div>
                </div>
                <ChevronRight size={16} color="#8992A0" />
              </button>
            );
          })}
        </div>
        <div className="qg-sim-note">
          <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 2 }} color="#28527A" />
          <span>
            Simulated feature: role selection changes the view only. It is not a security
            control, and no real authentication is happening in this prototype.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                              */
/* ------------------------------------------------------------------ */

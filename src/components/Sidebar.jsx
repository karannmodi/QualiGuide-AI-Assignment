import { LayoutDashboard, FileStack, MessageSquareText, ClipboardList, Inbox, LogOut, RotateCcw } from 'lucide-react';

export default function Sidebar({ persona, view, setView, onSwitchRole, onResetDemoData }) {
  const Icon = persona.icon;
  const isQualityManager = persona.id === 'quality_manager';
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
    { id: 'library', label: 'Document Library', icon: FileStack, enabled: true },
    { id: 'qa', label: 'Ask a Question', icon: MessageSquareText, enabled: true },
    { id: 'ncr', label: 'NCR Assistant', icon: ClipboardList, enabled: true },
    { id: 'feedback', label: 'Feedback & Review', icon: Inbox, enabled: isQualityManager, badge: isQualityManager ? null : 'QM only' },
  ];
  return (
    <div className="qg-sidebar">
      <div className="qg-brand">
        <div className="qg-brand-mark">QG</div>
        <div className="qg-brand-name">QualiGuide AI</div>
      </div>
      <div className="qg-nav">
        {items.map((it) => {
          const ItemIcon = it.icon;
          if (!it.enabled) {
            return (
              <div
                key={it.id}
                className="qg-nav-item disabled"
                aria-disabled="true"
                title={it.badge === 'QM only' ? 'Available to the Quality Manager role' : 'Coming in a future iteration'}
              >
                <ItemIcon size={15} />
                {it.label}
                <span className="qg-nav-soon">{it.badge || 'Soon'}</span>
              </div>
            );
          }
          return (
            <button
              key={it.id}
              className={`qg-nav-item ${view === it.id ? 'active' : ''}`}
              onClick={() => setView(it.id)}
            >
              <ItemIcon size={15} />
              {it.label}
            </button>
          );
        })}
      </div>
      <div className="qg-sidebar-footer">
        <div className="qg-role-chip">
          <Icon size={14} />
          <span className="qg-role-chip-label">{persona.label}</span>
        </div>
        <button className="qg-switch-btn" onClick={onSwitchRole}>
          <LogOut size={13} /> <span className="qg-switch-btn-label">Switch role</span>
        </button>
        <button className="qg-switch-btn" onClick={onResetDemoData}>
          <RotateCcw size={13} /> <span className="qg-switch-btn-label">Reset demo data</span>
        </button>
      </div>
    </div>
  );
}

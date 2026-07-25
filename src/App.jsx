import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { DOCUMENTS, PERSONAS } from './data/sampleData.jsx';
import RoleSelector from './components/RoleSelector.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import DocumentLibrary from './components/DocumentLibrary.jsx';
import QAPanel from './components/QAPanel.jsx';
import NCRAssistant from './components/NCRAssistant.jsx';
import AdminReviewQueue from './components/AdminReviewQueue.jsx';

const STORAGE_KEYS = {
  personaId: 'qualiguide.personaId',
  view: 'qualiguide.view',
  documents: 'qualiguide.documents',
  feedback: 'qualiguide.feedback',
};

function readStoredValue(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue === null ? fallback : JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}

function readStoredArray(key, fallback) {
  const value = readStoredValue(key, fallback);
  return Array.isArray(value) ? value : fallback;
}

export default function App() {
  const [persona, setPersona] = useState(() => {
    const storedPersonaId = readStoredValue(STORAGE_KEYS.personaId, null);
    return PERSONAS.find((item) => item.id === storedPersonaId) || null;
  });
  const [view, setView] = useState(() => readStoredValue(STORAGE_KEYS.view, 'dashboard'));
  const [feedbackEntries, setFeedbackEntries] = useState(() => readStoredArray(STORAGE_KEYS.feedback, []));
  const [documents, setDocuments] = useState(() => readStoredArray(STORAGE_KEYS.documents, DOCUMENTS));
  const [storageWarning, setStorageWarning] = useState(false);

  function safeSetItem(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setStorageWarning(true);
    }
  }

  function safeRemoveItem(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      setStorageWarning(true);
    }
  }

  useEffect(() => {
    if (persona) {
      safeSetItem(STORAGE_KEYS.personaId, persona.id);
    } else {
      safeRemoveItem(STORAGE_KEYS.personaId);
    }
  }, [persona]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.view, view);
  }, [view]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.documents, documents);
  }, [documents]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.feedback, feedbackEntries);
  }, [feedbackEntries]);

  function submitFeedback(entry) {
    setFeedbackEntries((prev) => [...prev, entry]);
  }

  function addDocument(doc) {
    setDocuments((prev) => [doc, ...prev]);
  }

  function switchRole() {
    setPersona(null);
    setView('dashboard');
  }

  function resetDemoData() {
    const shouldReset = window.confirm(
      'Reset all simulated uploaded documents, feedback, and saved role information?'
    );
    if (!shouldReset) return;

    try {
      Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    } catch {
      setStorageWarning(true);
    }

    setDocuments([...DOCUMENTS]);
    setFeedbackEntries([]);
    setPersona(null);
    setView('dashboard');
  }

  if (!persona) {
    return (
      <div className="qg-root" style={{ display: 'block' }}>
        {storageWarning && (
          <div className="qg-storage-warning-banner" role="alert">
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>
              Browser storage is restricted or full. Your changes will work during this session, but may not be saved after you refresh.
            </span>
            <button className="qg-storage-warning-dismiss" onClick={() => setStorageWarning(false)} aria-label="Dismiss warning">
              <X size={14} />
            </button>
          </div>
        )}
        <RoleSelector onSelect={(selectedPersona) => {
          setPersona(selectedPersona);
          setView('dashboard');
        }} />
      </div>
    );
  }

  const isQualityManager = persona.id === 'quality_manager';
  const activeView = view === 'feedback' && !isQualityManager ? 'dashboard' : view;

  return (
    <div className="qg-root">
      <Sidebar
        persona={persona}
        view={activeView}
        setView={setView}
        onSwitchRole={switchRole}
        onResetDemoData={resetDemoData}
      />
      <div className="qg-main">
        {storageWarning && (
          <div className="qg-storage-warning-banner" role="alert">
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>
              Browser storage is restricted or full. Your changes will work during this session, but may not be saved after you refresh.
            </span>
            <button className="qg-storage-warning-dismiss" onClick={() => setStorageWarning(false)} aria-label="Dismiss warning">
              <X size={14} />
            </button>
          </div>
        )}
        {activeView === 'dashboard' && <Dashboard persona={persona} documents={documents} setView={setView} />}
        {activeView === 'library' && (
          <DocumentLibrary documents={documents} isQualityManager={isQualityManager} onAddDocument={addDocument} />
        )}
        {activeView === 'qa' && (
          <QAPanel documents={documents} feedbackEntries={feedbackEntries} onSubmitFeedback={submitFeedback} />
        )}
        {activeView === 'ncr' && (
          <NCRAssistant documents={documents} feedbackEntries={feedbackEntries} onSubmitFeedback={submitFeedback} />
        )}
        {activeView === 'feedback' && isQualityManager && <AdminReviewQueue entries={feedbackEntries} />}
      </div>
    </div>
  );
}

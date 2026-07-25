import { useEffect, useState } from 'react';
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

  useEffect(() => {
    try {
      if (persona) {
        window.localStorage.setItem(STORAGE_KEYS.personaId, JSON.stringify(persona.id));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.personaId);
      }
    } catch {
      // The prototype still works in memory if browser storage is unavailable.
    }
  }, [persona]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.view, JSON.stringify(view));
    } catch {
      // The prototype still works in memory if browser storage is unavailable.
    }
  }, [view]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.documents, JSON.stringify(documents));
    } catch {
      // The prototype still works in memory if browser storage is unavailable.
    }
  }, [documents]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.feedback, JSON.stringify(feedbackEntries));
    } catch {
      // The prototype still works in memory if browser storage is unavailable.
    }
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
      // State is still reset below if browser storage is unavailable.
    }

    setDocuments([...DOCUMENTS]);
    setFeedbackEntries([]);
    setPersona(null);
    setView('dashboard');
  }

  if (!persona) {
    return (
      <div className="qg-root" style={{ display: 'block' }}>
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

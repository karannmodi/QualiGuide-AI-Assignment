import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Search, ShieldCheck, UploadCloud, X } from 'lucide-react';
import { EMPTY_UPLOAD_FORM } from '../data/sampleData.jsx';
import { makeId } from '../utils/qualiguide.js';

function UploadDocumentModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_UPLOAD_FORM);
  const [errors, setErrors] = useState({});
  const [justAdded, setJustAdded] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const previousActiveElement = document.activeElement;

    // Focus the title input automatically on modal mount
    const firstInput = modalRef.current?.querySelector('#up-title') || modalRef.current?.querySelector('button, input, select, textarea');
    if (firstInput) {
      firstInput.focus();
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.disabled && el.tabIndex !== -1);

        if (focusables.length === 0) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl || !modalRef.current.contains(document.activeElement)) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl || !modalRef.current.contains(document.activeElement)) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [onClose]);

  function updateField(key, value) {
    setForm({ ...form, [key]: value });
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.documentNumber.trim()) errs.documentNumber = 'Document number is required.';
    if (!form.revision.trim()) errs.revision = 'Revision is required.';
    if (!form.department.trim()) errs.department = 'Department is required.';
    if (!form.site.trim()) errs.site = 'Site is required.';
    if (!form.tags.trim()) errs.tags = 'At least one tag is required.';
    if (!form.excerpt.trim()) errs.excerpt = 'A source excerpt is required.';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onAdd({
      id: makeId(),
      title: form.title.trim(),
      documentNumber: form.documentNumber.trim(),
      revision: form.revision.trim(),
      department: form.department.trim(),
      site: form.site.trim(),
      status: form.status,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      fullText: form.excerpt.trim(),
    });
    setJustAdded(true);
  }

  function resetForAnother() {
    setForm(EMPTY_UPLOAD_FORM);
    setErrors({});
    setJustAdded(false);
  }

  return (
    <div className="qg-modal-overlay" onClick={onClose}>
      <div
        className="qg-modal-card"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qg-upload-modal-title"
      >
        <div className="qg-modal-head">
          <div className="qg-modal-title" id="qg-upload-modal-title">Add a simulated document</div>
          <button className="qg-modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </div>
        <div className="qg-modal-sub">
          No file is processed — this creates a simulated record in this browser's local storage so it can be searched, filtered, and matched by Q&amp;A / NCR. It remains after refresh until Reset Demo Data is selected.
        </div>

        {justAdded ? (
          <>
            <div className="qg-success-note">
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              "{form.title}" was added to the simulated library and saved in this browser. It will remain after refresh until Reset Demo Data is selected.
            </div>
            <div className="qg-modal-actions">
              <button className="qg-modal-secondary-btn" onClick={resetForAnother}>Add another</button>
              <button className="qg-upload-btn" onClick={onClose}>Done</button>
            </div>
          </>
        ) : (
          <>
            {Object.keys(errors).length > 0 && (
              <div className="qg-form-err-banner">Please fix the highlighted fields before adding this document.</div>
            )}
            <div className="qg-form-grid">
              <div className="qg-form-field full">
                <label className="qg-form-label" htmlFor="up-title">Title<span className="req">*</span></label>
                <input id="up-title" className={`qg-form-input ${errors.title ? 'err' : ''}`} value={form.title}
                  onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. Torque Verification Work Instruction" />
                {errors.title && <div className="qg-field-err">{errors.title}</div>}
              </div>

              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-docnum">Document number<span className="req">*</span></label>
                <input id="up-docnum" className={`qg-form-input ${errors.documentNumber ? 'err' : ''}`} value={form.documentNumber}
                  onChange={(e) => updateField('documentNumber', e.target.value)} placeholder="e.g. WI-3312" />
                {errors.documentNumber && <div className="qg-field-err">{errors.documentNumber}</div>}
              </div>
              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-revision">Revision<span className="req">*</span></label>
                <input id="up-revision" className={`qg-form-input ${errors.revision ? 'err' : ''}`} value={form.revision}
                  onChange={(e) => updateField('revision', e.target.value)} placeholder="e.g. A" />
                {errors.revision && <div className="qg-field-err">{errors.revision}</div>}
              </div>

              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-department">Department<span className="req">*</span></label>
                <input id="up-department" className={`qg-form-input ${errors.department ? 'err' : ''}`} value={form.department}
                  onChange={(e) => updateField('department', e.target.value)} placeholder="e.g. Quality" />
                {errors.department && <div className="qg-field-err">{errors.department}</div>}
              </div>
              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-site">Site<span className="req">*</span></label>
                <input id="up-site" className={`qg-form-input ${errors.site ? 'err' : ''}`} value={form.site}
                  onChange={(e) => updateField('site', e.target.value)} placeholder="e.g. Plant 1" />
                {errors.site && <div className="qg-field-err">{errors.site}</div>}
              </div>

              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-status">Status</label>
                <select id="up-status" className="qg-form-select" value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                  <option value="current">Current</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="qg-form-field">
                <label className="qg-form-label" htmlFor="up-tags">Tags (comma separated)<span className="req">*</span></label>
                <input id="up-tags" className={`qg-form-input ${errors.tags ? 'err' : ''}`} value={form.tags}
                  onChange={(e) => updateField('tags', e.target.value)} placeholder="e.g. torque, assembly, checklist" />
                {errors.tags && <div className="qg-field-err">{errors.tags}</div>}
              </div>

              <div className="qg-form-field full">
                <label className="qg-form-label" htmlFor="up-excerpt">Source excerpt<span className="req">*</span></label>
                <textarea id="up-excerpt" className={`qg-form-textarea ${errors.excerpt ? 'err' : ''}`} value={form.excerpt}
                  onChange={(e) => updateField('excerpt', e.target.value)} placeholder="A short passage this document would be cited from…" />
                {errors.excerpt && <div className="qg-field-err">{errors.excerpt}</div>}
              </div>
            </div>

            <button className="qg-upload-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSubmit}>
              <UploadCloud size={15} /> Add to library
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Document Library                                                    */
/* ------------------------------------------------------------------ */
export default function DocumentLibrary({ documents, isQualityManager, onAddDocument }) {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [status, setStatus] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  const depts = ['all', ...new Set(documents.map((d) => d.department))];

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = documents.filter((d) => {
    const matchesSearch =
      normalizedSearch === '' ||
      d.title.toLowerCase().includes(normalizedSearch) ||
      (d.documentNumber || '').toLowerCase().includes(normalizedSearch) ||
      d.revision.toLowerCase().includes(normalizedSearch) ||
      d.department.toLowerCase().includes(normalizedSearch) ||
      d.site.toLowerCase().includes(normalizedSearch) ||
      d.tags.some((t) => t.toLowerCase().includes(normalizedSearch));
    const matchesDept = dept === 'all' || d.department === dept;
    const matchesStatus = status === 'all' || d.status === status;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated browser storage — uploaded documents persist after refresh</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div className="qg-page-title">Document Library</div>
            <div className="qg-page-sub">
              Sample quality documents with revision, department, site, and status metadata.
              {isQualityManager
                ? ' As Quality Manager, you can add a simulated demo document below. It is saved in this browser until demo data is reset.'
                : ' Uploading is available to the Quality Manager role.'}
            </div>
          </div>
          {isQualityManager && (
            <button className="qg-upload-btn" onClick={() => setUploadOpen(true)}>
              <UploadCloud size={15} /> Add document
            </button>
          )}
        </div>
      </div>

      {uploadOpen && (
        <UploadDocumentModal
          onClose={() => setUploadOpen(false)}
          onAdd={(doc) => onAddDocument(doc)}
        />
      )}

      <div className="qg-filter-bar">
        <div className="qg-search-input">
          <Search size={14} color="#5C6773" />
          <input
            aria-label="Search documents by title or tag"
            placeholder="Search title or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select aria-label="Filter by department" className="qg-select" value={dept} onChange={(e) => setDept(e.target.value)}>
          {depts.map((d) => (
            <option key={d} value={d}>{d === 'all' ? 'All departments' : d}</option>
          ))}
        </select>
        <select aria-label="Filter by status" className="qg-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="current">Current only</option>
          <option value="archived">Archived only</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="qg-empty">No documents match those filters. Try clearing a filter.</div>
      ) : (
        <div className="qg-doc-grid">
          {filtered.map((d) => (
            <div className="qg-doc-card" key={d.id}>
              <div className="qg-doc-top">
                <div className="qg-doc-title">{d.title}</div>
              </div>
              <div className="qg-doc-meta">
                <span className="qg-tag">{d.department}</span>
                <span className="qg-tag">{d.site}</span>
                {d.documentNumber && <span className="qg-tag qg-mono">{d.documentNumber}</span>}
                <span className="qg-tag qg-mono">Rev {d.revision}</span>
                <span className={`qg-tag status-${d.status}`}>{d.status}</span>
              </div>
              <div className="qg-doc-excerpt">{d.fullText}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Q&A Panel                                                            */
/* ------------------------------------------------------------------ */

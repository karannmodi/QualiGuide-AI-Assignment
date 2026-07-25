import { useState } from 'react';
import { ClipboardCheck, ClipboardList, FileStack, ListChecks, PackageSearch, Search, ShieldCheck } from 'lucide-react';
import { DETECTION_STAGE_OPTIONS, EMPTY_NCR_FORM, SAMPLE_NCRS, SEVERITY_OPTIONS } from '../data/sampleData.jsx';
import { generateNcrSummary, makeId } from '../utils/qualiguide.js';
import FeedbackWidget from './FeedbackWidget.jsx';

export default function NCRAssistant({ documents, feedbackEntries, onSubmitFeedback }) {
  const [form, setForm] = useState(EMPTY_NCR_FORM);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  function loadExample(ex) {
    setForm({
      partNumber: ex.partNumber, supplier: ex.supplier, issueDescription: ex.issueDescription,
      affectedQuantity: ex.affectedQuantity, severity: ex.severity, detectionStage: ex.detectionStage,
      containmentAction: ex.containmentAction,
    });
    setErrors({});
    setResult(null);
  }

  function updateField(key, value) {
    setForm({ ...form, [key]: value });
  }

  function validate() {
    const errs = {};
    if (!form.partNumber.trim()) errs.partNumber = 'Part number is required.';
    else if (form.partNumber.trim().length > 120) errs.partNumber = 'Part number cannot exceed 120 characters.';

    if (!form.supplier.trim()) errs.supplier = 'Supplier (or "Internal") is required.';
    else if (form.supplier.trim().length > 160) errs.supplier = 'Supplier cannot exceed 160 characters.';

    if (!form.issueDescription.trim()) errs.issueDescription = 'Issue description is required.';
    else if (form.issueDescription.trim().length > 2000) errs.issueDescription = 'Issue description cannot exceed 2,000 characters.';

    if (!form.severity) errs.severity = 'Select a severity.';
    if (!form.detectionStage) errs.detectionStage = 'Select a detection stage.';

    if (!form.containmentAction.trim()) errs.containmentAction = 'Immediate containment action is required.';
    else if (form.containmentAction.trim().length > 2000) errs.containmentAction = 'Immediate containment action cannot exceed 2,000 characters.';

    const qty = form.affectedQuantity.trim();
    if (!qty) {
      errs.affectedQuantity = 'Affected quantity is required.';
    } else if (!/^\d+$/.test(qty) || parseInt(qty, 10) <= 0) {
      errs.affectedQuantity = 'Enter a whole number greater than 0.';
    }
    return errs;
  }

  function handleGenerate() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setResult(null);
      return;
    }
    setResult({ id: makeId(), ...generateNcrSummary(form, documents) });
  }

  return (
    <div>
      <div className="qg-page-head">
        <div className="qg-sim-banner"><ShieldCheck size={12} /> Simulated NCR logic — templated from your form and the sample document set, no model or network call</div>
        <div className="qg-page-title">NCR Assistant</div>
        <div className="qg-page-sub">
          Enter a nonconformance, or load a fictional example, to generate a structured
          summary, containment steps, investigation areas, and next actions grounded only
          in the sample approved documents.
        </div>
      </div>

      <div className="qg-example-row">
        {SAMPLE_NCRS.map((ex) => (
          <button key={ex.id} className="qg-example-chip" onClick={() => loadExample(ex)}>
            <ClipboardList size={13} /> {ex.label}
          </button>
        ))}
      </div>

      <div className="qg-ncr-layout">
        <div className="qg-panel">
          <div className="qg-panel-title">Nonconformance details</div>
          <div className="qg-panel-sub">Fields marked <span style={{ color: '#9C5A18' }}>*</span> are required.</div>

          {Object.keys(errors).length > 0 && (
            <div className="qg-form-err-banner">
              Please fix the highlighted fields before generating a summary.
            </div>
          )}

          <div className="qg-form-grid">
            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-part">Part number<span className="req">*</span></label>
              <input
                id="ncr-part"
                maxLength={120}
                className={`qg-form-input ${errors.partNumber ? 'err' : ''}`}
                value={form.partNumber}
                onChange={(e) => updateField('partNumber', e.target.value)}
                placeholder="e.g. HSG-4471"
              />
              {errors.partNumber && <div className="qg-field-err">{errors.partNumber}</div>}
            </div>
            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-supplier">Supplier<span className="req">*</span></label>
              <input
                id="ncr-supplier"
                maxLength={160}
                className={`qg-form-input ${errors.supplier ? 'err' : ''}`}
                value={form.supplier}
                onChange={(e) => updateField('supplier', e.target.value)}
                placeholder="e.g. Internal — Plant 1, or supplier name"
              />
              {errors.supplier && <div className="qg-field-err">{errors.supplier}</div>}
            </div>

            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-qty">Affected quantity<span className="req">*</span></label>
              <input
                id="ncr-qty"
                className={`qg-form-input ${errors.affectedQuantity ? 'err' : ''}`}
                value={form.affectedQuantity}
                onChange={(e) => updateField('affectedQuantity', e.target.value)}
                placeholder="e.g. 340"
                inputMode="numeric"
              />
              {errors.affectedQuantity && <div className="qg-field-err">{errors.affectedQuantity}</div>}
            </div>
            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-severity">Severity<span className="req">*</span></label>
              <select
                id="ncr-severity"
                className={`qg-form-select ${errors.severity ? 'err' : ''}`}
                value={form.severity}
                onChange={(e) => updateField('severity', e.target.value)}
              >
                <option value="">Select severity…</option>
                {SEVERITY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.severity && <div className="qg-field-err">{errors.severity}</div>}
            </div>

            <div className="qg-form-field full">
              <label className="qg-form-label" htmlFor="ncr-issue">Issue description<span className="req">*</span></label>
              <textarea
                id="ncr-issue"
                maxLength={2000}
                className={`qg-form-textarea ${errors.issueDescription ? 'err' : ''}`}
                value={form.issueDescription}
                onChange={(e) => updateField('issueDescription', e.target.value)}
                placeholder="Describe what was found, where, and how… (2,000 chars max)"
              />
              {errors.issueDescription && <div className="qg-field-err">{errors.issueDescription}</div>}
            </div>

            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-stage">Detection stage<span className="req">*</span></label>
              <select
                id="ncr-stage"
                className={`qg-form-select ${errors.detectionStage ? 'err' : ''}`}
                value={form.detectionStage}
                onChange={(e) => updateField('detectionStage', e.target.value)}
              >
                <option value="">Select stage…</option>
                {DETECTION_STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.detectionStage && <div className="qg-field-err">{errors.detectionStage}</div>}
            </div>
            <div className="qg-form-field">
              <label className="qg-form-label" htmlFor="ncr-containment">Immediate containment action<span className="req">*</span></label>
              <input
                id="ncr-containment"
                maxLength={2000}
                className={`qg-form-input ${errors.containmentAction ? 'err' : ''}`}
                value={form.containmentAction}
                onChange={(e) => updateField('containmentAction', e.target.value)}
                placeholder="e.g. Lot quarantined pending disposition (2,000 chars max)"
              />
              {errors.containmentAction && <div className="qg-field-err">{errors.containmentAction}</div>}
            </div>
          </div>

          <button className="qg-generate-btn" onClick={handleGenerate}>
            <ListChecks size={15} /> Generate NCR summary
          </button>
        </div>

        <div>
          {!result ? (
            <div className="qg-ncr-empty">
              <PackageSearch size={20} style={{ marginBottom: 8 }} />
              <div>Your structured NCR summary will appear here once the form is complete.</div>
            </div>
          ) : (
            <div className="qg-panel">
              <div className="qg-review-banner">
                <ClipboardCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                Quality Manager review is required before this NCR can be dispositioned or closed. This output is a draft starting point only.
              </div>

              <div className="qg-out-section">
                <div className="qg-out-heading"><FileStack size={13} /> Summary</div>
                <div className="qg-out-text">{result.summary}</div>
              </div>

              <div className="qg-out-section">
                <div className="qg-out-heading"><ShieldCheck size={13} /> Containment steps</div>
                <ul className="qg-out-list">
                  {result.containmentSteps.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="qg-out-section">
                <div className="qg-out-heading"><Search size={13} /> Investigation areas</div>
                <ul className="qg-out-list">
                  {result.investigationAreas.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="qg-out-section">
                <div className="qg-out-heading"><ListChecks size={13} /> Suggested next actions</div>
                <ul className="qg-out-list">
                  {result.nextActions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="qg-out-section" style={{ marginBottom: 0 }}>
                <div className="qg-out-heading"><ClipboardList size={13} /> Citations</div>
                {result.citations.map((doc) => (
                  <div className="qg-cite-box" key={doc.id} style={{ marginBottom: 8 }}>
                    <div className="qg-cite-doc">
                      {doc.title}
                      <span className="qg-cite-rev">REV {doc.revision} · {doc.status.toUpperCase()} · {doc.department}</span>
                    </div>
                    <div className="qg-cite-excerpt">"{doc.fullText}"</div>
                  </div>
                ))}
              </div>

              <FeedbackWidget
                resultId={result.id}
                resultType="ncr"
                contextLabel={form.partNumber ? `Part ${form.partNumber}` : 'NCR summary'}
                entries={feedbackEntries}
                onSubmit={onSubmitFeedback}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                  */
/* ------------------------------------------------------------------ */

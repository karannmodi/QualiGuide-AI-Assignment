export function makeId() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const STOPWORDS = new Set([
  'the','a','an','is','are','of','for','to','what','how','do','i','does','my','on','in','with',
  'current','be','are','it','and','or','can','when','should','need','needs','me','this',
]);

export function scoreDocuments(text, documents) {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, '');
  const words = clean.split(/\s+/).filter((w) => w && !STOPWORDS.has(w));
  if (words.length === 0) return [];

  return documents
    .map((doc) => {
      const bodyText = (doc.title + ' ' + doc.fullText).toLowerCase();
      let score = 0;
      words.forEach((w) => {
        if (doc.tags.some((t) => t.toLowerCase().includes(w) || w.includes(t.toLowerCase()))) score += 3;
        else if (bodyText.includes(w)) score += 1;
      });
      return { doc, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function matchQuestion(question, documents) {
  const ranked = scoreDocuments(question, documents);
  const top = ranked[0];
  return top && top.score >= 3 ? top.doc : null;
}

/* ------------------------------------------------------------------ */
/* NCR summary generation (rule-based — built only from sample docs)   */
/* ------------------------------------------------------------------ */

export function generateNcrSummary(form, documents) {
  const byId = (id) => documents.find((d) => d.id === id);
  const baseDocs = [byId('doc_009'), byId('doc_006')].filter(Boolean);

  const topicText = `${form.issueDescription} ${form.containmentAction} ${form.partNumber}`;
  const ranked = scoreDocuments(topicText, documents).filter(
    (r) => r.score >= 3 && !baseDocs.some((b) => b.id === r.doc.id)
  );
  const topicDocs = ranked.slice(0, 2).map((r) => r.doc);
  const citations = [...baseDocs, ...topicDocs];

  const tagSet = new Set(topicDocs.flatMap((d) => d.tags));
  const isSupplierIssue = form.supplier && !/internal/i.test(form.supplier);

  const investigationAreas = [];
  if (tagSet.has('calibration') || /gauge|measur|dimension|tolerance/i.test(form.issueDescription)) {
    investigationAreas.push('Verify calibration status of the measurement equipment used to detect this issue, per the Calibration Control Procedure.');
  }
  if (tagSet.has('cnc') || tagSet.has('machining') || /tolerance|bore|machin/i.test(form.issueDescription)) {
    investigationAreas.push('Review tooling condition, program revision, and first-article inspection records for the affected work instruction.');
  }
  if (tagSet.has('esd') || /esd|static|electron/i.test(form.issueDescription)) {
    investigationAreas.push('Confirm ESD handling controls (grounded workstation, wrist strap, approved totes) were followed at the point of detection.');
  }
  if (isSupplierIssue || tagSet.has('supplier')) {
    investigationAreas.push(`Review ${form.supplier || 'the supplier'}'s incoming quality history and PPAP status per the Supplier Quality Requirements Manual.`);
  }
  if (form.severity === 'Critical') {
    investigationAreas.push('Escalate immediately given Critical severity — confirm no additional lots or downstream units are affected.');
  }
  if (investigationAreas.length === 0) {
    investigationAreas.push('Confirm whether this is a repeat nonconformance within the last 90 days, which changes root-cause requirements per the CAPA Procedure.');
  }

  const containmentSteps = [
    `Quarantine the affected quantity (${form.affectedQuantity || 'unspecified'} units) and tag as nonconforming per the Nonconforming Material Control Procedure.`,
    `Logged containment action: "${form.containmentAction}"`,
    isSupplierIssue
      ? `Notify ${form.supplier} that material is on hold pending disposition.`
      : 'Notify the responsible production area that the affected lot is on hold pending disposition.',
    'Confirm no additional lots from the same source or time window are at risk.',
  ];

  const nextActions = [
    'Assign a root-cause investigation owner and target completion date.',
    'Complete disposition (rework, scrap, use-as-is, or return-to-supplier) per the Nonconforming Material Control Procedure.',
    isSupplierIssue
      ? 'If confirmed supplier-caused, issue a supplier corrective action request — due within 10 business days per the Supplier Quality Requirements Manual.'
      : 'If confirmed process-caused, open an internal corrective action per the CAPA Procedure.',
    'Verify corrective action effectiveness within 60 days or at the next scheduled audit, per the CAPA Procedure.',
  ];

  const summary = `${form.severity || 'Unclassified'}-severity nonconformance on part ${form.partNumber || '(not specified)'}` +
    `${isSupplierIssue ? ` supplied by ${form.supplier}` : ''}, detected at ${form.detectionStage ? form.detectionStage.toLowerCase() : 'an unspecified stage'}. ` +
    `${form.affectedQuantity || 'An unspecified number of'} units are affected. Reported issue: ${form.issueDescription}`;

  return { summary, containmentSteps, investigationAreas, nextActions, citations };
}

/* ------------------------------------------------------------------ */
/* Role Selector (simulated login)                                     */
/* ------------------------------------------------------------------ */

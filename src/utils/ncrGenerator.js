import { scoreDocuments } from './documentScoring.js';

export function generateNcrSummary(form, documents) {
  const byId = (id) => documents.find((d) => d.id === id);
  const baseDocs = [byId('doc_009'), byId('doc_006')].filter(Boolean);

  const topicText = `${form.issueDescription} ${form.containmentAction} ${form.partNumber}`;
  const ranked = scoreDocuments(topicText, documents).filter(
    (r) => r.score >= 3 && !baseDocs.some((b) => b.id === r.doc.id),
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

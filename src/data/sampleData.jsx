import { ShieldCheck, Factory, Boxes, HardHat, ThumbsUp, ThumbsDown, CircleAlert, History } from 'lucide-react';

export const PERSONAS = [
  {
    id: 'quality_manager',
    label: 'Maria — Quality Manager',
    icon: ShieldCheck,
    need: 'Keep procedures accurate and audit-ready',
    dept: 'Quality',
  },
  {
    id: 'supervisor',
    label: 'James — Production Supervisor',
    icon: Factory,
    need: 'Get answers during production without stopping the line',
    dept: 'Production',
  },
  {
    id: 'supplier_engineer',
    label: 'Anika — Supplier Quality Engineer',
    icon: Boxes,
    need: 'Review defects and start corrective actions',
    dept: 'Supply Chain',
  },
  {
    id: 'operator',
    label: 'Carlos — Operator / Inspector',
    icon: HardHat,
    need: 'Follow the correct, current work instruction',
    dept: 'Production',
  },
];

export const DOCUMENTS = [
  {
    id: 'doc_001', title: 'Incoming Inspection Procedure', revision: 'C', department: 'Quality', site: 'Plant 1',
    status: 'current', tags: ['incoming', 'inspection', 'receiving', 'sampling', 'ansi'],
    fullText: 'All incoming lots must be sampled per ANSI Z1.4 general inspection level II. Lots failing acceptance sampling are quarantined and logged in the nonconforming material register.',
  },
  {
    id: 'doc_002', title: 'Calibration Control Procedure', revision: 'D', department: 'Quality', site: 'Plant 1',
    status: 'current', tags: ['calibration', 'gauge', 'measurement', 'equipment'],
    fullText: 'All measurement and test equipment is calibrated on a 12-month cycle against NIST-traceable standards. Out-of-tolerance gauges trigger a review of parts measured since the last calibration.',
  },
  {
    id: 'doc_003', title: 'CNC Machining Work Instruction — Housing 4471', revision: 'F', department: 'Production', site: 'Plant 1',
    status: 'current', tags: ['cnc', 'machining', 'housing', 'tolerance', 'work instruction'],
    fullText: 'Housing 4471 critical dimensions hold +/-0.05mm tolerance on the mounting bore. First-article inspection is required after any tooling change or program edit.',
  },
  {
    id: 'doc_004', title: 'Electrostatic Discharge (ESD) Handling Procedure', revision: 'B', department: 'Production', site: 'Plant 2',
    status: 'current', tags: ['esd', 'static', 'electronics', 'handling', 'ppe'],
    fullText: 'ESD-sensitive assemblies must be handled only at grounded workstations with wrist straps in place. Ungrounded plastic totes are not approved for staging ESD-sensitive parts.',
  },
  {
    id: 'doc_005', title: 'Supplier Quality Requirements Manual', revision: 'E', department: 'Supply Chain', site: 'Corporate',
    status: 'current', tags: ['supplier', 'requirements', 'ppap', 'approval', 'incoming'],
    fullText: 'New suppliers must submit a PPAP Level 3 package before first production shipment. Supplier corrective actions are due within 10 business days of an NCR notification.',
  },
  {
    id: 'doc_006', title: 'Corrective Action Procedure (CAPA)', revision: 'G', department: 'Quality', site: 'Corporate',
    status: 'current', tags: ['corrective action', 'capa', 'root cause', 'nonconformance'],
    fullText: 'Root cause analysis is required for any repeat nonconformance within a 90-day window. Corrective action effectiveness is verified at the next scheduled audit or within 60 days, whichever is sooner.',
  },
  {
    id: 'doc_007', title: 'Final Inspection Checklist — Assembly Line 2', revision: 'A', department: 'Quality', site: 'Plant 2',
    status: 'current', tags: ['final inspection', 'checklist', 'assembly'],
    fullText: 'Final inspection on Line 2 confirms torque values, label placement, and functional test pass before units are released to packaging.',
  },
  {
    id: 'doc_008', title: 'Packaging and Labeling Specification', revision: 'C', department: 'Packaging', site: 'Plant 1',
    status: 'archived', tags: ['packaging', 'labeling', 'shipping'],
    fullText: 'Superseded by Rev D, which updates the shipping label barcode format. This revision should no longer be used for production shipments.',
  },
  {
    id: 'doc_009', title: 'Nonconforming Material Control Procedure', revision: 'D', department: 'Quality', site: 'Corporate',
    status: 'current', tags: ['nonconforming', 'ncr', 'quarantine', 'disposition'],
    fullText: 'Nonconforming material is tagged, quarantined within 4 hours of detection, and dispositioned as rework, scrap, use-as-is, or return-to-supplier.',
  },
  {
    id: 'doc_010', title: 'Operator Training and Qualification Policy', revision: 'B', department: 'Quality', site: 'Corporate',
    status: 'current', tags: ['training', 'qualification', 'operator', 'certification'],
    fullText: 'Operators must be re-qualified annually on any work instruction with a critical dimension. Training records are retained for the life of the part plus three years.',
  },
];

export const SUGGESTED_QUESTIONS = [
  'What is the current revision for the incoming inspection procedure?',
  'What PPE is required for ESD-sensitive parts?',
  'How long do supplier corrective actions have before they are due?',
  'How do I submit a purchase order in the ERP system?',
];

export const SEVERITY_OPTIONS = ['Minor', 'Major', 'Critical'];

export const DETECTION_STAGE_OPTIONS = [
  'Incoming inspection', 'In-process', 'Final inspection', 'Customer return', 'Internal audit',
];

export const SAMPLE_NCRS = [
  {
    id: 'ncr_ex_01',
    label: 'NCR-014 — Bore diameter out of tolerance',
    partNumber: 'HSG-4471',
    supplier: 'Internal — Plant 1 Machining',
    issueDescription: 'Mounting bore on housing measured 0.11mm over the drawing tolerance on a sample of parts from the same production lot.',
    affectedQuantity: '340',
    severity: 'Major',
    detectionStage: 'In-process',
    containmentAction: 'Line stopped; lot quarantined in the hold cage pending 100% re-inspection.',
  },
  {
    id: 'ncr_ex_02',
    label: 'NCR-021 — Incoming connector plating defect',
    partNumber: 'CN-2208',
    supplier: 'Meridian Electronics Supply',
    issueDescription: 'Incoming connectors show inconsistent gold plating thickness, some pins below spec, discovered during incoming sampling.',
    affectedQuantity: '1200',
    severity: 'Major',
    detectionStage: 'Incoming inspection',
    containmentAction: 'Full incoming lot placed on hold; not released to production.',
  },
  {
    id: 'ncr_ex_03',
    label: 'NCR-027 — ESD-sensitive board handled ungrounded',
    partNumber: 'PCB-9903',
    supplier: 'Internal — Plant 2 Assembly',
    issueDescription: 'Operator staged ESD-sensitive boards in an ungrounded plastic tote instead of the approved ESD tote during a shift changeover.',
    affectedQuantity: '58',
    severity: 'Critical',
    detectionStage: 'Internal audit',
    containmentAction: 'Affected boards segregated for functional retest; workstation grounding re-verified.',
  },
];

export const EMPTY_NCR_FORM = {
  partNumber: '', supplier: '', issueDescription: '', affectedQuantity: '',
  severity: '', detectionStage: '', containmentAction: '',
};

export const FEEDBACK_OPTIONS = [
  { id: 'helpful', label: 'Helpful', icon: ThumbsUp },
  { id: 'wrong', label: 'Wrong', icon: ThumbsDown },
  { id: 'incomplete', label: 'Incomplete', icon: CircleAlert },
  { id: 'outdated', label: 'Outdated', icon: History },
];

export const EMPTY_UPLOAD_FORM = {
  title: '', documentNumber: '', revision: '', department: '', site: '', status: 'current', tags: '', excerpt: '',
};

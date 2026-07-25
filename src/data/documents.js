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

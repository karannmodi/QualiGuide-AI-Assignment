export function validateNcrForm(form) {
  const errs = {};
  if (!form.partNumber.trim()) errs.partNumber = 'Part number is required.';
  if (!form.supplier.trim()) errs.supplier = 'Supplier (or "Internal") is required.';
  if (!form.issueDescription.trim()) errs.issueDescription = 'Issue description is required.';
  if (!form.severity) errs.severity = 'Select a severity.';
  if (!form.detectionStage) errs.detectionStage = 'Select a detection stage.';
  if (!form.containmentAction.trim()) errs.containmentAction = 'Immediate containment action is required.';

  const qty = form.affectedQuantity.trim();
  if (!qty) {
    errs.affectedQuantity = 'Affected quantity is required.';
  } else if (!/^\d+$/.test(qty) || parseInt(qty, 10) <= 0) {
    errs.affectedQuantity = 'Enter a whole number greater than 0.';
  }
  return errs;
}

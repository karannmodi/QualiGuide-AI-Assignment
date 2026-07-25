export function validateUploadForm(form) {
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

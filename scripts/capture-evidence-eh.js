import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function captureEvidence() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: 'http://localhost:5175' });
  const page = await context.newPage();

  const evidenceDir = path.join(process.cwd(), 'docs', 'testing-evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  console.log('Capturing evidence screenshots for Sections E through H...');

  // 1. Upload modal opened
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.click('button:has-text("Maria — Quality Manager")');
  await page.click('button.qg-nav-item:has-text("Document Library")');
  await page.click('button:has-text("Add document")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-E_upload_modal_opened.png'), fullPage: true });

  // 2. Blank upload validation
  await page.click('button:has-text("Add to library")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-E_blank_upload_validation.png'), fullPage: true });

  // 3. Successful simulated document addition
  await page.fill('#up-title', 'Torque Wrench Calibration WI');
  await page.fill('#up-docnum', 'WI-8821');
  await page.fill('#up-revision', 'A');
  await page.fill('#up-department', 'Quality');
  await page.fill('#up-site', 'Plant 1');
  await page.selectOption('#up-status', 'current');
  await page.fill('#up-tags', 'torque, gauge, assembly');
  await page.fill('#up-excerpt', 'Torque wrenches must be verified daily on digital analyzer.');
  await page.click('button:has-text("Add to library")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-E_successful_document_addition.png'), fullPage: true });
  await page.click('button:has-text("Done")');

  // 4. Supported Q&A response with citation
  await page.click('button.qg-nav-item:has-text("Ask a Question")');
  await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');
  await page.waitForSelector('.qg-stamp-card');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-F_supported_qa_citation.png'), fullPage: true });

  // 5. Unsupported-question refusal
  await page.click('button.qg-chip:has-text("How do I submit a purchase order in the ERP system?")');
  await page.waitForSelector('.qg-refusal-card');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-F_unsupported_question_refusal.png'), fullPage: true });

  // 6. Empty NCR form validation
  await page.click('button.qg-nav-item:has-text("NCR Assistant")');
  await page.click('button:has-text("Generate NCR summary")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-G_empty_ncr_form_validation.png'), fullPage: true });

  // 7. Successful NCR summary generation (Internal Major)
  await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
  await page.click('button:has-text("Generate NCR summary")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-G_successful_ncr_summary.png'), fullPage: true });

  // 8. Critical-severity NCR behavior
  await page.click('button:has-text("NCR-027 — ESD-sensitive board handled ungrounded")');
  await page.click('button:has-text("Generate NCR summary")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-G_critical_severity_ncr.png'), fullPage: true });

  // 9. Feedback rating selected
  await page.click('button.qg-nav-item:has-text("Ask a Question")');
  await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');
  await page.waitForSelector('.qg-stamp-card');
  const helpfulBtn = page.locator('button.qg-feedback-btn:has-text("Helpful")').first();
  await helpfulBtn.click();
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-H_feedback_rating_selected.png'), fullPage: true });

  // 10. Feedback successfully submitted
  await page.fill('textarea.qg-feedback-comment', 'Clear and accurate answer.');
  await page.click('button.qg-feedback-submit');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-H_feedback_submitted.png'), fullPage: true });

  await browser.close();
  console.log('All evidence screenshots captured successfully.');
}

captureEvidence();

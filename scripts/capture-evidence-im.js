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

  console.log('Capturing evidence screenshots for Sections I through M...');

  // 1. Quality Manager feedback review queue
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.click('button:has-text("Maria — Quality Manager")');
  await page.click('button.qg-nav-item:has-text("Ask a Question")');
  await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');
  await page.click('button.qg-feedback-btn:has-text("Helpful")');
  await page.fill('textarea.qg-feedback-comment', 'Accurate ESD PPE guidance.');
  await page.click('button.qg-feedback-submit');
  await page.click('button.qg-nav-item:has-text("Feedback & Review")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-I_qm_feedback_review_queue.png'), fullPage: true });

  // 2. Empty feedback queue
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.click('button:has-text("Maria — Quality Manager")');
  await page.click('button.qg-nav-item:has-text("Feedback & Review")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-I_empty_feedback_queue.png'), fullPage: true });

  // 3. HTML/script payload displayed safely
  await page.click('button.qg-nav-item:has-text("Ask a Question")');
  await page.fill('input[aria-label="Type your question"]', "<script>alert('xss')</script>");
  await page.click('button.qg-ask-btn');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-J_script_payload_safe_rendering.png'), fullPage: true });

  // 4. Long-input rendering
  await page.click('button.qg-nav-item:has-text("NCR Assistant")');
  await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
  await page.fill('#ncr-issue', 'A'.repeat(5000));
  await page.click('button:has-text("Generate NCR summary")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-J_long_input_rendering.png'), fullPage: true });

  // 5. Corrupted localStorage fallback
  await page.evaluate(() => window.localStorage.setItem('qualiguide.documents', 'INVALID_JSON{'));
  await page.reload();
  await page.click('button.qg-nav-item:has-text("Document Library")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-K_corrupted_storage_fallback.png'), fullPage: true });
  await page.evaluate(() => window.localStorage.clear());

  // 6. Visible keyboard focus
  await page.goto('/');
  await page.click('button:has-text("Maria — Quality Manager")');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-L_visible_keyboard_focus.png'), fullPage: true });

  // 7. Upload modal keyboard/focus behavior
  await page.click('button.qg-nav-item:has-text("Document Library")');
  await page.click('button:has-text("Add document")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-L_upload_modal_keyboard_behavior.png'), fullPage: true });
  await page.keyboard.press('Escape');

  // 8. 375-pixel mobile layout
  await page.setViewportSize({ width: 375, height: 667 });
  await page.click('button.qg-nav-item:has-text("Dashboard")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-M_375px_mobile_layout.png'), fullPage: true });

  // 9. Tablet layout
  await page.setViewportSize({ width: 800, height: 1024 });
  await page.click('button.qg-nav-item:has-text("NCR Assistant")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-M_tablet_layout.png'), fullPage: true });

  // 10. Offline application behavior
  await context.setOffline(true);
  await page.click('button.qg-nav-item:has-text("Ask a Question")');
  await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-M_offline_application_behavior.png'), fullPage: true });

  await context.setOffline(false);
  await browser.close();
  console.log('All evidence screenshots for Sections I-M captured successfully.');
}

captureEvidence();

import { chromium } from '@playwright/test';
import path from 'path';

async function updateModalFocusEvidence() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: 'http://localhost:5175' });
  const page = await context.newPage();

  const evidenceDir = path.join(process.cwd(), 'docs', 'testing-evidence');

  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await page.click('button:has-text("Maria — Quality Manager")');
  await page.click('button.qg-nav-item:has-text("Document Library")');
  await page.click('button:has-text("Add document")');

  // Wait for initial focus to be inside #up-title
  await page.waitForFunction(() => document.activeElement?.id === 'up-title');

  await page.screenshot({
    path: path.join(evidenceDir, 'SECTION-L_upload_modal_keyboard_behavior.png'),
    fullPage: true
  });

  await browser.close();
  console.log('Updated SECTION-L_upload_modal_keyboard_behavior.png with focused title input.');
}

updateModalFocusEvidence();

import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function captureSecRecEvidence() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: 'http://localhost:5175' });
  const page = await context.newPage();

  const evidenceDir = path.join(process.cwd(), 'docs', 'testing-evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  console.log('Capturing evidence screenshots for SEC-REC-001 and SEC-REC-002...');

  // 1. Input-length validation (SEC-REC-001)
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await page.click('button:has-text("Maria — Quality Manager")');
  await page.click('button.qg-nav-item:has-text("Ask a Question")');

  // Fill input with long text (500 chars limit) to demonstrate maxLength capping & full input box
  const askInput = page.locator('input[aria-label="Type your question"]');
  await askInput.fill('What PPE is required for ESD-sensitive parts? ' + 'A'.repeat(460));

  await page.screenshot({
    path: path.join(evidenceDir, 'SEC-REC-001_input_length_validation.png'),
    fullPage: true
  });
  console.log('Captured SEC-REC-001_input_length_validation.png');

  // 2. Browser-storage warning (SEC-REC-002)
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await page.click('button:has-text("Maria — Quality Manager")');

  // Override localStorage setItem to throw storage error
  await page.evaluate(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => null,
        setItem: () => { throw new Error('Storage disabled or full'); },
        removeItem: () => {},
        clear: () => {}
      },
      writable: true
    });
  });

  // Trigger state change that attempts to persist data to localStorage
  await page.click('button.qg-nav-item:has-text("Document Library")');

  // Wait for storage warning banner to be visible
  await page.waitForSelector('.qg-storage-warning-banner');

  await page.screenshot({
    path: path.join(evidenceDir, 'SEC-REC-002_storage_persistence_warning.png'),
    fullPage: true
  });
  console.log('Captured SEC-REC-002_storage_persistence_warning.png');

  await browser.close();
  console.log('All additional security evidence screenshots captured successfully.');
}

captureSecRecEvidence();

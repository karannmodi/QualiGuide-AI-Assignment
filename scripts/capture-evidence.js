import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function captureEvidence() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const evidenceDir = path.join(process.cwd(), 'docs', 'testing-evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  // 1. Role Selection (Section A)
  await page.goto('http://localhost:5175');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-A_role_selector.png') });

  // 2. Dashboard View (Section C & BUG-001)
  await page.click('button:has-text("Maria — Quality Manager")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-C_dashboard_view_BUG-001.png') });

  // 3. Navigation & Shell Controls (Section B)
  await page.click('button.qg-nav-item:has-text("Document Library")');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-B_document_library_navigation.png') });

  // 4. Document Library & Filters (Section D)
  const searchInput = page.locator('input[aria-label="Search documents by title or tag"]');
  await searchInput.fill('Calibration');
  await page.screenshot({ path: path.join(evidenceDir, 'SECTION-D_document_search_calibration.png') });

  await browser.close();
  console.log('Evidence screenshots captured successfully in docs/testing-evidence/');
}

captureEvidence().catch(console.error);

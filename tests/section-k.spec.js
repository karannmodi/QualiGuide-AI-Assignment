import { test, expect } from '@playwright/test';

test.describe('Section K: Workflow Edge Cases, Rapid Interaction, & State Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-EDGE-001: Rapid double/triple click submit buttons', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');

    const generateBtn = page.locator('button:has-text("Generate NCR summary")');
    await generateBtn.click({ clickCount: 3 });

    await expect(page.locator('.qg-review-banner')).toHaveCount(1);
  });

  test('TC-EDGE-002: Click preset example chips in rapid succession', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');

    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.click('button:has-text("NCR-021 — Incoming connector plating defect")');
    await page.click('button:has-text("NCR-027 — ESD-sensitive board handled ungrounded")');

    await expect(page.locator('#ncr-part')).toHaveValue('PCB-9903');
    await expect(page.locator('#ncr-supplier')).toHaveValue('Internal — Plant 2 Assembly');
    await expect(page.locator('#ncr-qty')).toHaveValue('58');
    await expect(page.locator('#ncr-severity')).toHaveValue('Critical');
  });

  test('TC-EDGE-003: Refresh page during active Q&A session', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
    await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');

    await expect(page.locator('.qg-stamp-card')).toBeVisible();

    await page.reload();

    await expect(page.locator('.qg-page-title')).toHaveText('Ask a Question');
    await expect(page.locator('.qg-role-chip')).toContainText('Maria');
    await expect(page.locator('.qg-stamp-card')).toHaveCount(0); // Transient Q&A thread resets to empty
  });

  test('TC-EDGE-004: Corrupt localStorage values with malformed JSON', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.evaluate(() => window.localStorage.setItem('qualiguide.documents', 'INVALID_JSON{'));
    await page.reload();

    // Application should not crash, falls back to default 10 DOCUMENTS
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await expect(page.locator('.qg-doc-card')).toHaveCount(10);

    // Clean storage after test
    await page.evaluate(() => window.localStorage.clear());
  });
});

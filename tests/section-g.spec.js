import { test, expect } from '@playwright/test';

test.describe('Section G: Nonconformance Report (NCR) Assistant & Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');
  });

  test('TC-NCR-001: Load NCR Example 1 (Bore diameter)', async ({ page }) => {
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');

    await expect(page.locator('#ncr-part')).toHaveValue('HSG-4471');
    await expect(page.locator('#ncr-supplier')).toHaveValue('Internal — Plant 1 Machining');
    await expect(page.locator('#ncr-qty')).toHaveValue('340');
    await expect(page.locator('#ncr-severity')).toHaveValue('Major');
    await expect(page.locator('#ncr-stage')).toHaveValue('In-process');
  });

  test('TC-NCR-002: Load NCR Example 2 (Connector plating)', async ({ page }) => {
    await page.click('button:has-text("NCR-021 — Incoming connector plating defect")');

    await expect(page.locator('#ncr-part')).toHaveValue('CN-2208');
    await expect(page.locator('#ncr-supplier')).toHaveValue('Meridian Electronics Supply');
    await expect(page.locator('#ncr-qty')).toHaveValue('1200');
    await expect(page.locator('#ncr-severity')).toHaveValue('Major');
    await expect(page.locator('#ncr-stage')).toHaveValue('Incoming inspection');
  });

  test('TC-NCR-003: Load NCR Example 3 (ESD Board)', async ({ page }) => {
    await page.click('button:has-text("NCR-027 — ESD-sensitive board handled ungrounded")');

    await expect(page.locator('#ncr-part')).toHaveValue('PCB-9903');
    await expect(page.locator('#ncr-supplier')).toHaveValue('Internal — Plant 2 Assembly');
    await expect(page.locator('#ncr-qty')).toHaveValue('58');
    await expect(page.locator('#ncr-severity')).toHaveValue('Critical');
    await expect(page.locator('#ncr-stage')).toHaveValue('Internal audit');
  });

  test('TC-NCR-004: Click "Generate NCR summary" on blank form', async ({ page }) => {
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('.qg-form-err-banner')).toHaveText('Please fix the highlighted fields before generating a summary.');
    await expect(page.locator('#ncr-part')).toHaveClass(/err/);
    await expect(page.locator('#ncr-supplier')).toHaveClass(/err/);
    await expect(page.locator('#ncr-qty')).toHaveClass(/err/);
    await expect(page.locator('#ncr-severity')).toHaveClass(/err/);
    await expect(page.locator('#ncr-issue')).toHaveClass(/err/);
    await expect(page.locator('#ncr-stage')).toHaveClass(/err/);
    await expect(page.locator('#ncr-containment')).toHaveClass(/err/);
    await expect(page.locator('.qg-review-banner')).toHaveCount(0);
  });

  test('TC-NCR-005: Enter text string in Affected Quantity field', async ({ page }) => {
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.fill('#ncr-qty', 'abc');
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('#ncr-qty')).toHaveClass(/err/);
    await expect(page.locator('.qg-field-err', { hasText: 'Enter a whole number greater than 0.' })).toBeVisible();
    await expect(page.locator('.qg-review-banner')).toHaveCount(0);
  });

  test('TC-NCR-006: Enter 0 in Affected Quantity field', async ({ page }) => {
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.fill('#ncr-qty', '0');
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('#ncr-qty')).toHaveClass(/err/);
    await expect(page.locator('.qg-field-err', { hasText: 'Enter a whole number greater than 0.' })).toBeVisible();
  });

  test('TC-NCR-007: Enter -50 in Affected Quantity field', async ({ page }) => {
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.fill('#ncr-qty', '-50');
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('#ncr-qty')).toHaveClass(/err/);
    await expect(page.locator('.qg-field-err', { hasText: 'Enter a whole number greater than 0.' })).toBeVisible();
  });

  test('TC-NCR-008: Enter 10.5 in Affected Quantity field', async ({ page }) => {
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.fill('#ncr-qty', '10.5');
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('#ncr-qty')).toHaveClass(/err/);
    await expect(page.locator('.qg-field-err', { hasText: 'Enter a whole number greater than 0.' })).toBeVisible();
  });

  test('TC-NCR-009: Generate summary for internal CNC issue', async ({ page }) => {
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('.qg-review-banner')).toContainText('Quality Manager review is required');
    await expect(page.locator('.qg-out-text')).toContainText('Major-severity nonconformance on part HSG-4471');

    const containmentList = page.locator('.qg-out-section').nth(1);
    await expect(containmentList).toContainText('Quarantine the affected quantity (340 units)');

    const citations = page.locator('.qg-cite-box');
    await expect(citations.first()).toBeVisible();
    await expect(citations).toHaveCount(4);
  });

  test('TC-NCR-010: Generate summary for external supplier issue', async ({ page }) => {
    await page.click('button:has-text("NCR-021 — Incoming connector plating defect")');
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('.qg-review-banner')).toBeVisible();
    await expect(page.locator('.qg-out-text')).toContainText('supplied by Meridian Electronics Supply');
    await expect(page.locator('.qg-out-section', { hasText: 'Containment steps' })).toContainText('Notify Meridian Electronics Supply');
    await expect(page.locator('.qg-out-section', { hasText: 'Suggested next actions' })).toContainText('10 business days');
  });

  test('TC-NCR-011: Generate summary for Critical severity NCR', async ({ page }) => {
    await page.click('button:has-text("NCR-027 — ESD-sensitive board handled ungrounded")');
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('.qg-review-banner')).toBeVisible();
    await expect(page.locator('.qg-out-text')).toContainText('Critical-severity nonconformance');
    await expect(page.locator('.qg-out-section', { hasText: 'Investigation areas' })).toContainText('Escalate immediately given Critical severity');
  });
});

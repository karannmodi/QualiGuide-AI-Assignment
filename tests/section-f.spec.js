import { test, expect } from '@playwright/test';

test.describe('Section F: Q&A Workflow & Question Matching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
  });

  test('TC-QA-001: Verify button disabled when input is empty', async ({ page }) => {
    const askBtn = page.locator('button.qg-ask-btn');
    await expect(askBtn).toBeDisabled();

    const askInput = page.locator('input[aria-label="Type your question"]');
    await askInput.fill('   ');
    await expect(askBtn).toBeDisabled();
  });

  test('TC-QA-002: Click suggested question chip for revision', async ({ page }) => {
    await page.click('button.qg-chip:has-text("What is the current revision for the incoming inspection procedure?")');

    const card = page.locator('.qg-stamp-card').first();
    await expect(card).toBeVisible();
    await expect(card.locator('.qg-stamp-seal')).toHaveText('Supported answer');
    await expect(card.locator('.qg-cite-doc')).toContainText('Incoming Inspection Procedure');
    await expect(card.locator('.qg-cite-rev')).toContainText('REV C');
  });

  test('TC-QA-003: Click suggested question chip for ESD PPE', async ({ page }) => {
    await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');

    const card = page.locator('.qg-stamp-card').first();
    await expect(card).toBeVisible();
    await expect(card.locator('.qg-cite-doc')).toContainText('Electrostatic Discharge (ESD) Handling Procedure');
    await expect(card.locator('.qg-stamp-answer')).toContainText('wrist straps in place');
  });

  test('TC-QA-004: Click suggested question chip for Supplier CAPA', async ({ page }) => {
    await page.click('button.qg-chip:has-text("How long do supplier corrective actions have before they are due?")');

    const card = page.locator('.qg-stamp-card').first();
    await expect(card).toBeVisible();
    await expect(card.locator('.qg-cite-doc')).toContainText('Supplier Quality Requirements Manual');
    await expect(card.locator('.qg-stamp-answer')).toContainText('10 business days');
  });

  test('TC-QA-005: Click suggested question chip with no matching doc (Refusal)', async ({ page }) => {
    await page.click('button.qg-chip:has-text("How do I submit a purchase order in the ERP system?")');

    const refusal = page.locator('.qg-refusal-card').first();
    await expect(refusal).toBeVisible();
    await expect(refusal.locator('.qg-refusal-head')).toContainText('No approved source found');
    await expect(refusal.locator('.qg-refusal-text')).toContainText('refusing to answer');
  });

  test('TC-QA-006: Type custom question matching document tags', async ({ page }) => {
    const askInput = page.locator('input[aria-label="Type your question"]');
    await askInput.fill('What is the calibration cycle for gauges?');
    await page.click('button.qg-ask-btn');

    const card = page.locator('.qg-stamp-card').first();
    await expect(card).toBeVisible();
    await expect(card.locator('.qg-cite-doc')).toContainText('Calibration Control Procedure');
  });

  test('TC-QA-007: Type question containing only stop words or unmatched terms', async ({ page }) => {
    const askInput = page.locator('input[aria-label="Type your question"]');
    await askInput.fill('What is the best way for me to do this on my own?');
    await page.click('button.qg-ask-btn');

    const refusal = page.locator('.qg-refusal-card').first();
    await expect(refusal).toBeVisible();
    await expect(refusal.locator('.qg-refusal-head')).toContainText('No approved source found');
  });

  test('TC-QA-008: Ask question matching newly uploaded document', async ({ page }) => {
    // 1. Upload new document
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await page.click('button:has-text("Add document")');
    await page.fill('#up-title', 'Custom Torque Spec');
    await page.fill('#up-docnum', 'SPEC-777');
    await page.fill('#up-revision', 'A');
    await page.fill('#up-department', 'Quality');
    await page.fill('#up-site', 'Plant 1');
    await page.fill('#up-tags', 'torque, digital');
    await page.fill('#up-excerpt', 'Digital torque wrenches must be calibrated bi-weekly.');
    await page.click('button:has-text("Add to library")');
    await page.click('button:has-text("Done")');

    // 2. Go to Q&A and ask question
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
    const askInput = page.locator('input[aria-label="Type your question"]');
    await askInput.fill('How often are digital torque wrenches calibrated?');
    await page.click('button.qg-ask-btn');

    const card = page.locator('.qg-stamp-card').first();
    await expect(card).toBeVisible();
    await expect(card.locator('.qg-cite-doc')).toContainText('Custom Torque Spec');
  });

  test('TC-QA-009: Verify question thread order and cumulative items', async ({ page }) => {
    const askInput = page.locator('input[aria-label="Type your question"]');

    await askInput.fill('What is the calibration cycle for gauges?');
    await page.click('button.qg-ask-btn');

    await askInput.fill('What PPE is required for ESD-sensitive parts?');
    await page.click('button.qg-ask-btn');

    const bubbles = page.locator('.qg-q-bubble');
    await expect(bubbles).toHaveCount(2);

    // Newest question should be at the top
    await expect(bubbles.nth(0)).toContainText('What PPE is required for ESD-sensitive parts?');
    await expect(bubbles.nth(1)).toContainText('What is the calibration cycle for gauges?');
  });
});

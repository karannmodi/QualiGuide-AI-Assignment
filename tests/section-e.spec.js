import { test, expect } from '@playwright/test';

test.describe('Section E: Simulated Document Upload Modal (Quality Manager Only)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-UPL-001: Verify button hidden for non-QM roles', async ({ page }) => {
    await page.click('button:has-text("Carlos — Operator / Inspector")');
    await page.click('button.qg-nav-item:has-text("Document Library")');

    await expect(page.locator('button:has-text("Add document")')).toHaveCount(0);
    await expect(page.locator('.qg-page-sub')).toContainText('Uploading is available to the Quality Manager role.');
  });

  test('TC-UPL-002: Open upload modal as Quality Manager', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');

    await page.click('button:has-text("Add document")');

    await expect(page.locator('.qg-modal-overlay')).toBeVisible();
    await expect(page.locator('#qg-upload-modal-title')).toHaveText('Add a simulated document');
    await expect(page.locator('.qg-modal-sub')).toContainText('No file is processed — this creates a simulated record');
  });

  test('TC-UPL-003: Close modal without saving using Close button and backdrop', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');

    // Test Close button ('X')
    await page.click('button:has-text("Add document")');
    await expect(page.locator('.qg-modal-overlay')).toBeVisible();
    await page.click('button[aria-label="Close dialog"]');
    await expect(page.locator('.qg-modal-overlay')).toHaveCount(0);

    // Test backdrop click
    await page.click('button:has-text("Add document")');
    await expect(page.locator('.qg-modal-overlay')).toBeVisible();
    await page.locator('.qg-modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('.qg-modal-overlay')).toHaveCount(0);
  });

  test('TC-UPL-004: Close modal using Escape key shortcut', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');

    await page.click('button:has-text("Add document")');
    await expect(page.locator('.qg-modal-overlay')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.qg-modal-overlay')).toHaveCount(0);
  });

  test('TC-UPL-005: Attempt submission with all fields empty', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await page.click('button:has-text("Add document")');

    await page.click('button:has-text("Add to library")');

    await expect(page.locator('.qg-form-err-banner')).toHaveText('Please fix the highlighted fields before adding this document.');
    await expect(page.locator('#up-title')).toHaveClass(/err/);
    await expect(page.locator('#up-docnum')).toHaveClass(/err/);
    await expect(page.locator('#up-revision')).toHaveClass(/err/);
    await expect(page.locator('#up-department')).toHaveClass(/err/);
    await expect(page.locator('#up-site')).toHaveClass(/err/);
    await expect(page.locator('#up-tags')).toHaveClass(/err/);
    await expect(page.locator('#up-excerpt')).toHaveClass(/err/);
  });

  test('TC-UPL-006: Fill fields with whitespace only', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await page.click('button:has-text("Add document")');

    await page.fill('#up-title', '   ');
    await page.fill('#up-docnum', '   ');
    await page.fill('#up-revision', '   ');
    await page.fill('#up-department', '   ');
    await page.fill('#up-site', '   ');
    await page.fill('#up-tags', '   ');
    await page.fill('#up-excerpt', '   ');

    await page.click('button:has-text("Add to library")');

    await expect(page.locator('.qg-form-err-banner')).toHaveText('Please fix the highlighted fields before adding this document.');
  });

  test('TC-UPL-007: Submit valid new document', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await page.click('button:has-text("Add document")');

    await page.fill('#up-title', 'Torque Wrench Calibration WI');
    await page.fill('#up-docnum', 'WI-8821');
    await page.fill('#up-revision', 'A');
    await page.fill('#up-department', 'Quality');
    await page.fill('#up-site', 'Plant 1');
    await page.selectOption('#up-status', 'current');
    await page.fill('#up-tags', 'torque, gauge, assembly');
    await page.fill('#up-excerpt', 'Torque wrenches must be verified daily on digital analyzer.');

    await page.click('button:has-text("Add to library")');

    await expect(page.locator('.qg-success-note')).toBeVisible();
    await expect(page.locator('.qg-success-note')).toContainText('"Torque Wrench Calibration WI" was added to the simulated library');
    await expect(page.locator('button:has-text("Add another")')).toBeVisible();
    await expect(page.locator('button:has-text("Done")')).toBeVisible();
  });

  test('TC-UPL-008: Reset modal state to add second document via "Add another"', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await page.click('button:has-text("Add document")');

    await page.fill('#up-title', 'Doc One');
    await page.fill('#up-docnum', 'WI-001');
    await page.fill('#up-revision', 'A');
    await page.fill('#up-department', 'Quality');
    await page.fill('#up-site', 'Plant 1');
    await page.fill('#up-tags', 'tag1');
    await page.fill('#up-excerpt', 'Excerpt one');

    await page.click('button:has-text("Add to library")');
    await expect(page.locator('.qg-success-note')).toBeVisible();

    await page.click('button:has-text("Add another")');

    await expect(page.locator('.qg-success-note')).toHaveCount(0);
    await expect(page.locator('#up-title')).toHaveValue('');
    await expect(page.locator('#up-docnum')).toHaveValue('');
  });

  test('TC-UPL-009: Verify uploaded document appears in library and persists across reload', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await page.click('button:has-text("Add document")');

    await page.fill('#up-title', 'Persisted Torque Document');
    await page.fill('#up-docnum', 'WI-999');
    await page.fill('#up-revision', 'B');
    await page.fill('#up-department', 'Quality');
    await page.fill('#up-site', 'Plant 1');
    await page.fill('#up-tags', 'persisted, torque');
    await page.fill('#up-excerpt', 'This document persists in local storage.');

    await page.click('button:has-text("Add to library")');
    await page.click('button:has-text("Done")');

    const firstCard = page.locator('.qg-doc-card').first();
    await expect(firstCard.locator('.qg-doc-title')).toHaveText('Persisted Torque Document');

    await page.reload();

    const firstCardReloaded = page.locator('.qg-doc-card').first();
    await expect(firstCardReloaded.locator('.qg-doc-title')).toHaveText('Persisted Torque Document');
  });
});

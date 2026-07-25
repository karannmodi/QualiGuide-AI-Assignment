import { test, expect } from '@playwright/test';

test.describe('Section H: Feedback Widget Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
    await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');
    await expect(page.locator('.qg-stamp-card')).toBeVisible();
  });

  test('TC-FB-001: Select a feedback rating button', async ({ page }) => {
    const helpfulBtn = page.locator('button.qg-feedback-btn:has-text("Helpful")');
    await helpfulBtn.click();

    await expect(helpfulBtn).toHaveClass(/selected/);
    await expect(helpfulBtn).toHaveClass(/helpful/);
    await expect(page.locator('textarea.qg-feedback-comment')).toBeVisible();
    await expect(page.locator('button.qg-feedback-submit')).toBeVisible();
  });

  test('TC-FB-002: Verify all 4 feedback choices selectable', async ({ page }) => {
    const helpfulBtn = page.locator('button.qg-feedback-btn:has-text("Helpful")');
    const wrongBtn = page.locator('button.qg-feedback-btn:has-text("Wrong")');
    const incompleteBtn = page.locator('button.qg-feedback-btn:has-text("Incomplete")');
    const outdatedBtn = page.locator('button.qg-feedback-btn:has-text("Outdated")');

    await helpfulBtn.click();
    await expect(helpfulBtn).toHaveClass(/selected/);

    await wrongBtn.click();
    await expect(wrongBtn).toHaveClass(/selected/);

    await incompleteBtn.click();
    await expect(incompleteBtn).toHaveClass(/selected/);

    await outdatedBtn.click();
    await expect(outdatedBtn).toHaveClass(/selected/);
  });

  test('TC-FB-003: Submit feedback rating with empty comment', async ({ page }) => {
    await page.click('button.qg-feedback-btn:has-text("Helpful")');
    await page.click('button.qg-feedback-submit');

    const confirmMsg = page.locator('.qg-feedback-confirm');
    await expect(confirmMsg).toBeVisible();
    await expect(confirmMsg).toContainText('Feedback submitted — marked "Helpful". Thank you.');
  });

  test('TC-FB-004: Submit rating with detailed comment', async ({ page }) => {
    await page.click('button.qg-feedback-btn:has-text("Incomplete")');
    await page.fill('textarea.qg-feedback-comment', 'Needs specific calibration gauge ID.');
    await page.click('button.qg-feedback-submit');

    const confirmMsg = page.locator('.qg-feedback-confirm');
    await expect(confirmMsg).toBeVisible();
    await expect(confirmMsg).toContainText('Feedback submitted — marked "Incomplete". Thank you.');
  });

  test('TC-FB-005: Verify duplicate feedback cannot be resubmitted for same result', async ({ page }) => {
    await page.click('button.qg-feedback-btn:has-text("Helpful")');
    await page.click('button.qg-feedback-submit');

    // Confirm feedback is locked in confirmation state for this result
    const confirmMsg = page.locator('.qg-feedback-confirm');
    await expect(confirmMsg).toBeVisible();
    await expect(confirmMsg).toContainText('Feedback submitted — marked "Helpful". Thank you.');

    // Feedback rating buttons and submit button are removed from the result card
    await expect(page.locator('button.qg-feedback-submit')).toHaveCount(0);
    await expect(page.locator('button.qg-feedback-btn')).toHaveCount(0);
  });
});

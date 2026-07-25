import { test, expect } from '@playwright/test';

test.describe('Section I: Administrative Feedback Review Queue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-ADM-001: Primary UI Role Restriction: Verify disabled Feedback item in sidebar', async ({ page }) => {
    await page.click('button:has-text("Carlos — Operator / Inspector")');

    const feedbackNav = page.locator('.qg-nav-item.disabled');
    await expect(feedbackNav).toContainText('Feedback & Review');
    await expect(feedbackNav).toHaveAttribute('aria-disabled', 'true');

    await feedbackNav.click({ force: true });
    await expect(page.locator('.qg-page-title')).toContainText('Welcome back, Carlos');
  });

  test('TC-ADM-002: Optional Advanced Access-Control Test: Attempt forced state override to "feedback"', async ({ page }) => {
    await page.click('button:has-text("Carlos — Operator / Inspector")');
    await page.evaluate(() => window.localStorage.setItem('qualiguide.view', '"feedback"'));
    await page.reload();

    await expect(page.locator('.qg-page-title')).toContainText('Welcome back, Carlos');
    await expect(page.locator('button.qg-nav-item:has-text("Dashboard")')).toHaveClass(/active/);
  });

  test('TC-ADM-003: Check counter aggregation across ratings', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');

    // 1. Submit 1 Helpful on Q&A
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
    await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');
    await page.click('button.qg-feedback-btn:has-text("Helpful")');
    await page.click('button.qg-feedback-submit');

    // 2. Submit 1 Helpful on another Q&A
    await page.click('button.qg-chip:has-text("What is the current revision for the incoming inspection procedure?")');
    await page.locator('button.qg-feedback-btn:has-text("Helpful")').first().click();
    await page.locator('button.qg-feedback-submit').first().click();

    // 3. Submit 1 Wrong on NCR
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.click('button:has-text("Generate NCR summary")');
    await page.click('button.qg-feedback-btn:has-text("Wrong")');
    await page.click('button.qg-feedback-submit');

    // 4. Submit 1 Incomplete on Q&A
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
    await page.click('button.qg-chip:has-text("How long do supplier corrective actions have before they are due?")');
    await page.locator('button.qg-feedback-btn:has-text("Incomplete")').first().click();
    await page.locator('button.qg-feedback-submit').first().click();

    // Open Feedback Queue
    await page.click('button.qg-nav-item:has-text("Feedback & Review")');

    const stats = page.locator('.qg-review-stat-card');
    await expect(stats.nth(0).locator('.qg-review-stat-num')).toHaveText('2'); // Helpful
    await expect(stats.nth(1).locator('.qg-review-stat-num')).toHaveText('1'); // Wrong
    await expect(stats.nth(2).locator('.qg-review-stat-num')).toHaveText('1'); // Incomplete
    await expect(stats.nth(3).locator('.qg-review-stat-num')).toHaveText('0'); // Outdated
  });

  test('TC-ADM-004: Display of comments in reverse chronological order', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');

    // Submit Comment 1
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
    await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');
    await page.click('button.qg-feedback-btn:has-text("Helpful")');
    await page.fill('textarea.qg-feedback-comment', 'First submitted comment text.');
    await page.click('button.qg-feedback-submit');

    // Submit Comment 2
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.click('button:has-text("Generate NCR summary")');
    await page.click('button.qg-feedback-btn:has-text("Incomplete")');
    await page.fill('textarea.qg-feedback-comment', 'Second submitted comment text.');
    await page.click('button.qg-feedback-submit');

    // Open Admin Queue
    await page.click('button.qg-nav-item:has-text("Feedback & Review")');

    const commentCards = page.locator('.qg-review-comment-item');
    await expect(commentCards).toHaveCount(2);

    // First card should be Comment 2 (most recent)
    await expect(commentCards.nth(0).locator('.qg-review-comment-text')).toHaveText('Second submitted comment text.');
    await expect(commentCards.nth(1).locator('.qg-review-comment-text')).toHaveText('First submitted comment text.');
  });

  test('TC-ADM-005: Check view when no feedback has been submitted', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Feedback & Review")');

    const stats = page.locator('.qg-review-stat-card');
    await expect(stats.nth(0).locator('.qg-review-stat-num')).toHaveText('0');
    await expect(stats.nth(1).locator('.qg-review-stat-num')).toHaveText('0');
    await expect(stats.nth(2).locator('.qg-review-stat-num')).toHaveText('0');
    await expect(stats.nth(3).locator('.qg-review-stat-num')).toHaveText('0');

    await expect(page.locator('.qg-empty')).toBeVisible();
    await expect(page.locator('.qg-empty')).toHaveText('No comments have been submitted yet.');
  });
});

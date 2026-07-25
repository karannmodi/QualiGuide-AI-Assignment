import { test, expect } from '@playwright/test';

test.describe('Section B: Navigation & Shell Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-NAV-001: Click Dashboard link in sidebar', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await expect(page.locator('.qg-page-title')).toHaveText('Document Library');

    const dashBtn = page.locator('button.qg-nav-item:has-text("Dashboard")');
    await dashBtn.click();

    await expect(page.locator('.qg-page-title')).toContainText('Welcome back');
    await expect(dashBtn).toHaveClass(/active/);
  });

  test('TC-NAV-002: Click Document Library link in sidebar', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');

    await expect(page.locator('.qg-page-title')).toHaveText('Document Library');
    await expect(page.locator('.qg-filter-bar')).toBeVisible();
    await expect(page.locator('.qg-doc-grid')).toBeVisible();
  });

  test('TC-NAV-003: Click Ask a Question link in sidebar', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Ask a Question")');

    await expect(page.locator('.qg-page-title')).toHaveText('Ask a Question');
    await expect(page.locator('.qg-ask-box')).toBeVisible();
    await expect(page.locator('.qg-chip-row')).toBeVisible();
  });

  test('TC-NAV-004: Click NCR Assistant link in sidebar', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');

    await expect(page.locator('.qg-page-title')).toHaveText('NCR Assistant');
    await expect(page.locator('.qg-example-row')).toBeVisible();
    await expect(page.locator('#ncr-part')).toBeVisible();
  });

  test('TC-NAV-005: Attempt to click disabled Feedback tab as non-QM role', async ({ page }) => {
    await page.click('button:has-text("James — Production Supervisor")');
    
    const disabledTab = page.locator('.qg-nav-item.disabled', { hasText: 'Feedback & Review' });
    await expect(disabledTab).toBeVisible();
    await expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
    await expect(disabledTab).toHaveAttribute('title', 'Available to the Quality Manager role');

    await disabledTab.click({ force: true });
    await expect(page.locator('.qg-page-title')).toContainText('Welcome back');
  });

  test('TC-NAV-006: Click Feedback tab as Quality Manager', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Feedback & Review")');

    await expect(page.locator('.qg-page-title')).toHaveText('Feedback & Review');
    await expect(page.locator('.qg-review-stat-row')).toBeVisible();
  });

  test('TC-NAV-007: Trigger reset demo data and cancel confirmation', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Reset all simulated uploaded documents');
      await dialog.dismiss();
    });

    await page.click('button:has-text("Reset demo data")');

    await expect(page.locator('.qg-main')).toBeVisible();
    await expect(page.locator('.qg-role-chip-label')).toHaveText('Maria — Quality Manager');
  });

  test('TC-NAV-008: Reset all browser storage and state on confirmation', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Reset all simulated uploaded documents');
      await dialog.accept();
    });

    await page.click('button:has-text("Reset demo data")');

    await expect(page.locator('.qg-login-card')).toBeVisible();
    await expect(page.locator('.qg-login-title')).toHaveText('Choose a role to explore');
  });
});

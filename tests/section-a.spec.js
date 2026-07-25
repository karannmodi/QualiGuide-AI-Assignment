import { test, expect } from '@playwright/test';

test.describe('Section A: Role Selection & Role Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-ROLE-001: Display of available personas on initial launch', async ({ page }) => {
    await expect(page.locator('.qg-login-wrap')).toBeVisible();
    await expect(page.locator('.qg-login-title')).toHaveText('Choose a role to explore');
    
    const roleBtns = page.locator('.qg-role-btn');
    await expect(roleBtns).toHaveCount(4);

    await expect(roleBtns.nth(0)).toContainText('Maria — Quality Manager');
    await expect(roleBtns.nth(0)).toContainText('Keep procedures accurate and audit-ready');

    await expect(roleBtns.nth(1)).toContainText('James — Production Supervisor');
    await expect(roleBtns.nth(1)).toContainText('Get answers during production without stopping the line');

    await expect(roleBtns.nth(2)).toContainText('Anika — Supplier Quality Engineer');
    await expect(roleBtns.nth(2)).toContainText('Review defects and start corrective actions');

    await expect(roleBtns.nth(3)).toContainText('Carlos — Operator / Inspector');
    await expect(roleBtns.nth(3)).toContainText('Follow the correct, current work instruction');

    await expect(page.locator('.qg-sim-note')).toContainText('Simulated feature: role selection changes the view only.');
  });

  test('TC-ROLE-002: Select Quality Manager persona', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    
    await expect(page.locator('.qg-main')).toBeVisible();
    await expect(page.locator('.qg-page-title')).toContainText('Welcome back, Maria');
    await expect(page.locator('.qg-role-chip-label')).toHaveText('Maria — Quality Manager');
    
    const feedbackTab = page.locator('.qg-nav-item', { hasText: 'Feedback & Review' });
    await expect(feedbackTab).toBeVisible();
    await expect(feedbackTab).not.toHaveClass(/disabled/);
  });

  test('TC-ROLE-003: Select Supervisor persona', async ({ page }) => {
    await page.click('button:has-text("James — Production Supervisor")');
    
    await expect(page.locator('.qg-main')).toBeVisible();
    await expect(page.locator('.qg-page-title')).toContainText('Welcome back, James');
    await expect(page.locator('.qg-role-chip-label')).toHaveText('James — Production Supervisor');
    
    const feedbackTab = page.locator('.qg-nav-item.disabled', { hasText: 'Feedback & Review' });
    await expect(feedbackTab).toBeVisible();
    await expect(feedbackTab).toHaveAttribute('aria-disabled', 'true');
    await expect(feedbackTab.locator('.qg-nav-soon')).toHaveText('QM only');
  });

  test('TC-ROLE-004: Select Supplier Engineer persona', async ({ page }) => {
    await page.click('button:has-text("Anika — Supplier Quality Engineer")');
    
    await expect(page.locator('.qg-main')).toBeVisible();
    await expect(page.locator('.qg-page-title')).toContainText('Welcome back, Anika');
    await expect(page.locator('.qg-role-chip-label')).toHaveText('Anika — Supplier Quality Engineer');
    
    const feedbackTab = page.locator('.qg-nav-item.disabled', { hasText: 'Feedback & Review' });
    await expect(feedbackTab).toBeVisible();
    await expect(page.locator('.qg-persona-need')).toContainText('Anika — Supplier Quality Engineer');
    await expect(page.locator('.qg-persona-need')).toContainText('review defects and start corrective actions');
  });

  test('TC-ROLE-005: Select Operator persona', async ({ page }) => {
    await page.click('button:has-text("Carlos — Operator / Inspector")');
    
    await expect(page.locator('.qg-main')).toBeVisible();
    await expect(page.locator('.qg-page-title')).toContainText('Welcome back, Carlos');
    await expect(page.locator('.qg-role-chip-label')).toHaveText('Carlos — Operator / Inspector');
    
    const feedbackTab = page.locator('.qg-nav-item.disabled', { hasText: 'Feedback & Review' });
    await expect(feedbackTab).toBeVisible();
  });

  test('TC-ROLE-006: Return to Role Selector screen via Switch Role', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await expect(page.locator('.qg-main')).toBeVisible();

    await page.click('button:has-text("Switch role")');
    
    await expect(page.locator('.qg-login-card')).toBeVisible();
    await expect(page.locator('.qg-login-title')).toHaveText('Choose a role to explore');
  });

  test('TC-ROLE-007: Verify selected role persists across page reload', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await expect(page.locator('.qg-role-chip-label')).toHaveText('Maria — Quality Manager');

    await page.reload();

    await expect(page.locator('.qg-main')).toBeVisible();
    await expect(page.locator('.qg-role-chip-label')).toHaveText('Maria — Quality Manager');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Section C: Dashboard View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-DASH-001: Verify persona title rendering and welcome banner', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');

    await expect(page.locator('.qg-page-title')).toHaveText('Welcome back, Maria');
    await expect(page.locator('.qg-sim-banner')).toContainText('Simulated demo data');
  });

  test('TC-DASH-002: Verify correct count computation in document stat cards', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');

    const statCards = page.locator('.qg-stat-card');
    await expect(statCards).toHaveCount(4);

    await expect(statCards.nth(0).locator('.qg-stat-num')).toHaveText('10');
    await expect(statCards.nth(0).locator('.qg-stat-label')).toHaveText('Total sample documents');

    await expect(statCards.nth(1).locator('.qg-stat-num')).toHaveText('9');
    await expect(statCards.nth(1).locator('.qg-stat-label')).toHaveText('Marked current');

    await expect(statCards.nth(2).locator('.qg-stat-num')).toHaveText('1');
    await expect(statCards.nth(2).locator('.qg-stat-label')).toHaveText('Marked archived');

    await expect(statCards.nth(3).locator('.qg-stat-num')).toHaveText('4');
    await expect(statCards.nth(3).locator('.qg-stat-label')).toHaveText('Departments covered');
  });

  test('TC-DASH-003: Verify stat updates after adding document', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
    
    await page.click('button:has-text("Add document")');
    await page.fill('#up-title', 'Test Arch Document');
    await page.fill('#up-docnum', 'TEST-99');
    await page.fill('#up-revision', 'A');
    await page.fill('#up-department', 'Quality');
    await page.fill('#up-site', 'Plant 1');
    await page.selectOption('#up-status', 'archived');
    await page.fill('#up-tags', 'test, archived');
    await page.fill('#up-excerpt', 'This is a test archived document.');

    await page.click('button:has-text("Add to library")');
    await page.click('button:has-text("Done")');

    await page.click('button.qg-nav-item:has-text("Dashboard")');

    const statCards = page.locator('.qg-stat-card');
    await expect(statCards.nth(0).locator('.qg-stat-num')).toHaveText('11');
    await expect(statCards.nth(2).locator('.qg-stat-num')).toHaveText('2');
  });

  test('TC-DASH-004: Navigate to Q&A module via quicklink', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-quicklink:has-text("Ask a quality question")');

    await expect(page.locator('.qg-page-title')).toHaveText('Ask a Question');
    await expect(page.locator('button.qg-nav-item:has-text("Ask a Question")')).toHaveClass(/active/);
  });

  test('TC-DASH-005: Navigate to NCR module via quicklink', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-quicklink:has-text("Start an NCR summary")');

    await expect(page.locator('.qg-page-title')).toHaveText('NCR Assistant');
    await expect(page.locator('button.qg-nav-item:has-text("NCR Assistant")')).toHaveClass(/active/);
  });

  test('TC-DASH-006: Navigate to Document Library via quicklink', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-quicklink:has-text("Browse the document library")');

    await expect(page.locator('.qg-page-title')).toHaveText('Document Library');
    await expect(page.locator('button.qg-nav-item:has-text("Document Library")')).toHaveClass(/active/);
  });
});

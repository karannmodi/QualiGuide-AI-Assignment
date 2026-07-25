import { test, expect } from '@playwright/test';

test.describe('Section M: Responsive Layouts & Offline Resilience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-RESP-001: Layout at desktop resolutions (>1024px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.click('button:has-text("Maria — Quality Manager")');

    await expect(page.locator('.qg-sidebar')).toBeVisible();
    await expect(page.locator('.qg-main')).toBeVisible();

    const hasSignificantOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(hasSignificantOverflow).toBe(false);
  });

  test('TC-RESP-002: Layout at tablet resolution (768px - 860px)', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 1024 });
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');

    await expect(page.locator('.qg-ncr-layout')).toBeVisible();

    const hasSignificantOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(hasSignificantOverflow).toBe(false);
  });

  test('TC-RESP-003: Layout at mobile screen width (<=720px)', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 900 });
    await page.click('button:has-text("Maria — Quality Manager")');

    await expect(page.locator('.qg-sidebar')).toBeVisible();

    const hasSignificantOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(hasSignificantOverflow).toBe(false);
  });

  test('TC-RESP-004: Layout at narrow mobile width (<=480px / 375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('button:has-text("Maria — Quality Manager")');

    await expect(page.locator('.qg-stat-row')).toBeVisible();

    const hasSignificantOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    expect(hasSignificantOverflow).toBe(false);
  });

  test('TC-NET-001: Disconnect network connection and test offline operation', async ({ page, context }) => {
    await page.click('button:has-text("Maria — Quality Manager")');

    // Switch context to offline mode
    await context.setOffline(true);

    // 1. Navigate to Document Library
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await expect(page.locator('.qg-doc-card')).toHaveCount(10);

    // 2. Perform Q&A
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
    await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');
    await expect(page.locator('.qg-stamp-card')).toBeVisible();

    // 3. Generate NCR
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');
    await page.click('button:has-text("Generate NCR summary")');
    await expect(page.locator('.qg-review-banner')).toBeVisible();

    // Restore online mode for subsequent tests
    await context.setOffline(false);
  });

  test('TC-NET-002: Verify app behavior when browser storage is restricted or disabled', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');

    await page.evaluate(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: () => { throw new Error('Storage disabled'); },
          setItem: () => { throw new Error('Storage disabled'); },
          removeItem: () => {},
          clear: () => {}
        },
        writable: true
      });
    });

    // Trigger state change that writes to storage
    await page.click('button.qg-nav-item:has-text("Document Library")');

    // Storage warning banner should appear
    const banner = page.locator('.qg-storage-warning-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Browser storage is restricted or full');

    // App remains usable in memory
    await expect(page.locator('.qg-page-title')).toHaveText('Document Library');

    // Warning can be dismissed
    await page.click('button.qg-storage-warning-dismiss');
    await expect(banner).toHaveCount(0);
  });
});

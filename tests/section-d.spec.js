import { test, expect } from '@playwright/test';

test.describe('Section D: Document Library & Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
  });

  test('TC-DOC-001: Keyword search by document title', async ({ page }) => {
    const searchInput = page.locator('input[aria-label="Search documents by title or tag"]');
    await searchInput.fill('Calibration');

    const cards = page.locator('.qg-doc-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.qg-doc-title')).toHaveText('Calibration Control Procedure');
  });

  test('TC-DOC-002: Keyword search by tag', async ({ page }) => {
    const searchInput = page.locator('input[aria-label="Search documents by title or tag"]');
    await searchInput.fill('esd');

    const cards = page.locator('.qg-doc-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.qg-doc-title')).toHaveText('Electrostatic Discharge (ESD) Handling Procedure');
  });

  test('TC-DOC-003: Search input supported fields verification', async ({ page }) => {
    const searchInput = page.locator('input[aria-label="Search documents by title or tag"]');

    // 1. Search by title
    await searchInput.fill('Incoming Inspection Procedure');
    await expect(page.locator('.qg-doc-card')).toHaveCount(1);

    // 2. Search by department
    await searchInput.fill('Packaging');
    await expect(page.locator('.qg-doc-card')).toHaveCount(1);

    // 3. Search by site ('Corporate' matches 4 documents)
    await searchInput.fill('Corporate');
    await expect(page.locator('.qg-doc-card')).toHaveCount(4);

    // 4. Search by tag
    await searchInput.fill('ppap');
    await expect(page.locator('.qg-doc-card')).toHaveCount(1);

    // 5. Search by revision field ('F' matches 6 docs due to substring matching in title/dept/tags)
    await searchInput.fill('F');
    await expect(page.locator('.qg-doc-card')).toHaveCount(6);

    // 6. Search by document number (add a document with documentNumber first)
    await page.click('button:has-text("Add document")');
    await page.fill('#up-title', 'Doc Num Test');
    await page.fill('#up-docnum', 'WI-3312');
    await page.fill('#up-revision', 'A');
    await page.fill('#up-department', 'Quality');
    await page.fill('#up-site', 'Plant 1');
    await page.fill('#up-tags', 'test');
    await page.fill('#up-excerpt', 'Excerpt');
    await page.click('button:has-text("Add to library")');
    await page.click('button:has-text("Done")');

    await searchInput.fill('WI-3312');
    await expect(page.locator('.qg-doc-card')).toHaveCount(1);

    // 7. Search by term present ONLY in fullText excerpt (e.g. "NIST-traceable")
    await searchInput.fill('NIST-traceable');
    await expect(page.locator('.qg-empty')).toBeVisible();
    await expect(page.locator('.qg-empty')).toHaveText('No documents match those filters. Try clearing a filter.');
  });

  test('TC-DOC-004: Search for non-existent term', async ({ page }) => {
    const searchInput = page.locator('input[aria-label="Search documents by title or tag"]');
    await searchInput.fill('xyz999nonexistent');

    await expect(page.locator('.qg-doc-card')).toHaveCount(0);
    await expect(page.locator('.qg-empty')).toBeVisible();
    await expect(page.locator('.qg-empty')).toHaveText('No documents match those filters. Try clearing a filter.');
  });

  test('TC-DOC-005: Filter by specific department', async ({ page }) => {
    const deptSelect = page.locator('select[aria-label="Filter by department"]');
    await deptSelect.selectOption('Production');

    const cards = page.locator('.qg-doc-card');
    await expect(cards).toHaveCount(2);
    for (let i = 0; i < await cards.count(); i++) {
      await expect(cards.nth(i).locator('.qg-tag', { hasText: 'Production' })).toBeVisible();
    }
  });

  test('TC-DOC-006: Filter by "Archived only"', async ({ page }) => {
    const statusSelect = page.locator('select[aria-label="Filter by status"]');
    await statusSelect.selectOption('archived');

    const cards = page.locator('.qg-doc-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.qg-doc-title')).toHaveText('Packaging and Labeling Specification');
    await expect(cards.first().locator('.qg-tag.status-archived')).toHaveText('archived');
  });

  test('TC-DOC-007: Apply search keyword, department, and status simultaneously', async ({ page }) => {
    const searchInput = page.locator('input[aria-label="Search documents by title or tag"]');
    const deptSelect = page.locator('select[aria-label="Filter by department"]');
    const statusSelect = page.locator('select[aria-label="Filter by status"]');

    await searchInput.fill('Procedure');
    await deptSelect.selectOption('Quality');
    await statusSelect.selectOption('current');

    const cards = page.locator('.qg-doc-card');
    await expect(cards).toHaveCount(4);
  });

  test('TC-DOC-008: Verify card metadata tags and text', async ({ page }) => {
    const firstCard = page.locator('.qg-doc-card').first();

    await expect(firstCard.locator('.qg-doc-title')).toBeVisible();
    await expect(firstCard.locator('.qg-tag').nth(0)).toBeVisible(); // Department
    await expect(firstCard.locator('.qg-tag').nth(1)).toBeVisible(); // Site
    await expect(firstCard.locator('.qg-tag.qg-mono').nth(0)).toBeVisible(); // Rev
    await expect(firstCard.locator('.qg-tag.status-current, .qg-tag.status-archived')).toBeVisible(); // Status
    await expect(firstCard.locator('.qg-doc-excerpt')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Section J: Input Validation, Security, & Boundary Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-SEC-001: Submit <script> tag in Q&A question', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', () => { dialogTriggered = true; });

    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Ask a Question")');

    const askInput = page.locator('input[aria-label="Type your question"]');
    await askInput.fill("<script>alert('xss')</script>");
    await page.click('button.qg-ask-btn');

    await expect(page.locator('.qg-q-bubble').first()).toContainText("<script>alert('xss')</script>");
    expect(dialogTriggered).toBe(false);
  });

  test('TC-SEC-002: Submit HTML/Script tags in Document Title & Excerpt', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', () => { dialogTriggered = true; });

    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');
    await page.click('button:has-text("Add document")');

    await page.fill('#up-title', '<img src=x onerror=alert(1)>');
    await page.fill('#up-docnum', 'SEC-001');
    await page.fill('#up-revision', 'A');
    await page.fill('#up-department', 'Quality');
    await page.fill('#up-site', 'Plant 1');
    await page.fill('#up-tags', 'security');
    await page.fill('#up-excerpt', '<b onmouseover=alert(1)>test</b>');

    await page.click('button:has-text("Add to library")');
    await page.click('button:has-text("Done")');

    const card = page.locator('.qg-doc-card').first();
    await expect(card.locator('.qg-doc-title')).toHaveText('<img src=x onerror=alert(1)>');
    await expect(card.locator('.qg-doc-excerpt')).toHaveText('<b onmouseover=alert(1)>test</b>');
    expect(dialogTriggered).toBe(false);
  });

  test('TC-SEC-003: Submit script payload in feedback comment', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', () => { dialogTriggered = true; });

    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Ask a Question")');
    await page.click('button.qg-chip:has-text("What PPE is required for ESD-sensitive parts?")');

    await page.click('button.qg-feedback-btn:has-text("Wrong")');
    await page.fill('textarea.qg-feedback-comment', "<svg/onload=alert('XSS')>");
    await page.click('button.qg-feedback-submit');

    await page.click('button.qg-nav-item:has-text("Feedback & Review")');

    const commentBody = page.locator('.qg-review-comment-text').first();
    await expect(commentBody).toHaveText("<svg/onload=alert('XSS')>");
    expect(dialogTriggered).toBe(false);
  });

  test('TC-SEC-004: Enforce maximum input length limits on form text fields', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');

    const issueInput = page.locator('#ncr-issue');
    await expect(issueInput).toHaveAttribute('maxLength', '2000');

    // Attempting to type 2,500 characters is capped at 2,000 via browser HTML attribute
    await issueInput.fill('A'.repeat(2500));
    const val = await issueInput.inputValue();
    expect(val.length).toBe(2000);

    // Submitting 2,000 char string renders output without breaking layout
    await page.click('button:has-text("Generate NCR summary")');
    await expect(page.locator('.qg-review-banner')).toBeVisible();
  });

  test('TC-SEC-005: Enter Unicode, emojis, and symbols', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');
    await page.click('button:has-text("NCR-014 — Bore diameter out of tolerance")');

    const specialPart = 'Part #@!$%^&*()_+=~`{}[]|\\:;"\'<>,.?/ 🛠️⚠️';
    await page.fill('#ncr-part', specialPart);
    await page.click('button:has-text("Generate NCR summary")');

    await expect(page.locator('.qg-out-text')).toContainText(specialPart);
  });

  test('TC-SEC-006: Verify safe frontend handling of SQL-like strings', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');

    const searchInput = page.locator('input[aria-label="Search documents by title or tag"]');
    await searchInput.fill("' OR '1'='1");
    await expect(page.locator('.qg-empty')).toBeVisible();

    await searchInput.fill("DROP TABLE documents; --");
    await expect(page.locator('.qg-empty')).toBeVisible();
  });
});

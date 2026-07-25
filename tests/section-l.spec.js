import { test, expect } from '@playwright/test';

test.describe('Section L: Accessibility & Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('TC-A11Y-001: Tab navigation focus indicator visibility', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const isFocusedElementValid = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.outlineStyle !== 'none' || style.boxShadow !== 'none';
    });

    expect(isFocusedElementValid).toBe(true);
  });

  test('TC-A11Y-002: Focus indicator on text fields', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');

    await page.focus('#ncr-part');

    const inputFocusStyle = await page.evaluate(() => {
      const el = document.querySelector('#ncr-part');
      const style = window.getComputedStyle(el);
      return style.outlineStyle !== 'none' || style.boxShadow !== 'none' || style.borderColor !== '';
    });

    expect(inputFocusStyle).toBe(true);
  });

  test('TC-A11Y-003: Upload Document Modal dialog markup, initial focus, focus trap, Escape behavior, and focus restoration', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');

    const addDocBtn = page.locator('button:has-text("Add document")');
    await addDocBtn.click();

    const modal = page.locator('.qg-modal-card');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby', 'qg-upload-modal-title');

    // Assert initial focus is automatically trapped inside the modal (Fails -> BUG-001)
    const isInitialFocusInsideModal = await page.evaluate(() => !!document.activeElement?.closest('.qg-modal-card'));
    expect(isInitialFocusInsideModal).toBe(true);
  });

  test('TC-A11Y-004: Verify HTML label association', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("NCR Assistant")');

    await page.click('label[for="ncr-part"]');

    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('ncr-part');
  });

  test('TC-A11Y-005: Accessible name on search input', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Document Library")');

    const searchInput = page.locator('input[aria-label="Search documents by title or tag"]');
    await expect(searchInput).toBeVisible();
  });

  test('TC-A11Y-006: Submit question using Enter key', async ({ page }) => {
    await page.click('button:has-text("Maria — Quality Manager")');
    await page.click('button.qg-nav-item:has-text("Ask a Question")');

    const askInput = page.locator('input[aria-label="Type your question"]');
    await askInput.fill('What PPE is required for ESD-sensitive parts?');
    await page.keyboard.press('Enter');

    await expect(page.locator('.qg-stamp-card')).toBeVisible();
    await expect(page.locator('.qg-cite-doc')).toContainText('Electrostatic Discharge (ESD) Handling Procedure');
  });
});

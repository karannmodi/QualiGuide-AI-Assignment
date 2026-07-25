import { chromium } from '@playwright/test';

async function testModalFocus() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('--- Targeted Modal Focus Test (TC-A11Y-003) ---');
  await page.goto('http://localhost:5175');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  // a. Select Quality Manager role
  await page.click('button:has-text("Maria — Quality Manager")');

  // b. Navigate to Document Library
  await page.click('button.qg-nav-item:has-text("Document Library")');

  // c. Record document.activeElement before opening modal
  const beforeOpenFocus = await page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, text: el?.textContent?.trim(), id: el?.id, className: el?.className };
  });
  console.log('c. Focus before opening modal:', beforeOpenFocus);

  // d. Open Add Document modal
  const triggerBtn = page.locator('button:has-text("Add document")');
  await triggerBtn.click();

  // e. Verify whether initial focus automatically moves to an interactive control inside modal
  const initialModalFocus = await page.evaluate(() => {
    const el = document.activeElement;
    const isInsideModal = !!el?.closest('.qg-modal-card');
    return { isInsideModal, tag: el?.tagName, id: el?.id, className: el?.className, text: el?.textContent?.trim() };
  });
  console.log('e. Initial focus after opening modal:', initialModalFocus);

  // f. Press Tab repeatedly (15 times) and check if focus ever leaks outside .qg-modal-card
  let leakedOutsideForward = false;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab');
    const isInside = await page.evaluate(() => !!document.activeElement?.closest('.qg-modal-card'));
    if (!isInside) {
      leakedOutsideForward = true;
      const leakedEl = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        text: document.activeElement?.textContent?.trim(),
        id: document.activeElement?.id,
        className: document.activeElement?.className
      }));
      console.log(`f. Tab #${i + 1} leaked outside modal to:`, leakedEl);
      break;
    }
  }
  console.log('f. Forward focus containment (Tab):', leakedOutsideForward ? 'FAILED (focus leaked outside modal)' : 'PASSED (focus trapped inside modal)');

  // g. Press Shift+Tab repeatedly (15 times) and check if focus leaks outside
  let leakedOutsideReverse = false;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Shift+Tab');
    const isInside = await page.evaluate(() => !!document.activeElement?.closest('.qg-modal-card'));
    if (!isInside) {
      leakedOutsideReverse = true;
      const leakedEl = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        text: document.activeElement?.textContent?.trim(),
        id: document.activeElement?.id,
        className: document.activeElement?.className
      }));
      console.log(`g. Shift+Tab #${i + 1} leaked outside modal to:`, leakedEl);
      break;
    }
  }
  console.log('g. Reverse focus containment (Shift+Tab):', leakedOutsideReverse ? 'FAILED (focus leaked outside modal)' : 'PASSED (focus trapped inside modal)');

  // h. Press Escape and verify modal closes
  await page.keyboard.press('Escape');
  const isModalClosed = await page.evaluate(() => document.querySelectorAll('.qg-modal-overlay').length === 0);
  console.log('h. Modal closed on Escape:', isModalClosed);

  // i. Verify whether focus returns to Add document trigger button
  const afterCloseFocus = await page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, text: el?.textContent?.trim(), id: el?.id, className: el?.className };
  });
  console.log('i. Focus after modal close:', afterCloseFocus);

  await browser.close();
}

testModalFocus();

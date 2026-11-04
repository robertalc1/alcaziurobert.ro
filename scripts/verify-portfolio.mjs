import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch();
const errors = [];
await mkdir('artifacts.local', { recursive: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8080/');
    await page.getByRole('button', { name: 'Acceptă necesare', exact: true }).click();
    await page.locator('#work').evaluate(el => el.scrollIntoView({ block: 'start' }));
    await page.evaluate(() => window.scrollBy(0, -160));
    await page.locator('.work-feature').first().waitFor();
    await page.waitForTimeout(800);
    assert.equal(await page.locator('.work-feature').count(), 2);
    assert.equal(await page.locator('.work-group').first().locator('a').count(), 10);
    const layout = await page.locator('#work').evaluate(section => ({
      height: Math.round(section.getBoundingClientRect().height),
      width: section.querySelector('.work-inner').getBoundingClientRect().width,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      loaded: [...section.querySelectorAll('.work-feature img')].every(img => img.complete && img.naturalWidth),
    }));
    assert.equal(layout.overflow, false, 'No horizontal page overflow');
    assert.ok(layout.width <= 1120, 'Section stays within its container');
    assert.ok(layout.loaded, 'Featured screenshots load');
    await page.locator('#work').screenshot({
      path: `artifacts.local/portfolio-${width}.png`,
      style: '.site-nav, .bar { visibility: hidden !important; }',
    });

    const rail = page.locator('#work-rail');
    await rail.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);
    const start = await rail.evaluate(el => el.scrollLeft);
    await page.waitForTimeout(700);
    assert.ok(await rail.evaluate(el => el.scrollLeft) > start + 10, 'Continuous scrolling advances');
    await rail.hover();
    const hoverStart = await rail.evaluate(el => el.scrollLeft);
    await page.waitForTimeout(400);
    assert.equal(await rail.evaluate(el => el.scrollLeft), hoverStart, 'Hover pauses scrolling');
    await page.mouse.move(0, 0);
    await page.locator('.work-motion').click();
    const pauseStart = await rail.evaluate(el => el.scrollLeft);
    await page.waitForTimeout(400);
    assert.equal(await rail.evaluate(el => el.scrollLeft), pauseStart, 'Pause control stops scrolling');

    // Move to the end of the first copy; resuming must wrap to the start.
    await rail.evaluate(el => {
      el.scrollLeft = el.querySelector('.work-group').getBoundingClientRect().width - 3;
    });
    await page.locator('.work-motion').click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);
    assert.ok(await rail.evaluate(el => el.scrollLeft) < 50, 'Loop wraps without an empty gap');
    await rail.locator('.work-group').first().locator('a').first().focus();
    const focusStart = await rail.evaluate(el => el.scrollLeft);
    await page.waitForTimeout(300);
    assert.equal(await rail.evaluate(el => el.scrollLeft), focusStart, 'Keyboard focus pauses scrolling');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelectorAll('.work-group').length === 1);
    assert.equal(await page.locator('.work-group').count(), 1, 'Reduced motion has no duplicate projects');
    assert.equal(await page.locator('.work-motion').count(), 0);
    const reducedStart = await rail.evaluate(el => el.scrollLeft);
    await page.waitForTimeout(300);
    assert.equal(await rail.evaluate(el => el.scrollLeft), reducedStart);
    await page.locator('.work-cta button').click();
    await page.getByRole('dialog').waitFor();
    console.log(JSON.stringify({ viewport: width, ...layout, checks: 'passed' }));
    await page.close();
  }
  assert.deepEqual(errors, [], 'No browser runtime errors');
} finally {
  await browser.close();
}

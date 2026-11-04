import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

const base = process.env.AUDIT_URL || 'http://127.0.0.1:4175';
const meta = JSON.parse(await readFile('route-meta.json', 'utf8'));
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [360, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Acceptă necesare', exact: true }).click();
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const checks = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      descriptions: document.querySelectorAll('meta[name="description"]').length,
      canonicals: document.querySelectorAll('link[rel="canonical"]').length,
      schemas: document.querySelectorAll('script[type="application/ld+json"]').length,
      price: document.body.textContent.includes('Proiecte de la 1.000 €.'),
      trackers: document.querySelectorAll('#ga4-gtag-script, #meta-pixel-script').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      clippedButtons: [...document.querySelectorAll('button')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
      }).map(el => el.textContent),
    }));
    assert.equal(checks.h1, 1); assert.equal(checks.descriptions, 1); assert.equal(checks.canonicals, 1);
    assert.equal(checks.schemas, 1); assert.equal(checks.price, true); assert.equal(checks.trackers, 0);
    assert.equal(checks.overflow, false); assert.deepEqual(checks.clippedButtons, []);
    assert.equal(await page.locator('.faq-trigger').count(), 13);
    await page.locator('.faq-trigger').first().click();
    await page.getByText('Este pragul minim pentru un proiect,', { exact: false }).waitFor();
    assert.equal(await page.locator('.faq-trigger').first().getAttribute('aria-expanded'), 'true');
    await page.locator('.hero-cta').click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    await dialog.getByRole('button', { name: 'Trimiteți cererea', exact: true }).click();
    await dialog.getByText('Completați numele', { exact: false }).waitFor();
    assert.deepEqual(errors, []);
    results.push({ viewport: width, ...checks, dialogAndValidation: 'passed' });
    await page.close();
  }

  const context = await browser.newContext({ viewport: { width:1440,height:900 } });
  // Prevent any analytics delivery or real email; inspect the existing queues and HTTP contract.
  await context.route('**/gtag/js*', route => route.fulfill({ contentType:'application/javascript', body:'' }));
  await context.route('**/fbevents.js', route => route.fulfill({ contentType:'application/javascript', body:'' }));
  const page = await context.newPage();
  await page.goto(base);
  await page.getByRole('button', { name:'Acceptă toate',exact:true }).click();
  await page.waitForSelector('#ga4-gtag-script', { state:'attached' });
  const events = () => page.evaluate(() => (window.dataLayer || []).filter(args => args[0] === 'event').map(args => ({name:args[1],params:args[2]})));
  await page.locator('.hero-cta').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel(/^Nume/).fill('Test QA');
  await dialog.getByLabel(/^Telefon/).fill('0712345678');
  await dialog.getByLabel(/^Email/).fill('qa@example.com');
  await dialog.getByRole('combobox').click();
  await page.getByRole('option', { name:'Site web',exact:true }).click();
  const requests = [];
  let success = false;
  await page.route('**/api/contact', async route => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status:success ? 200 : 500,contentType:'application/json',body:JSON.stringify({ok:success}) });
  });
  await dialog.getByRole('button', { name:'Trimiteți cererea',exact:true }).click();
  await page.getByText('Trimitere eșuată', {exact:true}).waitFor();
  assert.equal((await events()).filter(e => e.name === 'generate_lead').length, 0);
  success = true;
  await dialog.getByRole('button', { name:'Trimiteți cererea',exact:true }).click();
  await dialog.getByRole('status').waitFor();
  const recorded = await events();
  for (const name of ['quote_request','form_start','generate_lead']) assert.equal(recorded.filter(e => e.name === name).length,1,name);
  assert.equal(requests.length,2); assert.equal(requests[1].marketingConsent,true);
  assert.ok(!JSON.stringify(recorded).includes('qa@example.com'));
  assert.ok(!JSON.stringify(recorded).includes('0712345678'));
  await dialog.getByRole('link', { name:/WhatsApp/ }).evaluate(el => el.addEventListener('click', e => e.preventDefault()));
  await dialog.getByRole('link', { name:/WhatsApp/ }).click();
  assert.equal((await events()).filter(e => e.name === 'whatsapp_click').length,1);
  await dialog.locator('.cf-sent-close').click();
  await page.locator('.nav-phone').evaluate(el => el.addEventListener('click', e => e.preventDefault()));
  await page.locator('.nav-phone').click();
  assert.equal((await events()).filter(e => e.name === 'phone_click').length,1);
  await page.getByRole('button', { name:'Setări cookie-uri',exact:true }).click();
  await page.getByRole('dialog').getByRole('button', { name:'Acceptă necesare',exact:true }).click();
  const beforeRevoke = (await events()).length;
  await page.locator('.hero-cta').click();
  assert.equal((await events()).length,beforeRevoke,'Revocation stops contact event collection');
  results.push({ form:'success and failure mocked',analytics:await events(),personalDataInEvents:false,consentRevocation:'passed' });
  await context.close();

  const crawler = await browser.newContext({ userAgent:'Googlebot' });
  for (const route of Object.keys(meta)) {
    for (const isCrawler of [false,true]) {
      const context = isCrawler ? crawler : await browser.newContext();
      const response = await context.request.get(base + route);
      assert.equal(response.status(),200);
      const html = await response.text();
      const descriptions = [...html.matchAll(/<meta[^>]*name="description"[^>]*>/g)];
      const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*>/g)];
      assert.equal(descriptions.length,1);assert.equal(canonicals.length,1);
      assert.ok(canonicals[0][0].includes('https://alcaziurobert.ro'+route));
      assert.ok(html.includes(meta[route].title.ro));
      const schema = JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
      assert.equal(schema['@graph'].filter(n => n['@type'] === 'WebPage').length,1);
      assert.ok(!schema['@graph'].some(n => ['Product','LocalBusiness','ProfessionalService','FAQPage'].includes(n['@type'])));
      if (isCrawler && route === '/') assert.ok(html.includes('Proiecte de la 1.000 €.'));
      if (!isCrawler) await context.close();
    }
  }
  const request = crawler.request;
  assert.equal((await request.get(base+'/pagina-inexistenta')).status(),404);
  assert.equal((await request.head(base+'/studii-de-caz')).status(),200);
  const redirect = await request.get(base+'/STUDII-DE-CAZ/?utm_source=test', {maxRedirects:0});
  assert.equal(redirect.status(),301);assert.equal(redirect.headers().location,'/studii-de-caz?utm_source=test');
  const sitemap = await (await request.get(base+'/sitemap.xml')).text();
  assert.equal([...sitemap.matchAll(/<loc>/g)].length,5);
  assert.ok((await (await request.get(base+'/robots.txt')).text()).includes('Allow: /'));
  results.push({seo:'5 routes: raw HTML and crawler, 404, HEAD, canonical redirect, sitemap, robots passed'});
  await crawler.close();
  await writeFile('artifacts.local/commercial/verification.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
} finally { await browser.close(); }

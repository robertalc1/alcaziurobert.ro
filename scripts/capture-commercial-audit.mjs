import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] || 'before';
const base = process.env.AUDIT_URL || 'http://127.0.0.1:8080';
const output = `artifacts.local/commercial/${phase}`;
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [360, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Acceptă necesare', exact: true }).click();
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        scrollTo(0, y);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${output}/page-${width}.png`, fullPage: true });
    for (const [name, selector] of Object.entries({hero:'#hero',offer:'#offer',work:'#work',faq:'#faq'})) {
      await page.locator(selector).screenshot({ path: `${output}/${name}-${width}.png`, style: '.site-nav,.bar,.mbb-shell{visibility:hidden!important}' });
    }
    const audit = await page.evaluate(() => ({
      title: document.title,
      descriptions: [...document.querySelectorAll('meta[name="description"]')].map(el => el.content),
      canonicals: [...document.querySelectorAll('link[rel="canonical"]')].map(el => el.href),
      headings: [...document.querySelectorAll('h1,h2,h3')].map(el => ({tag:el.tagName,text:el.textContent})),
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
      overflow: document.documentElement.scrollWidth > innerWidth,
      styles: Object.fromEntries(['.hero-panel','.hero-title','.hero-sub','.hero-cta','.offer-card','.proc-list li','.funnel-panorama','.faq-item'].map(selector => {
        const el = document.querySelector(selector), s = getComputedStyle(el);
        return [selector, Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','background','borderRadius','boxShadow','padding','gap','textAlign','animation','transition'].map(key => [key,s[key]]))];
      })),
      text: document.body.innerText,
    }));
    await writeFile(`${output}/audit-${width}.json`, JSON.stringify(audit,null,2));
    console.log(JSON.stringify({ phase,width, descriptions:audit.descriptions.length,canonicals:audit.canonicals.length,overflow:audit.overflow }));
    await page.close();
  }
} finally { await browser.close(); }

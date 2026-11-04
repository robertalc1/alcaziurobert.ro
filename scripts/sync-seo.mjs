import { readFile, writeFile } from 'node:fs/promises';

const meta = JSON.parse(await readFile('route-meta.json', 'utf8'))['/'];
const schema = JSON.parse(await readFile('src/lib/siteSchema.json', 'utf8'));
schema['@graph'].push({
  '@type': 'WebPage', '@id': 'https://alcaziurobert.ro/#webpage',
  url: 'https://alcaziurobert.ro/', name: meta.title.ro,
  description: meta.description.ro, inLanguage: 'ro',
  isPartOf: { '@id': 'https://alcaziurobert.ro/#website' },
  about: { '@id': 'https://alcaziurobert.ro/#person' },
});
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
let html = await readFile('index.html', 'utf8');
html = html.replace(/(<title[^>]*>)[\s\S]*?(<\/title>)/, `$1${escape(meta.title.ro)}$2`);
for (const [key, value] of Object.entries({
  description: meta.description.ro, 'og:title': meta.title.ro,
  'og:description': meta.description.ro, 'twitter:title': meta.title.ro,
  'twitter:description': meta.description.ro,
})) {
  html = html.replace(new RegExp(`(<meta[^>]*(?:name|property)="${key}"[^>]*content=")[^"]*(")`), `$1${escape(value)}$2`);
}
html = html.replace(/(<script id="site-schema"[^>]*>)[\s\S]*?(<\/script>)/,
  (_, start, end) => start + JSON.stringify(schema).replaceAll('<', '\\u003c') + end);
await writeFile('index.html', html);

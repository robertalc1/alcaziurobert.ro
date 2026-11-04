# Revizuire comercială și SEO — 4 noiembrie 2026

**Stare: implementare verificată local; publicare solicitată ulterior de proprietar.** Preview: http://localhost:8080/ ; verificările backend au folosit http://localhost:4175/ . Rezultatele de mai jos descriu verificarea locală dinaintea publicării; confirmarea deployment-ului se face separat.

## Rezultatul comercial

Hero-ul explică acum faptul că sunt oferite website-uri și aplicații web pentru afaceri. „Proiecte de la 1.000 €.” este text vizibil, în componentele și stilurile existente. Prețul este un prag, iar paginile, funcționalitățile și serviciile incluse sunt stabilite în ofertă; nu există un pachet universal inventat.

Oferta explică traseul găsirea afacerii → înțelegerea ofertei → contact → măsurare. Cele patru componente existente prezintă website-ul custom, parcursul către contact, măsurarea opțională și campaniile opționale. Pagina `/studii-de-caz` clarifică aplicațiile web, SEO, securitatea tehnică și canalele de promovare, fără a promite conformitate NIS2 sau măsurare completă.

Comparația veche „cu noi / fără noi” și afirmația că un client nou recuperează întregul proiect au fost înlocuite cu opțiuni după lansare, păstrând aceleași două componente: trafic/conversie și întreținere/extindere. Serviciile sunt separate și opționale. Bugetul media este distinct de administrare; nu există abonamente preselectate sau prețuri suplimentare inventate.

FAQ-ul folosește aceeași componentă Accordion și acoperă acum 13 întrebări: pragul minim, formarea prețului, livrabile, costuri recurente, domeniu/hosting, materiale, revizii, durată, accesuri, SEO, reclame, suport și garanția existentă. Garanția de 90 de zile a fost păstrată, fără extinderea obligației, și necesită delimitarea condițiilor înainte de publicare.

Nu au fost adăugate mărturii, rating-uri, certificări, parteneriate, rezultate sau statistici de conversie. Cifrele din istoricul intern nu au perioadă, sursă primară și metodă suficiente pentru o demonstrație comercială completă; copiile de rezultat din locale și ecranul de succes au fost înlocuite cu descrieri ale implementărilor. Cele 12 proiecte și capturile reale au rămas; SGC OCPI și Black Sea GIS sunt primele, separate de carusel. Aplicațiile complexe nu sunt prezentate drept proiecte de 1.000 €.

Referințele atașate au fost folosite pentru principiile problemă clară, beneficiu concret, demonstrație și pas următor. Nu s-au copiat compoziții, logo-uri, cifre ori garanții; nu s-a adăugat AI visibility și nu s-a schimbat publicul către clinici.

## Arhitectură și surse auditate

| Zonă | Implementare existentă și intervenție |
|---|---|
| Framework | React 18, TypeScript, Vite 5, React Router, i18next, Tailwind și CSS local. Fără migrare sau biblioteci noi. |
| Homepage | `Hero`, `OfferSection`, `ProcessSection`, `CompoundingSection`, `SelectedWorkSection`, `GetInTouchSection`, `FaqsSection`, `MadeByHumans`, navbar și bara mobilă. Layout-urile rămân. |
| Conținut | `src/locales/ro.json` și `en.json`; ambele actualizate. Documentele vechi cu decizia „fără preț” au o suprascriere explicită datată. |
| Randare | SPA cu `createRoot`, încărcare pe componente și prerandare Playwright la build pentru crawlere. Serverul servește aceleași informații în snapshot-uri, fără necesitatea executării JS de către crawler. Politica existentă pentru oameni/crawlere nu a fost înlocuită. |
| Metadate | `route-meta.json`, baseline HTML sincronizat înainte de build, `SEOHead` în client, rescriere pe rută în `server.js`. |
| Rute indexabile | `/`, `/studii-de-caz`, `/termeni-si-conditii`, `/politica-de-confidentialitate`, `/politica-de-cookie-uri`. Selector EN fără URL separat; fără rute sau hreflang inventate. |
| Formular | React Hook Form + Zod; `POST /api/contact`, Express + Nodemailer; Meta CAPI pe server condiționată de consimțământ. Câmpurile și contractul API au rămas. |
| Consimțământ | Provider existent; GA4 numai cu categoria performanță, Meta numai cu marketing. Nu s-a introdus alt sistem. |
| SEO public | Sitemap cu cele cinci URL-uri canonice, robots fără blocări accidentale; `llms.txt` actualizat factual, fără garanții de recomandare AI. |

Nu există `AGENTS.md` sau `CLAUDE.md` în proiect ori în directorii părinți verificați. Cererea pentru `AGENTS.md` la rădăcina repository-ului `robertalc1/codex-skills` a întors 404. Au fost citite `README.md`, `PRODUCT.md`, `DESIGN.md`, istoricul relevant din `ANALIZA-SI-PLAN.md` și skill-urile instalate local; lipsa unui AGENTS nu a fost înlocuită cu instrucțiuni presupuse.

## Păstrarea designului și review de motion

Nu s-au schimbat stylesheet-uri, blocuri CSS din componente, token-uri, paletă, fonturi, mărimi, colțuri, umbre, glass, canvas, alinierea hero-ului sau definiții de animație. Conținutul mai lung schimbă natural înălțimea unor blocuri și lungimea paginii. Au rămas aceleași structuri de carduri, butoane și iconuri.

Comparația automată a stilurilor pentru hero, titlu, subtitlu, CTA, cardurile ofertei/procesului/opțiunilor și FAQ este identică la 360, 390, 768 și 1440 px. Fișierul `artifacts.local/commercial/source-diff.json` confirmă zero modificări CSS. Capturile au fost făcute cu mișcare redusă pentru comparație stabilă; animațiile în produs nu au fost eliminate.

| Înainte | După | Motiv |
|---|---|---|
| Banda de anunț modifica spațiul ocupat după primul render | Spațiul existent este rezervat în HTML, cu aceeași înălțime și alegere de închidere (`index.html:7`, `AnnouncementBar.tsx:32`) | Eliminarea deplasării măsurate, fără schimbarea aspectului final |
| Logo-urile din hero apăreau după un fallback prea scund pe mobil | Același component se randează în primul render (`Hero.tsx:9`) | Rezervarea geometriei reale, fără un nou efect |
| Etichetele Nume/Telefon/Email indicau un `<div>` | `FormControl` este aplicat direct pe input (`ContactForm.tsx:423`) | Nume accesibile, focus și mesaje de eroare asociate corect; același DOM vizual |
| CTA complet depășea bara mobilă | Textul scurt existent rămâne în navbar, cu nume accesibil complet | Păstrarea geometriei; CTA principal din hero este exact cel solicitat |

**Verdict motion: aprobat pentru această intervenție.** Nicio animație nu a fost adăugată sau retemporizată. Caruselul păstrează viteză constantă, pauză la hover/focus, control de pauză și varianta fără autoplay pentru reduced motion. Testele de repetare, tastatură și reduced motion au trecut. Nu s-a făcut o certificare exhaustivă a tuturor efectelor vechi pe dispozitive fizice.

## SEO și date structurate

Problema a fost confirmată înainte de modificare: **două description și două canonical** în DOM, la toate cele patru lățimi testate. Baseline-ul HTML era unmanaged, iar Helmet adăuga copii. Tagurile de bază sunt acum marcate pentru gestionare de către Helmet; `sync-seo.mjs` menține titlurile/descrierile și schema din sursele comune. Scriptul de build a fost actualizat, fără dependințe noi. Serverul recunoaște tagurile gestionate, rescrie metadatele pe rută și normalizează variantele cu slash final/litere mari ale rutelor cunoscute, păstrând query string-ul.

După modificare: un description, un canonical, un H1 și un JSON-LD în DOM. Cele cinci rute au titluri și descrieri proprii, canonical consecvent, versiune RO și metadate Open Graph/Twitter. Ruta necunoscută returnează 404 și noindex; HEAD pe o rută validă returnează 200. Redirectul local de rută verificat returnează 301. Sitemap-ul și robots au trecut verificările locale.

Graful folosește **Person + WebSite + WebPage + Service**, cu identificatori stabili și relații între pagină, website, persoană și servicii. Au fost înlăturate ProfessionalService/LocalBusiness implicite, adresa presupusă, aria geografică neconfirmată și afirmațiile de conformitate. Nu s-au inventat organizație, profiluri sameAs, rating-uri sau certificări. Nu există breadcrumb-uri reale, deci nu s-a emis BreadcrumbList. FAQPage a fost omis, fiind opțional și pentru a evita o a doua copie de Q&A care poate deriva.

Prețul **nu este inclus în schema**: nu există o ofertă de pornire cu livrabile delimitate suficient pentru a reprezenta exact ce se vinde la 1.000 €. Prețul minim rămâne clar în text, iar Service nu este forțat într-un Product/AggregateOffer. Tipurile și relațiile au fost verificate în [vocabularul Service](https://schema.org/Service) și [Person](https://schema.org/Person). Validitatea vocabularului și eligibilitatea Google pentru rezultate îmbogățite sunt verificări diferite; implementarea nu promite astfel de rezultate. [Documentația Google despre date structurate](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).

**Schema Markup Validator:** zero erori, zero avertismente în fragmentul local, cu nodurile interconectate; captură și rezultat text salvate. **Google Rich Results Test:** codul local a fost introdus, dar serviciul a răspuns „Something went wrong / Log in and try again”. Nu există un rezultat valid Google pentru această versiune și nu este raportat ca succes. Nu a fost testat URL-ul live ca și cum ar conține modificările locale.

Verificarea read-only a producției a găsit `http://alcaziurobert.ro/` și `https://www.alcaziurobert.ro/` cu răspuns 200, fără redirect imediat. Canonical-ul este pe HTTPS fără www. Redirecturile de protocol/host trebuie configurate și verificate la terminarea TLS pe Hosterion; nu am introdus un redirect care presupune arbitrar configurația reverse-proxy și ar putea crea bucle. Această problemă de infrastructură rămâne în lista înainte de publicare.

## Formular, analytics și accesibilitate

- Verificare la 360/390/768/1440 px: fără overflow de pagină sau butoane în afara viewport-ului, dialog și validare funcționale.
- Etichetele pentru input-urile de contact au fost corectate; structura, câmpurile, validarea și endpoint-ul sunt aceleași.
- Testate navigarea cu tastatura, focusul în dialog, Escape și întoarcerea focusului la CTA, meniul, zoom 200% și varianta EN.
- `quote_request` și `whatsapp_click` completează evenimentele existente `form_start`, `generate_lead` și `phone_click`. Evenimentele noi folosesc nume fixe, fără date personale sau text introdus de vizitator.
- În testele izolate, fără consimțământ nu sunt injectate tagurile; după consimțământ evenimentele relevante apar o singură dată; revocarea oprește colectarea. Răspunsul HTTP 500 nu declanșează lead; succesul simulat produce un singur `generate_lead`.
- Nu a fost adăugat un câmp de upsell: mesajul opțional existent poate descrie interesele. Nu există servicii bifate, abonamente activate automat sau eveniment distinct de interes în upsell.
- Testele nu au trimis lead-uri reale, nu au trimis emailuri și au interceptat scripturile de analytics în testele cu consimțământ. SMTP și secretul CAPI nu sunt configurate local; livrarea reală email/CAPI, recepția în GA4 și setările Enhanced Measurement din cont nu au fost verificate end-to-end.
- Zero erori de consolă pe cele cinci rute valide testate. Cele 12 linkuri externe din portofoliu au returnat HTTP 200.

Contrastul, culorile și focus ring-urile existente au fost păstrate. Nu există o certificare WCAG completă sau o verificare automată a contrastului tuturor textelor peste toate cadrele fundalurilor animate; acestea rămân limite explicite. Testele de mobil sunt emulări Chromium, nu verificări pe Safari/iPhone fizic.

## Performanță — laborator, nu date reale p75

Trei contexte Chromium reci, build de producție local, 390×844, user-agent normal pentru a testa traseul HTML destinat oamenilor, CPU încetinit 4×, latență 150 ms, download 1,6 Mbps. Observatori browser pentru LCP/CLS/long tasks; nu este un scor Lighthouse și nu este CrUX.

| Rulare | LCP | CLS | Long tasks cumulat |
|---|---|---|---|
| 1 | 5,636 s | 0 | 612 ms |
| 2 | 4,952 s | 0 | 583 ms |
| 3 | 5,060 s | 0 | 569 ms |

Ținta de laborator CLS este îndeplinită în aceste rulări. **Ținta LCP ≤2,5 s nu este îndeplinită** în scenariul simulat. Serverul Express local nu reproduce compresia/CDN/rețeaua de producție; cifrele nu trebuie prezentate drept p75 real sau performanță garantată clienților. INP p75 nu poate fi stabilit din aceste teste. Nu există date RUM/CrUX sau acces Search Console pentru confirmarea țintelor reale. O investigație separată de încărcare/comprimare și bundle-uri este recomandată înaintea unei afirmații comerciale de viteză; nu s-a ascuns problema prin eliminarea efectelor cerute.

În diagnosticul anterior corecției de încărcare, deplasările proveneau din anunț și din înălțimea hero-ului la apariția logo-urilor. S-a corectat implementarea acestor elemente și s-au remăsurat rezervările Suspense după modificarea textelor/FAQ. Nu s-au schimbat stilurile finale.

## Skill-uri folosite efectiv

Numele de mai jos sunt cele citite din câmpul `name` al instalării locale `C:/Users/robert/.agents/skills/<director>/SKILL.md`. Au fost aplicate pe faze, fără combinarea unor direcții estetice.

| Nume real | Utilizare |
|---|---|
| `ponytail` | Componente și dependințe existente; intervenția minimă care acoperă cerința |
| `karpathy-guidelines` | Delimitarea ipotezelor, corecții la sursă, verificări explicite |
| `copywriting` | Claritate, limbaj accesibil și formal, eliminarea afirmațiilor nesusținute |
| `offers` | Separarea ofertei inițiale de opțiuni și de garanții |
| `pricing` | Preț minim transparent, fără pachete/discounturi sau prețuri suplimentare inventate |
| `cro` | Traseu către contact, următor pas clar și formular fără câmpuri suplimentare inutile |
| `seo-audit` | Randare, metadate, rute, canonical, sitemap, robots și afirmații indexabile |
| `schema` | Graf coerent, identitate reală și diferența vocabular/eligibilitate |
| `emil-design-eng` | Păstrarea interacțiunilor și corectarea încărcării/focusului fără schimbări estetice |
| `review-animations` | Review limitat la intervenție; CSS/motion neschimbate, verificare reduced motion și carusel |
| `playwright-cli` | Verificări browser prin Playwright disponibil în proiect: capturi, dialog, rute, consimțământ și interacțiuni |
| `verification-before-completion` | Build, TypeScript, lint și probe browser înaintea concluziilor |

## Fișiere de livrare și reproducere

- [Comparație vizuală desktop/mobil](../artifacts.local/commercial/comparison.html) — hero, ofertă, portofoliu și FAQ, înainte/după.
- [Oferta și condițiile de confirmat](offer-confirmation-2026-11-04.md) — livrabile, extensii punctuale și colaborări periodice, cu limite și mecanism de ofertare.
- [Verificări principale](../artifacts.local/commercial/verification.json), [verificări extinse](../artifacts.local/commercial/extended-verification.json), [linkuri](../artifacts.local/commercial/external-links.json), [laborator](../artifacts.local/commercial/performance-lab.json).
- [Validator Schema.org](../artifacts.local/commercial/schema-validator.png), [răspuns Google Rich Results Test](../artifacts.local/commercial/rich-results.png).
- Capturi integrale și pe secțiuni: `artifacts.local/commercial/before/` și `after/`, la toate cele patru lățimi. Baseline-ul surselor și analiza modificărilor rămân local.

Comenzi: `npm run build`; `npx tsc --noEmit -p tsconfig.app.json`; ESLint pe fișierele TypeScript modificate; `node scripts/verify-commercial.mjs` cu serverul pe 4175; `node scripts/verify-portfolio.mjs` cu dev server pe 8080; `node scripts/capture-commercial-audit.mjs before|after` pentru capturi. Validările externe și diagnosticele exploratorii sunt salvate în directorul local de artefacte.

## Înainte de publicare

1. Revizuirea ofertei interne: ce poate fi livrat concret de la 1.000 €, revizii, materiale, drepturi, găzduire și costuri recurente.
2. Delimitarea garanției existente la 90 de zile și a suportului după lansare, fără inventarea sau schimbarea unilaterală a obligațiilor.
3. Confirmarea identității contractuale/fiscale și a condițiilor comerciale lipsă. Modificarea factuală din Termeni nu constituie verificare juridică.
4. Redirecturi de host/protocol la Hosterion și verificarea compresiei/performanței reale după un eventual deployment autorizat.
5. Verificarea emailului/CAPI/GA4 cu accesurile reale și, dacă se dorește, reluarea Rich Results Test într-o sesiune autentificată.

Nu există promisiune de poziții Google, clasare SEO 100, recomandări AI, conversie universală sau recuperare garantată a investiției. Proprietarul a solicitat ulterior publicarea versiunii pregătite. Aceasta nu confirmă implicit condițiile comerciale încă nedelimitate în raportul intern.

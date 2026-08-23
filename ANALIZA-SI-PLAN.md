# ANALIZĂ + PLAN DE ÎMBUNĂTĂȚIRE — alcaziurobert.ro

> Fișier de memorie de lucru. Se actualizează pe măsură ce lucrăm.
> Regula de aur: NU stricăm designul existent — îl rafinăm și îl facem să convertească.
> Ultima actualizare: 2026-07-02

---

## 1. CE VINDE SITE-UL (contextul de business)

- **Cine:** Alcaziu Robert — senior solo operator, web/growth builds premium.
- **Ce:** site-uri/funnel-uri construite să convertească (nu doar să arate bine), CRO, automatizări, SEO/AEO/GEO, tracking server-side.
- **Cui (ICP):** (1) branduri premium/personale care vor să pară exclusive; (2) business-uri fără site sau cu site slab/lent/generic; (3) business-uri care rulează deja ads dar site-ul nu convertește.
- **Funnel:** ad Meta/IG → landing (site-ul acesta) → formular calificare buget → discovery call → close.
- **Poziționare:** premium/exclusiv, anti-„AI slop", anti-agenție generică. Scarcity reală: solo, max 4 clienți simultan.
- **Formula ofertei (de reflectat în hero):** [outcome premium specific] + [garanție/risk-reversal] + [~4 săptămâni] + [audiență] + [scarcity] + [proof real].
- **Proof real disponibil:** conversie 1.4%→3.8% (Kickout), load 6s→1.1s + bounce -38% (Picaps), 7 lead-uri organice/30 zile (R-Draw), proiect guvernamental €8K+ (OCPI).
- **Global:** default EN (corect), RO secundar. Migrare viitoare .ro → .com.
- **Brand:** orange `#ED5C1B`, font General Sans, alb + accente orange.

## 2. STRUCTURA REALĂ A SITE-ULUI

Stack: Vite + React 18 + TS + Tailwind + shadcn/ui + i18next (EN/RO, default EN) + react-hook-form/zod + motion/react. Rute lazy-loaded: `/`, `/studii-de-caz`, `/termeni-si-conditii`, `/politica-de-confidentialitate`, `*`.

Ordinea secțiunilor pe landing (`src/pages/Index.tsx:91-127`):

| # | Secțiune | Fișier | Rol | CTA? |
|---|----------|--------|-----|------|
| 1 | Navbar | `Navbar.tsx` | logo + 1 link + lang switch | ✗ |
| 2 | Hero | `Hero.tsx` | headline + LiquidMesh WebGL | ✓ Start Convert / Case Studies |
| 3 | PremiumPartners | `PremiumPartnersSection.tsx` | logo marquee (Cloudflare, Meta, LinkedIn, Google) | ✗ |
| 4 | Frictionless | `FrictionlessSection.tsx` | 1 paragraf poziționare | ✗ |
| 5 | Difference | `DifferenceSection.tsx` | timeline Week 1→4+ | ✗ |
| 6 | Humanoid (=Portofoliu) | `HumanoidSection.tsx` | carusel scroll-pinned, 11 proiecte | link-uri externe |
| 7 | Compounding | `CompoundingSection.tsx` | „Why does this work?" with/without me | ✗ |
| 8 | Testimonials | `TestimonialsSection.tsx` | 9 testimoniale, 3 coloane marquee | ✗ |
| 9 | FAQs | `FaqsSection.tsx` | doar 3 din 7 întrebări | ✗ |
| 10 | GetInTouch | `GetInTouchSection.tsx` | `#contact` + ContactForm | ✓ formular |
| 11 | MadeByHumans | `MadeByHumans.tsx` | footer LiquidMesh, tel/email/legal | ✓ tel/email |
| + | MobileBottomBar | `MobileBottomBar.tsx` | FAB mobil (call/email/mesaj) | ✓ |

**Formular** (`ContactForm.tsx`): progresiv — name → phone+email → budget (€1500-3000 / €3000-5000 / €5000+ / discuss) → submit → `POST /api/contact` → nodemailer SMTP → contact@alcaziurobert.ro. Pe mobil: Drawer prin `ContactCTA`. Backend: `api/contact.ts` (Vercel) + `server.js` (Express).

**Copy:** sursa de adevăr = `src/locales/en.json` + `ro.json` (~494 linii fiecare, paralel complet).

## 3. PROBLEME GĂSITE (audit conversie + conținut)

### Critice pentru conversie
1. **ZERO tracking** — fără FB Pixel, fără Conversions API, fără GA4. Rulezi ads fără să poți optimiza pe Lead. (Privacy Policy zice „no marketing tags" — de actualizat împreună cu implementarea.)
2. **Hero amputat** — `hero_v2.subtitle`, `.scarcity` („Solo, max 4 clienți"), `.rating_count` sunt scrise în locale dar NErandate. Hero afișează doar headline-ul. Formula ofertei nu e vizibilă.
3. **Metrici portofoliu nerandate** — `portfolio.metrics.*` (Conversion 4.2% vs 1.8% avg, LCP 1.1s, CWV 100×4) există în json, cardurile arată doar titlu+link.
4. **CTA-uri rare** — între Hero și #contact: zero CTA intermediar pe desktop. 8 secțiuni fără niciun buton.
5. **Doar 3/7 FAQ-uri afișate** (`FaqsSection.tsx:12`) — obiecțiile q1,q3,q5-q7 rămân netratate.
6. `projectType` în schema formularului dar fără UI — se trimite mereu „website".
7. Navbar fără CTA (doar link „Our Approach" + lang switch).

### Igienă
8. ~14 componente orfane (Features, GlobeSection, PainpointsSection, ManifestoSection, TechStackSection, WhyCloudflare, CFFortuneSection, IntroLanding, CadastreGrid etc.) + copy dormant în locale.
9. CLAUDE.md stale (descrie template-ul Lovable vechi, nu site-ul real).
10. Prețuri doar EUR (€1500+ entry) — de confirmat alinierea cu oferta 4500 RON.

### Design/responsive (Agent 2 — finalizat)

**P0 — funcțional/UX:**
- **Sistemul de animații scroll-reveal e MORT**: `Index.tsx:47-66` observă `.animate-on-scroll`, dar NICIUN element nu are clasa asta → ~6 secțiuni apar brusc, fără animație de intrare, în timp ce Hero/GetInTouch/marquee-urile au motion. Poveste de motion inconsistentă.
- **Zero navigație pe mobil**: singurul link din Navbar e `hidden md:flex` (`Navbar.tsx:108`), fără hamburger. Pe mobil navbar = logo + lang switch.
- **Caruselul de portofoliu (HumanoidSection) e cel mai fragil pe mobil**: scroll-jacked, sticky `100vh` + matematică pe vh + re-măsurare la resize = combinația clasică de jank pe iOS Safari.

**P1 — fragilitate/polish:**
- **Touch target minuscul**: butoanele EN/RO ≈ 24-26px înălțime (`LanguageSwitcher.tsx:48-49`) — sub ghidul de 44px; sunt singurul element interactiv din nav pe mobil.
- **CTA bay din Hero** e absolut poziționat + transform peste marginea cardului (`Hero.tsx:69-72`) — risc de coliziune cu copy mai lung (RO) + salturi la show/hide URL bar mobil.
- **3 orange-uri de brand diferite**: `#ED5C1B` inline (cel real) vs `pulse-500 #f97316` (Tailwind, mort) vs shadcn `--primary ≈ #e2571f` — focus rings/butoane shadcn din formular NU se potrivesc cu orange-ul site-ului. Vizibil pe ContactForm.
- **Breakpoint mobil inconsistent**: 600/640/767/768/380 amestecate → benzi de viewport (600-640, 767-768) unde secțiunile nu cad de acord.

**P2 — mentenanță:**
- Stiluri per-secțiune în `<style>` inline cu hex hardcodat; utilitarele din `index.css` (`.section-title` etc.) și `shadow-elegant` nefolosite; `.section-title` chiar contrazice scala live (40px vs 48px cap).
- Dark mode definit complet dar niciodată activat (fără provider/toggle) — greutate moartă.

**Puncte forte design:** scala tipografică randată e consistentă (`clamp(1.8rem,4.6vw,3rem)` titluri, `clamp(1.05rem,1.5vw,1.3rem)` body), ritm de padding consistent pe secțiunile-card (`clamp(48px,6vh,80px)`), guard-uri globale anti-overflow orizontal bune, `prefers-reduced-motion` respectat aproape peste tot, MobileBottomBar bine construit (safe-area, IntersectionObserver), footer cu touch targets 48px.

**P3 — curățenie:** `App.css` neimportat (CSS de robot din template), lanț nav mort (`header/mobile-nav/logo/portal` — conține un hamburger funcțional refolosibil!), `GlobeSection/cobe`, ~10 alte componente moarte, ~38 primitive shadcn nefolosite, `pulse`/`brockmann`/`playfair` aliasuri moarte, `dist/` comis, ~18 assets orfane în public/.

### Performanță/assets (Agent 3 — finalizat)
- **[REZOLVAT] `/logo.svg` inexistent** dar referențiat de 3× în index.html (boot loader, preload, JSON-LD) → imagine spartă la fiecare primă vizită. Fix: înlocuit cu `/favicon.ico`.
- **[REZOLVAT] og:image URL relativ** → preview sparte la share/ads pe Facebook. Fix: URL absolut.
- **[REZOLVAT] Lipsă vercel.json** → deep links (/studii-de-caz) pot da 404 la refresh pe Vercel. Fix: rewrites SPA (exclude /api).
- ~1.8MB assets orfane în public/ (ocpi.png 400KB, GV.png 298KB, cadastru...png 256KB, dubluri *-logo.png). ATENȚIE: `plane (1).png` NU e orfan — e referențiat URL-encoded (`/plane%20(1).png`) în CompoundingSection.
- Imagini mari de optimizat: picaps3.webp 413KB, Header-background.webp 245KB, gov.png 205KB (PNG→WebP), plane.png 119KB, unbacde-10.png 104KB. Există deja `scripts/optimize-images.mjs` + sharp.
- Scriptul Lovable `cdn.gpteng.co/gptengineer.js` e în producție — de scos DOAR dacă Robert nu mai editează în Lovable (altfel se rupe editorul vizual).
- Font Fontshare render-blocking (fără preload woff2 / self-host).
- Dependencies moarte: lottie-react, gsap, @gsap/react, date-fns, recharts, @tanstack/react-query (provider fără queries).
- Clutter în repo: alcaziurobert-deploy.zip 4.3MB, build.zip 2.3MB, dist/ comis, 2 lockfiles (bun + npm), fișier `nul`.
- favicon.ico 41KB (mare); fără manifest/apple-touch-icon dedicat.
- Puncte forte: lazy-loading pe rute + secțiuni cu Suspense placeholders (CLS≈0), manualChunks bine gândite, env doar server-side.

## 4. PLAN DE IMPLEMENTARE (prioritizat pe conversie)

**Faza 1 — Funnel & mesaj — ✅ IMPLEMENTAT (2026-07-02)**
- [x] Hero complet: pill scarcity („Solo. Max 4 clients at a time." cu dot pulsant) + subtitle alb pe card orange + reveal eșalonat (`Hero.tsx` — stilurile existau deja în CSS, doar nu erau randate).
- [x] Copy fix: EN „Build to convert" → „Built to convert" (greșeală gramaticală); subtitle rescris pe formula ofertei: „Site, funnel, tracking and ads — built end-to-end by one senior partner. Live in about 4 weeks." (EN+RO); „Start Convert" (engleză ruptă) → „Start converting" / „Începe să convertești".
- [x] Navbar: buton CTA orange pill `nav.cta` pe TOATE viewport-urile (pe mobil deschide drawer-ul; înainte navbar-ul mobil nu avea NIMIC interactiv în afară de lang switch).
- [x] `ContactCTA` îmbunătățit: pe pagini fără #contact (ex. /studii-de-caz) navighează la home cu scrollTo state.
- [x] Metrici pe cardurile de portofoliu (`ww-card-metric`, derivat labels→metrics) + stiluri compacte mobile ca să nu strice geometria caruselului.
- [x] FAQ: toate cele 8 întrebări, ordonate pe obiecții (preț → de ce → durată → proces → mentenanță → ownership → securitate → tech) + link email `faq.cta`.
- [x] CTA după Compounding (sub takeaway „One new client covers the whole build") și după Testimoniale („Request discovery call") — ambele prin ContactCTA.
- [x] Formular: select Project type vizibil (era în schemă+backend dar fără UI), titlu pas 3, microcopy „Reply within 24 hours." lângă submit.

**Faza 2 — Motion & polish — ✅ IMPLEMENTAT (2026-07-02)**
- [x] Sistem scroll-reveal NOU: `src/components/Reveal.tsx` (IntersectionObserver per-instanță, transition-based, se termină în `transform: none` ca să nu strice sticky) + CSS în index.css. Aplicat în: Frictionless, Difference (staggered pe items), PremiumPartners, Compounding (staggered), Testimonials header, FAQ header. Observer-ul mort din Index.tsx eliminat (rula înainte de mount-ul secțiunilor lazy).
- [x] shadcn `--primary`/`--ring` aliniate la orange-ul exact de brand #ED5C1B (era #e2571f — focus rings-urile din formular nu se potriveau).
- [x] Touch targets lang switcher: 24px → 36px pe mobil, 30px desktop.

**Faza 3 — Tracking & deploy — ✅ IMPLEMENTAT (2026-07-02)**
- [x] Meta Conversions API server-side în `api/contact.ts`: eveniment `Lead` cu em/ph hash SHA-256, IP+UA pentru match quality, custom_data buget+tip proiect. **Gated pe env `FB_PIXEL_ID` + `FB_CAPI_ACCESS_TOKEN` — no-op până le setezi în Vercel.** `.env.example` documentat. Fără cookies, fără pixel client → nu necesită banner; DAR Privacy Policy trebuie actualizată înainte de activare (secțiunea 4 zice „no marketing tags").
- [x] `/logo.svg` 404 fix (boot loader + preload + JSON-LD → favicon.ico).
- [x] og:image absolut (critic pt. preview în Meta ads).
- [x] `vercel.json` cu SPA rewrites (exclude /api).

**Verificat**: `npm run build` ✓; QA vizual live cu browser headless pe desktop 1440px + mobil 390px: hero, compounding+CTA, testimoniale+CTA, FAQ complet, formular stage 1→3 cu focus ring on-brand, drawer mobil din navbar CTA, metrici pe carduri fără clipping. Screenshot-uri în scratchpad-ul sesiunii.

**Faza 4 — BACKLOG (următoarea sesiune)**
- [ ] Optimizare imagini: rulat `scripts/optimize-images.mjs` (sharp există): picaps3.webp 413KB↓, gov.png/plane.png/unbacde-10.png → WebP; apoi actualizat referințele.
- [ ] Ștergere ~1.8MB assets orfane din public/ (LISTĂ în §3; NU șterge `plane (1).png` — e folosit URL-encoded!). Șters zip-urile din root (6.6MB), dist/ din git, un lockfile.
- [ ] Ștergere componente moarte (~14: Features, GlobeSection, PainpointsSection, ManifestoSection, TechStackSection, WhyCloudflare, CFFortuneSection, IntroLanding, CadastreGrid, header/mobile-nav/logo/portal, App.css) + deps moarte (gsap, lottie-react, date-fns, recharts, react-query) — DOAR cu build+QA după.
- [ ] Font: preload/self-host General Sans (scoate render-blocking-ul Fontshare).
- [ ] Decizie Robert: scoatem scriptul Lovable din producție? (se rupe editarea vizuală în Lovable dacă da)
- [ ] Decizie Robert: activare CAPI (setezi FB_PIXEL_ID + FB_CAPI_ACCESS_TOKEN în Vercel) + actualizare Privacy Policy secțiunea marketing tags.
- [ ] Decizie Robert: aliniere preț intrare — formularul începe la €1500-3000; oferta discutată era 4500 RON (~€900). De reconciliat.
- [ ] La migrarea .ro → .com: actualizat canonical, og:url, JSON-LD, sitemap, CAPI event_source_url, email-uri.
- [ ] Opțional conversie: buton „Case Studies" din hero e secundar OK; de testat A/B headline-ul; de luat în calcul un mini-strip de proof (3 metrici) în hero.

## 5. REDESIGN ULTRA-PREMIUM (2026-07-02, sesiunea 3) — IMPLEMENTAT

Robert a cerut redesign complet: hero, banda de logo-uri, secțiunile de text și portofoliul arătau neprofesional. Referințe analizate live: leadprinter.ai (dark cinematic, stats uriașe, garanție în subhead) + blueads.ro (nav complet). Decizii Robert: hero dark cinematic / fără poză personală / formular în hero dreapta / portofoliu featured+grid.

**Ce s-a construit:**
- **Hero v3** (`Hero.tsx` rescris): ink #121212 + glow orange CSS (LiquidMesh scos din hero — rămâne doar în footer; chunk-ul WebGL nu se mai încarcă la LCP). Stânga: pill scarcity, headline uriaș „Websites built / *to convert.*" (accent orange italic), subtitle, proof row cu hairlines (11 projects · 1.4%→3.8% · reply 24h), CTA button-in-button + „See the work ↓". Dreapta (≥1024px): **formularul de calificare într-un card alb** cu shell double-bezel — montat condiționat cu `useMediaQuery` sincron + lazy chunk (`HeroContactCard.tsx`); pe mobil nu se montează deloc (drawer-ul rămâne calea).
- **Navbar v2**: variantă dark transparentă peste hero (text alb, logo pe chip alb) → pill alb la scroll; link-uri ancoră Work/Process/Results/FAQ + Our Approach; funcționează și de pe alte rute (navigate + scrollTo state).
- **StatsBandSection** (nou): 3.8% / 1.1s / −38% cu etichete orange small-caps + rând de wordmark-uri clienți reali (a înlocuit onest marquee-ul înșelător cu logo-uri de platforme).
- **StatementSection** (nou): declarația editorială cu accente orange inline (reutilizează `frictionless.subtitle`, pill→text accent).
- **ProcessSection** (nou, `#process`): 01–05 rânduri numerotate cu hairlines (Week 1 Find the leaks → Ongoing Compound growth), chei noi `process.*` EN+RO.
- **SelectedWorkSection** (nou, `#work`): featured OCPI (ramă browser CSS, badge, 3 chips, View live) + grid 2 col × 8 proiecte color în rame de browser cu domenii, metrici, arrow-chip hover. Scroll normal — scroll-jack-ul a dispărut definitiv (și fragilitatea iOS cu el).
- **Curățenie**: șterse HumanoidSection, PremiumPartnersSection, FrictionlessSection, DifferenceSection. `ContactCTA` încarcă acum formularul lazy (react-hook-form nu mai e în bundle-ul eager). theme-color → #121212. Voce singular („Tell me...", „Răspund în 24h") în formular.
- **i18n**: namespace-uri noi `hero_v3`, `stats`, `statement`, `process`, `work`, `nav.work/process/results/faq` — EN+RO complete.

**Verificat**: build ✓ (LiquidMesh/RHF în chunk-uri lazy), QA browser desktop 1440 (hero+form, navbar dark→alb, stats, process, featured+grid, formular hero: name→contact→tip+buget ✓) + mobil 390 (hero text+CTA full-width, `hero-form-mounted: false` ✓, grid 1-col, FAB ✓) + RO cu diacritice ✓.

**De făcut data viitoare (rămase din Faza 4 + noi):**
- [x] Optimizare imagini — FĂCUT 2026-07-02 (6): script rulat (7 PNG→WebP, 1756KB→397KB, −77%) + picaps3.webp recomprimat 413→218KB (1920→1600px, q78). Referințe actualizate: SelectedWorkSection `/gov.webp`, CompoundingSection `/plane%20(1).webp`, GetInTouchSection `/plane.webp`. PNG-urile vechi + ocpi/GV/cadastru webp-uri noi sunt încă în public/ (curățenia = itemul următor). Build ✓, QA browser: toate 4 imaginile randează, zero 404.
- [ ] Ștergere assets orfane (~1.8MB + acum și logos/ de platforme nefolosite pe home: LI-Logo, google maps, logos/*).
- [ ] Componente moarte rămase din template (Features, GlobeSection etc. — lista în §3) + deps moarte.
- [ ] Screenshot nou pentru unbacde10/travel-twin dacă Robert vrea 10 proiecte în grid (acum sunt 8 + featured).
- [ ] Deciziile Robert: activare CAPI (env în Vercel + Privacy Policy), scriptul Lovable în producție, alinierea prețului de intrare, migrarea .ro→.com.

## 6. JURNAL DE LUCRU

- **2026-07-03 (8)**: **Pass /polish pe tot site-ul** (după conversia la light). Găsite și reparate: **(a)** 240px de scroll mort sub footer — hack-urile de overscroll iOS (`.mbh-section::after` + `.hero3::before` cu ±240px) creau spațiu scrollabil real; șterse ambele, înlocuite cu `background-color:#FCFBF9` pe `html` în `src/index.css` (canvas-ul acoperă rubber-band-ul nativ). **(b)** Featured OCPI afișa doar stema guvernului (`gov.webp`) — placeholder slab pentru piesa flagship; făcut screenshot LIVE la sgc.ocpict.ro cu browse (login navy + „Dezvoltat de Alcaziu Robert") → `public/sgc-live.webp` (16.6KB), referință schimbată în `SelectedWorkSection.tsx`. **(c)** Cardul de formular din `#contact` era gol vizual (doar câmpul Name plutind) — adăugat același header ca în hero card (`hero_v3.form_title/form_note`, EN+RO existau deja). **(d)** RO: „Abordarea noastră" se rupea pe 2 rânduri în navbar — `white-space:nowrap` pe `.nav-link`. **(e)** Spam-ul de consolă (455KB!) de la lovable-tagger: `data-lov-id` injectat pe `Fragment` în `testimonials-columns-1.tsx` — refactor la `flatMap` + string-uri simple, zero Fragment-uri taggabile; consola e curată acum. **(f)** `DESIGN.md` rescris la sistemul light-only. Verificat: build ✓, QA desktop 1440 (hero, work+featured nou, testimoniale, contact EN+RO, footer flush la viewport) + mobil 390 full-page ✓. Rămas cunoscut: thumbnail-urile picaps/kickout sunt B&W nativ (conținutul clientului, nu bug); „Abordarea noastră/Our Approach" e voce plural într-un brand singular — de discutat cu Robert.
- **2026-07-03 (7)**: **REVERT COMPLET LA LIGHT** — Robert a decis că negrul „arată oribil": scos TOT ink-ul, inclusiv hero (răstoarnă decizia „dark cinematic" din §5 și „sandvișul dark" din intrarea (5)). Modificat: `Hero.tsx` (bg `#fff→#FAF8F6`, glow orange redus la 0.10/0.05, titlu `#121212`, pill/sub/proof/secondary pe ink-alpha, card-shell bezel `rgba(38,38,38,…)` + shadow soft), `HeroContactCard.tsx` + `GetInTouchSection.tsx` `.touch-form` (border hairline `rgba(38,38,38,0.06)` ca să nu se topească albul în alb), `Navbar.tsx` (șters `overDark` + tot CSS-ul `.nav-dark` — navbar-ul e mereu light), `GetInTouchSection.tsx` (secțiunea `#contact` pe `#fff→#FAF8F6`, glow whisper, titlu ink), `MadeByHumans.tsx` (footer pe `#FAF8F6`, cardul orange mesh plutește pe deschis; coverele iOS overscroll actualizate la culorile noi), `index.html` theme-color `#121212→#ffffff`. Build ✓; QA browser 1440px: hero/contact/footer toate light, formulare lizibile, navbar OK. Notă tehnică QA: daemonul browse pierde starea între invocări bash pe Windows — folosește `$B chain` cu `[["goto",…],["wait","#contact"],…]` + `js "new Promise(r=>setTimeout(r,2500))"` pe post de sleep; path-uri screenshot în format Windows (`C:/…`), nu POSIX.
- **2026-07-02 (6)**: Optimizare imagini (Faza 4 item 1). `scripts/optimize-images.mjs` rulat: cadastru/gov/GV/ocpi/plane (1)/plane/unbacde-10 PNG→WebP (1756→397KB, −77%). picaps3.webp recomprimat separat prin sharp (413→218KB; sharp ține sursa deschisă — scris în .tmp apoi Move-Item). Referințe schimbate în SelectedWorkSection.tsx (gov.webp featured), CompoundingSection.tsx (plane%20(1).webp), GetInTouchSection.tsx (plane.webp). Build ✓; QA cu /browse pe :8080 — toate imaginile `complete && naturalWidth>0`, zero 404. Notă: warning-ul din consolă (data-lov-id pe React.Fragment în testimonials-columns-1.tsx) e de la lovable-tagger, dev-only, pre-existent. Următorul pas: ștergere PNG-uri vechi + assets orfane (~1.8MB) din public/.

- **2026-07-02 (1)**: Analiză completă cu 3 agenți paraleli (conținut/funnel, design/responsive, performanță/assets). Constatări în §3.
- **2026-07-02 (2)**: Implementat Fazele 1-3 (funnel, motion, tracking scaffold, fix-uri infra). Build ✓, QA vizual desktop+mobil ✓. Detalii în §4.
- **2026-07-02 (3)**: REDESIGN ultra-premium complet (hero dark cu formular, stats band, process numerotat, portofoliu editorial, navbar v2). Detalii în §5. Cum reiei: citește §5 „De făcut data viitoare".
- **2026-07-02 (5)**: **„Sandvișul dark"** — Robert a întrebat dacă n-ar fi mai bine tot site-ul negru; recomandarea mea (documentată): nu tot (cititul lung + formularele + screenshot-urile luminoase performează pe alb), ci dark bookends. Implementat: `GetInTouchSection` (#contact) pe ink `#121212→#171512` cu glow orange în oglindă cu hero-ul, titlu/descriere albe, formularul în shell double-bezel identic cu hero-ul; `MadeByHumans` footer pe ink `#171512` (cardul orange mesh plutește pe negru) + cover pentru overscroll-ul de jos pe iOS. Structura finală: dark (hero) → alb (proof/citit/decizie) → dark (contact+footer). Dacă Robert vrea totuși TOT negru: de convertit Stats/Statement/Process/Work/Testimonials/FAQ — atenție la glare pe screenshot-urile din portofoliu și la lizibilitatea FAQ/testimoniale.
- **2026-07-02 (4)**: Pass /impeccable + motion-dev (perspectiva vizitatorului din reclamă): **count-up pe cifrele de proof** (`CountUp` în StatsBandSection, motion/react `animate` + `useInView`, o singură rulare, valoare finală directă la reduced-motion); **blur-up cinematic pe headline-ul hero** (`hero3-fade-blur`); **glow „respirând"** subtil în hero (9s); **puls de atenție pe cardul de formular** când vizitatorul apasă „Start converting" (ring orange care se disipă + focus direct în câmpul Nume — verificat: `focused: name`). Fix anti-AI-scaffolding din registrul brand al skill-ului: kicker-ele pill repetate deasupra fiecărei secțiuni au fost de-pill-uite (text simplu orange small-caps), Statement a rămas fără kicker (declarația stă singură). Creat `PRODUCT.md` + `DESIGN.md` la rădăcină (context permanent pentru skill-urile de design — impeccable le cere). Build ✓.

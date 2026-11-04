# Hero, servicii și VSL — 4 noiembrie 2026

## Intervenția aprobată

Hero centrat cu vizual 3D original și transparent, fundalul albastru existent, titlu scurt, preț minim vizibil, buton lat către ofertă și trei servicii ilustrate. Navbar-ul continuă să deschidă formularul. SGC OCPI și Black Sea GIS rămân proiectele principale, urmate de caruselul existent. FAQ rămâne la cinci întrebări.

SEO, GEO și AEO sunt prezentate ca intervenții tehnice și editoriale cu o bază comună. Volumul se stabilește în ofertă; nu există promisiuni de poziții sau recomandări AI. Entitatea Service existentă a fost actualizată, fără duplicare. Metadatele homepage-ului și paginii de abordare sunt sincronizate în română și engleză.

## Ce am preluat din analiza afacere.ai

Am analizat [homepage-ul](https://afacere.ai/), [AI Fast-Track](https://afacere.ai/ai-fast-track) și [Kit Primul Client AI](https://afacere.ai/kit), inclusiv pagina redată în browser.

Pe homepage, promisiunea este urmată de un video scurt, dovezi, explicații ale ofertei, obiecții și solicitarea de contact. Programele secundare au pagini și oferte distincte. Acestea sunt observații despre structură, nu dovezi independente ale rezultatelor sau conversiei competitorului.

Adaptarea pentru Alcaziu Robert folosește prezentarea serviciilor, proiecte publice și delimitarea costurilor. Credibilitatea vine din implementări verificabile; nu au fost adăugate ratinguri, clienți fictivi, garanții financiare, reduceri sau cifre ale competitorului. Nu a fost copiat modelul lor de cursuri sau de aplicație cu zece întrebări.

## Oferta și opțiunile

| Opțiune | Cui îi este utilă | Ce se poate livra | Tipul colaborării și limite |
| --- | --- | --- | --- |
| Proiect inițial, de la 1.000 € | Afaceri care au nevoie de o prezență web clară | Design, dezvoltare și funcționalitățile definite în ofertă | Cost individual; număr de pagini, materiale, revizii, termen și accesuri convenite înainte de start |
| Vizibilitate | Afaceri cu informații și pagini de îmbunătățit | Indexabilitate, structură, date structurate, conținut și răspunsuri pentru SEO/GEO/AEO | Intervenție tehnică/editorială cu volum convenit; fără abonament de monitorizare AI implicit |
| Campanii | Afaceri pregătite să atragă trafic către pagini relevante | Administrare Google Ads/Meta Ads | Periodic, ofertat separat; bugetul media separat de administrare; durată și volum convenite |
| Măsurare și optimizare | Afaceri cu acțiuni relevante de urmărit | Evenimente, rapoarte și analiza parcursului către contact | Configurare punctuală, analiză la cerere; limitele consimțământului și datelor; experimente doar cu trafic suficient |
| Întreținere și extindere | Website-uri care evoluează după lansare | Pagini, limbi, integrări, mentenanță și actualizări de conținut | Extensii punctuale sau mentenanță periodică; frecvență și volum în ofertă; defectele propriei implementări nu devin upsell |

Prețurile extensiilor nu sunt inventate. Nu există un pachet universal de 1.000 €. Prețul nu este adăugat în schema ca ofertă fixă. Rămân valabile punctele comerciale de clarificat în `offer-confirmation-2026-11-04.md`: pagini exacte, revizii, materialele clientului, drepturi, găzduire/licențe, limite de suport și condițiile detaliate ale garanției existente. Textul garanției existente nu a fost amplificat.

## VSL

- 77,37 secunde; 1280×720, MP4 H.264/AAC, 1.844.017 bytes.
- Șase scene: claritatea ofertei, website și contact, proiectele SGC/BSGIS, căutări moderne, extensii opționale, preț și solicitare.
- Imagini proprii existente și capturi reale din portofoliu; nicio imagine de la competitor.
- Narațiune sintetică generică în română, Microsoft `ro-RO-EmilNeural`; nu imită vocea lui Robert. Fără muzică sau prezentator fictiv.
- 16 subtitrări WebVTT și transcriere integrală accesibilă. Interfața engleză identifică explicit limba română a prezentării.
- Fișierul MP4 este atribuit numai după Play. Fără autoplay, servicii externe în player sau al doilea sistem de analytics.
- Surse de producție: `artifacts.local/hero-funnel/make-vsl.py`, `render-vsl.mjs`, `vsl/scenes.json` și cadrele locale. Uneltele Python/FFmpeg sunt izolate în `artifacts.local/video-tools`; nicio dependență nouă în proiect.

## Imagini originale

Vizualul de hero a fost generat cu `imagegen`, cu alpha real: browser din sticlă și metal, elemente abstracte de website și o lupă albastră. Cele trei iconuri reprezintă website, căutare și module de aplicație. Fără logo-uri ale platformelor, rezultate simulate sau cifre decorative.

Surse PNG în `C:/Users/robert/.codex/generated_images/01a1a756-e454-7cc0-b755-3afa73081cad/`:

- Hero: `exec-d13c8bdd-846f-4e44-9e44-58ae97d26b12.png`.
- Website: `exec-6c635688-8fd0-4608-919a-40b6f6e3b19a.png`.
- Căutare: `exec-19edfda1-ebf4-4b8c-9cf0-b9176c0725ea.png`.
- Aplicații: `exec-0dac4ecd-948b-4f8d-bfd6-ed1767e921c5.png`.

Livrare WebP: hero 480/960 px, iconuri 160 px; dimensiuni rezervate în HTML. Ilustrațiile transparente existente din corpul paginii au rămas aceleași.

## Verificări

Build Vite și prerandare a celor cinci rute, TypeScript și ESLint pentru fișierele modificate. Testele comerciale verifică formularul cu răspunsuri HTTP simulate, evenimentele existente, retragerea consimțământului, metadata unică, sitemap, robots, redirect canonic, HEAD și 404.

`scripts/verify-hero-funnel.mjs`: 360×640, 390×844, 768×1024, 1440×900; CTA vizibil, scroll sub navbar, focus prin tastatură, cinci FAQ, trei servicii, video funcțional și 16 subtitrări, lipsa încărcării MP4 înainte de Play, lipsa overflow-ului și a erorilor JS, zoom 200%, interfață engleză. Evenimentele `explore_services`, `video_start`, `video_complete`, `view_service_options` sunt distincte de solicitarea ofertei, nu includ date personale și folosesc consimțământul Performance existent.

Schema Markup Validator: **nicio eroare, niciun avertisment** pentru graful actual. Google Rich Results Test a primit codul, dar a returnat „Something went wrong / Log in and try again”; eligibilitatea Google nu este confirmată. Graful Service nu este o promisiune de rich result. Referință editorială: [Google Search Central — AI features](https://developers.google.com/search/docs/appearance/ai-features), care menține principiile SEO și nu cere o schemă specială pentru apariții AI.

Capturi comparabile înainte/după: `artifacts.local/hero-funnel/before/hero-{360,390,768,1440}.png` și `after/hero-{360,390,768,1440}.png`. Capturi VSL, opțiuni, zoom și engleză în același folder `after`.

### Review motion

| Înainte | După | Motiv |
| --- | --- | --- |
| Scroll nativ smooth inclusiv cu reduced motion | Salt imediat când reduced motion este activ | Respectă preferința vizitatorului |
| Offset fix 80/100 px | Înălțimea barei + navbar + 16 px | Titlul destinației rămâne vizibil |
| Text de hero introdus progresiv | Titlu, preț și acțiune imediat vizibile | Mesajul esențial nu depinde de animație |

Shaderul și motion-ul existent al portofoliului sunt păstrate. Noile iconuri sunt statice; detaliile se deschid nativ, fără animații suplimentare.

## Skill-uri folosite efectiv

`ponytail` și `karpathy-guidelines`: intervenție limitată și reutilizarea componentelor. `offers` și `cro`: ofertă, credibilitate, opțiuni și parcurs către contact. `emil-design-eng` și `review-animations`: finisarea interacțiunilor și reduced motion. `imagegen`: cele patru asset-uri originale. `video`: scenariu, vizualuri, narațiune și subtitrări. `playwright-cli`: verificări în browser folosind instalarea Playwright existentă. `verification-before-completion`: dovezi de build, teste și verificări înainte de publicare.

## Limite

SMTP și Meta CAPI nu sunt configurate local; nu s-au trimis cereri reale. Validarea formularului și contractul HTTP sunt testate cu mock, nu livrarea efectivă a emailului. Testele sunt în Chromium, nu pe dispozitive iOS/Safari fizice. Nu există date reale p75 pentru LCP/INP/CLS sau dovezi de creștere a conversiei; măsurătorile locale sunt exclusiv de laborator. Garanțiile și volumele comerciale exacte rămân cele agreate individual, fără condiții noi inventate.

Măsurare locală Chromium 390×844, CPU ×4, 150 ms latență, 1,6 Mbps, trei contexte reci: LCP 4.916 / 4.928 / 4.984 ms; CLS 0 în fiecare rulare. Ținta LCP ≤2,5 s nu este atinsă în acest scenariu. INP și datele reale p75 nu au fost măsurate.

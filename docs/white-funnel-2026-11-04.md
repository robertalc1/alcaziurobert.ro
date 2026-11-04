# White 3D visual funnel — 2026-11-04

The owner explicitly requested a more visual funnel, white 3D artwork, wider compositions, very short copy and a separate panoramic section. This supersedes the earlier instruction against layout changes in these areas; the brand identity and hero composition remain.

The reference is [Apple's Romanian iPhone page](https://www.apple.com/ro/iphone-18-pro/). The implementation adopts its short image-panel messages and alternating paired/wide presentation. No Apple artwork, logos, product claims or website text were reused.

## Implemented

- Two white 3D panels: “Design care explică.” / “Contact fără ocolișuri.”
- Panoramic search bridge after the real project portfolio: “Ajungeți la oamenii potriviți.”
- The flow is visual benefit → individually quoted services → actual projects → optional discovery services → collaboration assurances → enquiry → five FAQs.
- Main visible desktop copy reduced from 841 to 436 words in the same browser setup (about 48%). Expanded FAQ answers are not included in this count.
- Removed the numbered service/process presentation and redundant CTA/guarantee repetition. The existing guarantee wording remains in the fifth FAQ answer; no commercial obligation was invented or modified.
- Starting price, optional services, consent requirements and separate media/management costs remain explicit.
- Captions are HTML, not baked-in headings, so they are accessible, responsive and translated. Illustrative screens contain a few Romanian words; these are not real client screenshots or search results.
- Existing font, palette, hero, button system, portfolio, animations, form and consent remain. No new dependencies.

## Assets and generation

Built-in image_gen tool used for all three artworks. A targeted image_gen edit removed an invented navbar symbol and inaccurate domain from the first generated browser image. All chosen outputs were saved in the project; Sharp only resized/encoded WebP copies.

- `public/visuals/website-3d-white-640.webp` and `website-3d-white-1280.webp`
- `public/visuals/contact-3d-white-640.webp` and `contact-3d-white-1280.webp`
- `public/visuals/bridge-3d-white-768.webp` and `bridge-3d-white-1536.webp`

Width/height reserved, lazy loading, responsive srcset. Approximately 80 KB for all three smaller files or 217 KB for all larger files. These are illustrative scenes, not proof of commercial results.

## Verification

- Production build and prerender: five routes.
- TypeScript and scoped ESLint passed.
- Browser checks at 360, 390, 768 and 1440px: three loaded illustrations, five FAQs, one H1, correct section order, no horizontal overflow, no page errors, CTA dialog opens and closes.
- English checked at 360px, normal reveal motion checked; reduced-motion captures at all four widths.
- 200% zoom: no horizontal page overflow.
- Existing commercial regression suite covers metadata, canonical, schema, routes, consent and mocked contact success/failure. Real email and ad events are not sent during checks.
- New field performance/INP measurements, physical mobile device testing and full accessibility certification are outside this revision.

Captures and before/after metrics: `artifacts.local/white-funnel/`. Shared site styles and hero component are unchanged. Section-height placeholders were remeasured after the layout changes.

## Skills applied

- `imagegen`: original 3D assets and precise brand correction.
- `apple-design`: visual hierarchy, restraint, readable captions and existing reduced-motion behavior.
- `karpathy-guidelines` / `ponytail`: scope limited to requested funnel areas, existing components and dependencies.
- `copywriting` / `cro`: short benefits, meaningful proof, clear enquiry action.
- `playwright-cli` / `verification-before-completion`: browser, build and regression checks.

## Final generation prompts

### Website
Use case: product-mockup. Create an exceptionally refined photorealistic 3D product render for the premium Romanian web development brand Alcaziu Robert. Output one square 1536x1536 image. Pure seamless WHITE #FFFFFF studio background and floor, completely white corners. Restrained cool blue #4580F7 accents, silver, white glass. Inspired by high-end technology product photography: large tactile subject, confident negative space, precise edge highlights, physical realistic materials, beautiful soft ambient occlusion, no excessive glow.
The subject is a sculptural three-dimensional website browser window, like a thin freestanding tablet made of polished silver and clear glass, slightly tilted backwards and turned 12 degrees in perspective, floating just above the white floor. It fills the LOWER 72% of the composition, leaving the UPPER 25% pure empty white for an HTML heading to be overlaid later. Show a refined minimalist business website on its screen: tiny neutral navigation, large exact Romanian title "Afacerea ta.", a short muted gray supporting line represented by subtle UI lines, a glossy BLUE action button, an elegant abstract architectural blue glass object to the right, two clean thumbnail preview modules below. Never show charts, numbers, revenue metrics or testimonials. The design should read as an original conceptual website, not a real client screenshot.
Camera very close, the glass browser is the hero and its depth is clearly visible. Attractive thick beveled silver edges and glass reflections. Stay within frame with generous white side margins. The white floor casts only a short delicate pale blue-gray shadow beneath the product. No hand, no people, no laptop keyboard, no dark backdrop, no cards floating all around, no logos, no Apple branding, no watermark, no external text. One cohesive premium product render, not a diagram or collage.

### Contact
Use case: product-mockup. Create an exceptionally refined photorealistic 3D product render for the premium Romanian web development brand Alcaziu Robert. Output one square 1536x1536 image. Seamless pure WHITE #FFFFFF studio background and floor, completely white corners. White, polished silver, restrained cool blue #4580F7 accent. High-end technology product photography quality, premium glass and titanium material, soft physically plausible reflections, no excessive glow.
One large elegant silver smartphone with a clean flat glass screen, an original generic device without logos, resting at a slight backward angle and rotated about 14 degrees for a beautiful three-quarter perspective. The entire device is visible, fills the LOWER 74% of the composition, with upper 25% pure empty white reserved for HTML copy. No hand. The smartphone's contact screen is deliberately minimal, white: exact Romanian title "Să vorbim.", three rounded understated input rows with pale gray lines, one large blue rounded button with a white forward arrow. A small elegant blue glass paper-plane/send symbol hovers by the lower right edge of the phone, visually connected to the button, to convey easy contact. No statistics, charts, ratings or client logos. UI is illustrative, refined, and believable; avoid dense text.
Strong sculptural three dimensionality, detailed edge reflections, the white surface softly receives the product's shadow. Let the device and blue send symbol occupy the frame confidently while keeping the top empty and side margins. No dark background, no person, no extra phones, no floating cloud of cards, no watermark, no headline outside screen. One original studio product image, not a collage.

### Search bridge
Use case: ads-marketing. Create an exceptionally refined panoramic photorealistic 3D conceptual product render for Romanian web developer Alcaziu Robert. Wide landscape composition, 2:1 aspect ratio, 2048x1024. Pure seamless WHITE #FFFFFF studio background with WHITE floor, no horizon city, no backdrop gradient, white corners. High-end technology product launch image quality, sculptural architecture, polished silver and clear frosted glass with restrained #4580F7 blue accents, realistic soft contact shadows, pristine details.
A miniature architectural scene concentrated in the LOWER 65% of the canvas. At left a contemporary generic small business storefront of matte white stone and glass, restrained blue canopy, one small realistic business owner in navy smart casual clothes welcoming people. At right four diverse adult prospective customers, beautifully rendered normal anatomy and understated neutral business casual clothes. Both stand on separate low white architectural plinths, separated by a narrow gap. A sculptural frosted-glass bridge spans this gap. Its front is a beautifully executed slim search bar with a BLUE magnifying glass and the exact Romanian query "servicii aproape de mine", then a small blue arrow at right. Glass edges have refined blue highlights. The bridge literally connects people to the business. The overall image feels like one precise physical display model on a white photography table. No chasm, no mist, no city beyond the plinths, no tiny objects clutter.
Keep the TOP 30% completely empty WHITE for a headline to be set as HTML later. Scene wide and lower-centered, keep complete storefront and people within 8% margins. No clinic, doctors or medical context; any local service business. No labels over characters, no marketing text, no brands or logos, no fake claims, no watermark, no social media interface. One wide original 3D hero image, no collage.

### Website correction
Preserve the render; remove the invented symbol/name and inaccurate domain. Replace the address with a neutral placeholder line and the tiny navbar identity with “Website”. Keep the composition, materials, white background, screen title and all other details.


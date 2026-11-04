# Transparent introductory visuals

Used the built-in image_gen tool in edit mode to remove the external white backgrounds from the two approved images. The device screens remain opaque, with subtle semitransparent contact shadows. The original white versions are retained.

Saved project assets:

- `public/visuals/website-3d-cutout-640.webp`
- `public/visuals/website-3d-cutout-1280.webp`
- `public/visuals/contact-3d-cutout-640.webp`
- `public/visuals/contact-3d-cutout-1280.webp`

Sharp was used only for resizing and WebP encoding, retaining alpha. All four files have alpha and transparent corner pixels. The pair's white CSS panel background, rounding and clipping were removed with a scoped override. Layout, captions, motion and the separate panoramic section are unchanged.

Browser checks at 360/390/768/1440px: both images loaded, transparent panel fills, no horizontal overflow and no page errors. Before/after captures and alpha checks are in `artifacts.local/transparent-visuals/`. Skill used: `imagegen` for the cutout edits, with the existing verification workflow for integration.

## Website edit prompt

Use case: background-extraction. Edit this exact supplied image; remove ONLY the external white studio background and floor, replacing them with genuine transparent alpha. This is a precise cutout, NOT a regeneration or redesign. Preserve the silver glass browser window, every screen element and all Romanian text, blue architectural imagery, perspective, metallic edges exactly as supplied. Keep the same full square canvas dimensions, the identical subject size and location, including all empty space above the subject. Do not recenter, zoom, crop or change colors. White areas INSIDE the device and UI remain opaque white; they must not be erased. Keep fine natural soft contact shadows underneath as subtle semi-transparent alpha shadows, with no white floor rectangle or white halo. Preserve delicate edges and glass highlights cleanly. All corners, the entire upper empty quarter and all space outside the subject/shadow must be fully transparent, not painted white and not a checkerboard texture. No added text or objects.

## Phone edit prompt

Use case: background-extraction. Edit this exact supplied image; remove ONLY the external white studio background and floor, replacing them with genuine transparent alpha. This is a precise cutout, NOT a regeneration or redesign. Preserve the silver smartphone, its white screen with exact Romanian text 'Să vorbim.', the three fields and blue button, the blue glass paper plane, their perspective, metallic edges exactly as supplied. Keep the same full square canvas dimensions, the identical subject size and location, including all empty space above the subject. Do not recenter, zoom, crop or change colors. White areas INSIDE the device and UI remain opaque white; they must not be erased. Keep fine natural soft contact shadows underneath as subtle semi-transparent alpha shadows, with no white floor rectangle or white halo. Preserve delicate edges and glass highlights cleanly. All corners, the entire upper empty quarter and all space outside the subject/shadow must be fully transparent, not painted white and not a checkerboard texture. No added text or objects.

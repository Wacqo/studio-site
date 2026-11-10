# RMDesign: portfolio site

A static, single-page site. Upload the whole folder to any static host. There's no build step.

```
index.html          all page content (single page, anchor nav)
css/styles.css      styles + motion
js/projects.js      the project list (edit this to add work)
js/main.js          drifting strip, Work grid, reveals, full-screen gallery
images/<project>/   NN.jpg/.webp (full) + NN-thumb.jpg/.webp (thumbnail)
tools/optimize_images.py   resizes new photos into that format
```

## Placeholders to replace

Search `index.html` for these and replace them:

| Find | Where |
|---|---|
| `RMDesign` | firm name (not yet confirmed): title, meta tags, header wordmark, hero copy, footer. Also change the favicon letter (`%3ER%3C` in the icon link) |
| `hello@rmdesign.com` | Contact (text + `mailto:`) |
| `(555) 010-0000` / `tel:+15550100000` | Contact |
| `[Studio address or service area]` | Contact |
| `@rmdesign` / `instagram.com/rmdesign` | Contact |
| `[City, State]`, `[Year]` | Hero caption, Featured project (also in `js/projects.js`) |

The "What we do" and "How we work" copy is starter text written for the client to review and edit.
A long firm name might crowd the header on small phones. If that happens, shorten the wordmark or reduce `.wordmark` font-size.

## Adding a project

1. `python tools/optimize_images.py path/to/photos images/project-folder` (needs `pip install Pillow`)
2. Add a block to `js/projects.js` (there's a commented example). Image order = gallery order.

The drifting strip, the Work grid and the gallery update automatically.
The Featured project and hero on the home page are written by hand in `index.html`. To feature a different project, edit those blocks (`data-project` = slug, `data-index` = photo position, starting at 0).

## Notes

- Fonts load from Google Fonts (Cormorant Garamond + Inter). If you want no third-party requests, self-host them.
- Without JavaScript, all text still shows and image links open the full photo. The Work grid then shows a `<noscript>` fallback card for The White Kitchen.
- With `prefers-reduced-motion`, all animation is off and the strip turns into a swipeable row.
- The original photos are 1125px wide, so the full-size files keep that size (they're never upscaled). Thumbnails are 800px on the long edge.

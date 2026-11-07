/* =====================================================================
   PROJECTS — the single source of truth for the portfolio.
   ---------------------------------------------------------------------
   To add a project:
   1. Run tools/optimize_images.py on the new photos (see README.md).
      It writes NN.jpg / NN.webp (full) and NN-thumb.jpg / NN-thumb.webp
      into images/<project-folder>/.
   2. Copy the block below, change the fields, list the images in the
      order the gallery should show them. The first image opens first.
   3. `cover` = index (0-based) of the image used on the Work grid card.
   4. `widths` = [thumb width, full width] in px of a typical (portrait)
      image, used by the browser to pick the right file size.
   The home-page drifting strip, Work grid and full-screen gallery
   all build themselves from this list.
   ===================================================================== */

window.PROJECTS = [
  {
    slug: "the-white-kitchen",
    title: "The White Kitchen",
    location: "[City, State]",   // PLACEHOLDER
    year: "[Year]",              // PLACEHOLDER
    type: "Kitchen",
    folder: "images/white-kitchen/",
    widths: [640, 1125],
    cover: 6,
    images: [
      { file: "07", alt: "Wide view of the kitchen: a pale blue-glass island with a white quartz top, black pendant lights and white cabinetry with brushed-brass pulls." },
      { file: "06", alt: "View toward twin wall ovens set into tall white cabinets, with the blue island and a farmhouse sink in the foreground." },
      { file: "02", alt: "A long run of white flat-panel cabinets with brushed-brass bar pulls, a farmhouse sink and a wood-look plank floor." },
      { file: "04", alt: "Pale blue-glass backsplash behind a gas cooktop, framed by white cabinetry and brushed-brass hardware." },
      { file: "01", alt: "Brushed-brass gooseneck faucet at a white quartz counter beneath a wide window with layered shades." },
      { file: "05", alt: "Gas cooktop on a white quartz counter, with the blue-glass backsplash and white arabesque tile beyond." },
      { file: "08", alt: "Tall white cabinets with long brass pulls and stacked wall ovens, trimmed in pale blue glass." },
      { file: "03", alt: "White perimeter cabinetry with brushed-brass pulls, a farmhouse sink under the window, and a grey plank floor." }
    ]
  }

  /* Example of a second project — uncomment and edit:
  ,{
    slug: "the-garden-room",
    title: "The Garden Room",
    location: "[City, State]",
    year: "[Year]",
    type: "Living",
    folder: "images/garden-room/",
    widths: [640, 1125],
    cover: 0,
    images: [
      { file: "01", alt: "Describe the photo for screen readers." }
    ]
  }
  */
];

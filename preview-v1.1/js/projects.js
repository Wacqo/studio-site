/* =====================================================================
   PROJECTS — the single source of truth for the portfolio.
   ---------------------------------------------------------------------
   To add a project:
   1. Run tools/optimize_images.py on the new photos (see README.md).
      It writes NN.jpg / NN.webp (full) and NN-thumb.jpg / NN-thumb.webp
      into images/<project-folder>/.
   2. Copy the block below, change the fields, list the images in the
      order the gallery should show them. The first image opens first.
   3. `cover` = index (0-based) of the image used on the Work card;
      `coverFocus` = which part of it to keep when cropped wide ("x% y%").
      `summary` = one or two sentences shown on the Work card.
      `strip` (optional) = detail crops for the moving strip on the home
      page: { i: image index, zoom: 1–2, focus: "x% y%" }. Leave it out
      to show every image uncropped.
   4. `widths` = [thumb width, full width] in px of a typical (portrait)
      image, used by the browser to pick the right file size.
   The home-page drifting strip, Work grid and full-screen gallery
   all build themselves from this list.
   ===================================================================== */

/* ROOMS — the categories shown as buttons in the Work section, in this order.
   A room with no projects yet shows a "coming soon" line.
   PLACEHOLDER LIST: replace with the rooms the studio wants to show. */
window.ROOMS = ["Kitchens", "Bathrooms", "Living rooms", "Bedrooms"];

window.PROJECTS = [
  {
    slug: "the-white-kitchen",
    room: "Kitchens",   // must match one of the ROOMS above
    title: "The White Kitchen",
    location: "",   // add "City, Province" when confirmed
    year: "",       // add the year when confirmed
    type: "Kitchen",
    folder: "images/white-kitchen/",
    widths: [640, 1125],
    cover: 5,
    coverFocus: "50% 62%",
    summary: "White flat-panel cabinetry, brushed-brass hardware, quartz counters and a pale blue-glass backsplash and island.",
    strip: [
      { i: 4, zoom: 1.5, focus: "40% 55%" },  // faucet
      { i: 2, zoom: 1.8, focus: "25% 80%" },  // brass pulls
      { i: 3, zoom: 1.35, focus: "45% 30%" }, // blue glass + cooktop
      { i: 6, zoom: 1.6, focus: "75% 30%" },  // ovens + tall pulls
      { i: 4, zoom: 1.8, focus: "25% 15%" },  // window shades
      { i: 2, zoom: 1.7, focus: "85% 45%" },  // farmhouse sink
      { i: 3, zoom: 1.8, focus: "55% 85%" },  // cooktop knobs + drawers
      { i: 6, zoom: 1.8, focus: "45% 5%" }    // glass trim + brass
    ],
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
    coverFocus: "50% 50%",
    summary: "One or two sentences about the project.",
    images: [
      { file: "01", alt: "Describe the photo for screen readers." }
    ]
  }
  */
];

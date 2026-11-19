# The Green Turtle: events, bookings and entry proposal

Prepared by AzeelaAI Labs for The Green Turtle (thegreenturtle.in), November 2026.

Open `index.html` in a browser. Plain HTML, CSS and JavaScript. No build step, no Node, no libraries.
Fonts (Sora and Montserrat) load from Google Fonts when online and fall back to system fonts offline.

## Using it
- Opens as a slide deck on desktop and landscape tablets: one 1280×720 slide at a time, scaled to fit the window. On phones and portrait tablets it stacks as a scrollable page.
- Arrow keys, Space, Enter, Page Up/Down, or the footer buttons advance slides. Swipe left/right on touch. Home/End jump to first/last.
- Chapter pills in the header follow the story (Intro → Challenge → Solution → … → The ask → Close) and jump to that section.
- O opens the slide overview, N opens speaker notes in a second window, B blackout, P spotlight pointer, F full screen, Esc clears overlays.
- The coloured dots in the header switch the colour theme live (Turtle green is the default; Sunshine, Lagoon and Berry are included).
- Add `#7` style links to open a specific slide.

## Editing the details
Open `js/main.js` and fill in `CONFIG` at the top (client name, company name, contact email, phone, date). Anything left empty is left out of the deck. The closing button appears only when an email is set.
Sample events, prices, pass types and seat numbers are in `js/main.js` (`EVENTS`, `CAT0`, `STEPS`, `CX`). They are illustrative and should be replaced with the school's real details.

## Honest limitations
- All figures, prices and event names are illustrative demonstration data. No backend, no real payments, no real passes.
- The QR graphics are decorative and not scannable. They are labelled "Illustrative QR".
- The offline and multi-entrance demos are simulations of the proposed campus setup, not a deployed system.
- Nothing in the deck is a quote. Final scope and pricing are confirmed after a requirements discussion.

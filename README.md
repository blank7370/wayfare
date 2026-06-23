# Wayfare — small-group travel site

A static marketing + booking-front site for a fictional travel house that sells
**bundled, fixed-date trips with a hard seat cap**. Live availability is the core
idea: every trip shows seats remaining, and the counter falls as people reserve.

Just HTML, CSS, and vanilla JavaScript — no build step, no framework. Open
`index.html` or drop the folder on any static host.

## What's new in this version

1. **Cooler, holiday palette.** Deep ocean-navy ground with turquoise water and a
   warm sunset coral/gold reserved for scarcity and calls to action. (The fonts,
   layout, and copy are unchanged.)
2. **3D animation.** Trip cards tilt toward the cursor with a parallax photo,
   the hero "Next Departures" board floats in 3D on mouse-move, and gallery tiles
   tilt before opening a lightbox. All of it switches off under
   `prefers-reduced-motion`.
3. **Clickable bundles -> destination pages.** Every card and manifest row opens
   `destination.html?trip=<id>`: a full trip page with overview, route, what's
   included, and a **photo gallery with a lightbox**.

## Files

| File | Role |
|------|------|
| `index.html` | Home page (hero, live manifest, departures grid, why/how, signup). |
| `destination.html` | Per-trip page; reads `?trip=<id>` and renders from the data. |
| `styles.css` | All styling — palette tokens live in `:root` at the top. |
| `data.js` | **Shared.** All trip data, photo galleries, and availability helpers. |
| `booking.js` | **Shared.** The reservation modal + toast notifications. |
| `app.js` | Home-page logic (manifest, grid, filters, 3D tilt, nav, signup). |
| `destination.js` | Detail-page logic (render, gallery, lightbox, booking). |

> "Java" in the original brief means **JavaScript** — that's what runs in the
> browser here. (Java is a different, unrelated language.)

## Editing trips

Everything lives in the `TRIPS` array in **`data.js`**. Each trip has its dates,
price, `total` seats, seats `left`, route `stops`, `highlights`, `included`, and a
`photos` gallery. Change a number, add a trip object, and both pages update.

## Photos

Gallery and card images are real photos from **Unsplash** (hotlinked from the
Unsplash CDN — free for commercial use, no attribution required). Each photo is a
`{ src, id, caption }` object built from a stable Unsplash photo ID, so every
destination has five matching images. If an image ever fails to load, a tinted
gradient shows in its place, so the layout never breaks.

**To use your own / licensed photography**, replace the photo `id`s in each trip's
`photos` array in `data.js` (or swap `src` for any image URL or local path like
`images/kyoto-1.jpg`). The `caption` is what shows under each photo and in the lightbox.

## Wiring up real bookings

Reservations currently update the seat count **in memory only** — refresh and they
reset. To make them real, find the line marked `// ---- POST to your booking backend
here ----` in `booking.js` and send the trip id, seat quantity, name, and email to
your server. The email signup forms are also front-end stubs ready to point at your
list provider.

## Notes

- Type: Fraunces (display), Hanken Grotesk (body), IBM Plex Mono (data) via Google Fonts.
- The grid, manifest, and booking need JavaScript on.
- No tracking, no dependencies, no cookies.

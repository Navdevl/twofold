# Twofold — Implementation Design

**Date:** 2026-01-18
**Status:** Approved

---

## Overview

A static Eleventy site for Naveen & Rachel to log places they've visited (cafes, restaurants, stays). Time-indexed archive with canonical place pages and individual visit logs.

---

## URL Structure

| Page | URL |
|------|-----|
| Homepage (current year) | `/` |
| Year archive | `/2025/`, `/2024/` |
| Places list | `/places/` |
| Place detail | `/places/<slug>/` |
| Log entry | `/places/<slug>/log/YYYY-MM-DD/` |
| About | `/about/` |

---

## Project Structure

```
twofold/
├── src/
│   ├── places/
│   │   └── <place-slug>.md
│   ├── visits/
│   │   └── YYYY-MM-DD-<place-slug>.md
│   ├── about.md
│   └── _includes/
│       ├── layouts/
│       │   ├── base.njk
│       │   ├── home.njk
│       │   ├── place.njk
│       │   ├── place-list.njk
│       │   ├── log.njk
│       │   └── about.njk
│       └── partials/
│           ├── header.njk
│           ├── footer.njk
│           ├── rating-stars.njk
│           ├── visit-card.njk
│           └── place-card.njk
├── assets/
│   ├── places/<place-slug>/hero.jpg
│   └── visits/<place-slug>/YYYY-MM-DD/*.jpg
├── css/
│   └── style.css
├── .eleventy.js
├── package.json
└── .github/workflows/deploy.yml
```

---

## Content Specs

### Place (`src/places/<slug>.md`)

```yaml
---
title: "Blue Tokai Coffee Roasters"
slug: "blue-tokai-indiranagar"
type: "cafe"
location:
  city: "Bangalore"
  country: "India"
map_url: "https://maps.google.com/..."
website: "https://bluetokai.com"
ratings:
  naveen: 4.5
  rachel: 4.0
---

Evergreen description of the place. No visit dates or timelines.
```

### Visit (`src/visits/YYYY-MM-DD-<slug>.md`)

```yaml
---
date: 2025-01-18
place: "blue-tokai-indiranagar"
title: "Quiet afternoon visit"
---

Short reflection and notes about this specific visit.
```

---

## Collections

1. **places** — all place files, for `/places/` listing
2. **visits** — all visit files, sorted by date descending
3. **visitsByYear** — visits grouped by year
4. **visitsByPlace** — visits grouped by place slug

---

## Pages

### Homepage (`/`)
- Shows current year's visits
- Reverse chronological order
- Each card: date, place name (linked to log), type, location, avg rating, excerpt, thumbnail

### Year Archive (`/2025/`)
- Same as homepage but for specific year
- Navigation between years

### Places List (`/places/`)
- Alphabetical list of all places
- Each item: name, type, city, avg rating

### Place Detail (`/places/<slug>/`)
- Hero image (or placeholder if missing)
- Name, type, location, map link, website
- Ratings: Naveen stars · Rachel stars · Average stars
- Evergreen description
- Visit timeline (links to log entries)

### Log Entry (`/places/<slug>/log/YYYY-MM-DD/`)
- Breadcrumb: Places → Place Name → Date
- Inherits place context (name, type, location)
- Visit date
- Visit reflection
- Visit photos from `assets/visits/<slug>/<date>/`

### About (`/about/`)
- Intro content (written by owners)
- Dynamic stats: X places · Y visits · Z cities

---

## Styling

### Colors (CSS Variables)
```css
--color-bg: #faf8f5;           /* warm off-white */
--color-text: #3d3d3d;         /* warm dark gray */
--color-accent: #7c9a76;       /* sage green */
--color-accent-alt: #c9a227;   /* muted gold */
--color-muted: #a89f91;        /* warm beige/gray */
--color-border: #e5e0d8;       /* soft warm border */
```

### Typography
- Headings: Lora (serif)
- Body: Inter (sans-serif)
- Loaded from Google Fonts

### Visual Feel
- Warm and personal
- Soft rounded corners (4-8px)
- Subtle card shadows
- Generous whitespace
- Placeholder pattern for missing hero images

### Responsive
- Desktop-first
- Single breakpoint for mobile adjustments
- Stack layouts, adjust font sizes on small screens

---

## Ratings Display

- Star icons with half-star support: ★★★★☆
- Individual ratings for Naveen & Rachel
- Average computed at build time
- 0.5 increment scale (0-5)

---

## SEO

### Meta Tags
- Unique `<title>` per page
- Meta descriptions
- Canonical URLs
- Open Graph tags

### JSON-LD (on place pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Place Name",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "City",
    "addressCountry": "Country"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.25",
    "bestRating": "5",
    "ratingCount": "2"
  }
}
```

### Type Mapping
- `cafe` → CafeOrCoffeeShop
- `restaurant` → Restaurant
- `stay` → LodgingBusiness
- Other → LocalBusiness

---

## Navigation

Header links:
- Home
- About
- Places

---

## Deployment

- GitHub Pages (static hosting)
- GitHub Actions workflow on push to `main`
- Eleventy builds to `_site/`
- No runtime JavaScript

---

## Implementation Order

1. Project scaffolding — package.json, .eleventy.js, folder structure
2. Base layout & CSS — variables, fonts, header/footer, basic styling
3. Sample data — 2 places, 3-4 visits for testing
4. Place collection & pages — list and detail views
5. Visit collection & log pages — with place data inheritance
6. Homepage & year archives — visit timeline
7. About page — intro + dynamic stats
8. Rating stars partial — half-star support
9. SEO & JSON-LD — meta tags, structured data
10. GitHub Actions — deploy workflow
11. Mobile adjustments — responsive tweaks

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| URL for visits | `/places/<slug>/log/<date>/` (singular, personal feel) |
| Homepage view | Year-based archives, current year default |
| Place types | Open-ended (any string) |
| Hero images | Optional, placeholder fallback |
| Maps | Links only, no embeds |
| Ratings display | Star icons with half-star support |
| Places list order | Alphabetical with type/city metadata |
| Timeline links | Go to log detail page, not place page |
| Styling | Warm/personal, earth tones, configurable CSS vars |
| Typography | Lora (headings) + Inter (body) |
| Responsive | Desktop-first with mobile adjustments |

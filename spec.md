# Twofold — Project Specification

**Tagline:** Places we returned to  
**Owners:** Naveen & Rachel  
**Type:** Fully public, SEO-focused personal archive  
**Hosting:** GitHub Pages (static)

---

## 1. Purpose

Build a public, long-lived website to log and reflect on:
- restaurants
- cafes
- stays

The site prioritizes:
- chronological exploration (time)
- canonical place pages (SEO)
- multiple visits to the same place
- two individual perspectives

This is **not a traditional blog**.  
It is a **time-indexed archive of places and visits**.

---

## 2. Core Entities

### 2.1 Place (Canonical)

A place represents a real-world location that can be visited multiple times.

Examples:
- Cafe
- Restaurant
- Stay (hotel / Airbnb)

Each place has exactly one canonical URL.

---

### 2.2 Visit (Event)

A visit represents a specific occurrence in time when a place was visited.

- Visits are time-series data
- Visits reference a place
- Visits drive the homepage timeline

---

## 3. Content Structure

```
src/
  places/
    <place-slug>.md

  visits/
    YYYY-MM-DD-<place-slug>.md

assets/
  places/
    <place-slug>/
      hero.jpg

  visits/
    <place-slug>/
      YYYY-MM-DD/
        *.jpg
```

---

## 4. Place Markdown Spec

Path:
```
src/places/<place-slug>.md
```

Frontmatter:
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
```

Body:
- Evergreen description
- No visit dates
- No timelines

---

## 5. Visit Markdown Spec

Path:
```
src/visits/YYYY-MM-DD-<place-slug>.md
```

Frontmatter:
```yaml
---
date: 2025-01-18
place: "blue-tokai-indiranagar"
title: "Quiet afternoon visit"
media_dir: "2025-01-18"
---
```

Body:
- Short reflection
- Optional notes
- No ratings

---

## 6. Homepage Requirements

- Default view: current year
- Reverse chronological order
- Static pagination or infinite scroll
- No client-side JS required

Each timeline item shows:
- Visit date
- Place name (link to place page)
- Place type
- Location
- Average rating
- Short excerpt
- Optional thumbnail

---

## 7. Place Page Requirements

- Header with name, type, location, rating, hero image
- Map embed + website
- Individual ratings (Naveen & Rachel) + average
- Visit timeline (reverse chronological)
- Media grouped by visit

---

## 8. Media Handling

- Place media: `assets/places/<place-slug>/`
- Visit media: `assets/visits/<place-slug>/<YYYY-MM-DD>/`
- Lazy-load all images

---

## 9. SEO Requirements

- One canonical URL per place
- Descriptive title and meta description
- JSON-LD:
  - LocalBusiness
  - Restaurant or LodgingBusiness
  - AggregateRating
- Clean URLs
- Strong internal linking

---

## 10. Tech Constraints

- Eleventy (11ty)
- Nunjucks templates
- Minimal CSS
- GitHub Pages compatible
- No runtime JS

---

## 11. Non-Goals

- No comments
- No user accounts
- No CMS
- No per-visit ratings
- No mobile-first redesign

---

## 12. Future (Not Implemented Now)

- Year selector
- Map view
- RSS
- Year-in-review pages
- New experience types

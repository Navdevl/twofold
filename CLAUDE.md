# Twofold

A personal archive of places we return to — by Naveen & Rachel.

## Project Structure

```
src/
  places/       # Place profiles (cafes, restaurants, stays)
  visits/       # Individual visit logs
  _includes/    # Layouts and partials
  _data/        # Global data files
assets/
  photos/       # Visit photos organized by place/date
css/
  style.css     # Styles (CSS variables for theming)
```

## Key Conventions

- **Places**: `src/places/{slug}.md` - Each place has a unique slug
- **Visits**: `src/visits/{YYYY-MM-DD}-{place-slug}.md` - One log per day per place
- **Photos**: `assets/photos/{place-slug}/{YYYY-MM-DD}/`
- **URLs**:
  - Places: `/places/{slug}/`
  - Visits: `/places/{slug}/log/{YYYY-MM-DD}/`
  - Year archives: `/`, `/2025/`, `/2024/`

## Ratings

Both Naveen and Rachel rate each place out of 5 (supports half stars like 4.5).

## Skills

- `/log` - Log a new visit (creates place if needed)

## Tech Stack

- Eleventy 3.0 (11ty)
- Nunjucks templates
- GitHub Pages deployment

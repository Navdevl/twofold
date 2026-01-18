# Log Skill

Log a visit to a place in Twofold.

## Trigger
- User invokes `/log`
- User says "log a visit", "add a visit", "new visit", etc.

## Workflow

### Step 1: Get Visit Basics
Ask the user:
1. **Place name** - What place did you visit?
2. **Date** - When did you visit? (default to today if not specified)
3. **Visit title** - A short, memorable title for this visit

### Step 2: Check if Place Exists
Search for the place in `src/places/*.md` by matching the title or slug.

**If place exists:**
- Confirm with user: "Found [Place Title]. Is this the right place?"
- If yes, proceed to Step 4
- If no, ask for clarification or create new place

**If place does NOT exist:**
- Tell user: "I don't have [Place Name] in the archive yet. Let me get some details."
- Proceed to Step 3

### Step 3: Create New Place (only if needed)
Ask user for the following details using AskUserQuestion tool when possible:

1. **Place type** - Options: Cafe, Restaurant, Bar, Stay, Bakery, or let them specify other
2. **City** - What city is this in?
3. **Country** - What country? (default: India)
4. **Google Maps link** - Can you share the Google Maps link?
5. **Website** - Does it have a website? (optional, can skip)
6. **Naveen's rating** - Naveen's rating out of 5? (supports half stars like 4.5)
7. **Rachel's rating** - Rachel's rating out of 5?
8. **Place description** - A brief description of the place (2-3 sentences)

**Generate slug** from place name:
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Add city if needed for uniqueness (e.g., `blue-tokai-indiranagar`)

**Create place file** at `src/places/{slug}.md`:

```markdown
---
title: "{Place Title}"
slug: "{slug}"
type: "{type}"
location:
  city: "{City}"
  country: "{Country}"
map_url: "{Google Maps URL}"
website: "{Website URL or remove this line if none}"
ratings:
  naveen: {rating}
  rachel: {rating}
layout: layouts/place.njk
permalink: /places/{{ slug }}/
---

{Place description}
```

### Step 4: Get Visit Content
Ask user:
- **What happened?** - Tell me about your visit. What did you eat/drink? Any highlights?

### Step 5: Create Visit File
Create visit file at `src/visits/{YYYY-MM-DD}-{place-slug}.md`:

```markdown
---
date: {YYYY-MM-DD}
place: "{place-slug}"
title: "{Visit Title}"
---

{Visit content from user}
```

### Step 6: Photos Reminder
After creating the files, remind user:

"Visit logged! If you have photos from this visit, add them to:
`assets/photos/{place-slug}/{YYYY-MM-DD}/`

You can then reference them in your visit with:
`![Alt text](/assets/photos/{place-slug}/{YYYY-MM-DD}/filename.jpg)`"

## File Naming Conventions
- Place files: `src/places/{slug}.md`
- Visit files: `src/visits/{YYYY-MM-DD}-{place-slug}.md`
- Photos: `assets/photos/{place-slug}/{YYYY-MM-DD}/`

## Example Interaction

```
User: /log

Claude: Let's log a visit!
- What place did you visit?
- When was this? (I'll assume today if you don't specify)
- Give this visit a short title

User: We went to Third Wave Coffee in Koramangala yesterday. Call it "Sunday brunch vibes"

Claude: I don't have "Third Wave Coffee Koramangala" in the archive yet. Let me get some details:
- What type of place is this? (Cafe/Restaurant/Bar/Stay/Other)
- What city?
- Google Maps link?
- Website? (optional)
- Naveen's rating out of 5?
- Rachel's rating out of 5?
- Brief description of the place?

User: It's a cafe in Bangalore. Here's the map: https://maps.google.com/...
Website is thirdwavecoffee.in
Naveen gives it 4, Rachel gives it 4.5
Great specialty coffee chain with good food options and reliable wifi.

Claude: Got it! Now tell me about yesterday's visit - what did you have, any highlights?

User: Had their signature cold brew and a grilled cheese sandwich. Perfect lazy Sunday afternoon spot.

Claude: Done! I've created:
- Place: src/places/third-wave-coffee-koramangala.md
- Visit: src/visits/2026-01-17-third-wave-coffee-koramangala.md

If you have photos, add them to:
assets/photos/third-wave-coffee-koramangala/2026-01-17/
```

## Important Notes
- Always confirm the place match before proceeding
- Ratings support decimals (4.5, 3.5, etc.)
- Date format is always YYYY-MM-DD
- Slugs should be URL-friendly (lowercase, hyphens, no special chars)
- If user provides partial info, ask follow-up questions
- Be conversational and friendly - this is a personal archive!

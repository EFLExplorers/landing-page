# Backlog and Coverage Tracker

Use this to track what exists, what needs work, and gaps to fill.

## Pages and Sections (status)
- Home: hero, tagline, learning tools, services, pricing teaser, register CTA (✅ DB-driven)
- Pricing: pricing table (Basic, Premium, Enterprise) (✅ DB-driven)
- About: mission, vision, team, values, stats (✅ DB-driven)
- Contact: hero, form (with DB-driven labels), FAQ (✅ DB-driven)
- Teacher platform: hero, tools, lesson modules, benefits, CTA (✅ DB-driven)
- Student platform: hero, characters, planets carousel, CTA (✅ DB-driven)
- Auth flows: login, register, forgot/reset, pending (✅ DB-driven)
- 404 page: error content (✅ DB-driven via site_sections)

## Current Gaps / To-Do
- Auth/CTA routing: centralize register/login redirect rules per role; add post-auth redirect handling.
- Accessibility: carousel controls ARIA review; focus states on buttons/links; ensure form error messaging.
- Testing: extend Cypress to cover pricing CTAs, register flow links, student planets controls pause/play.

## Completed ✅
- ✅ All content is DB-driven (no hardcoded content)
- ✅ All pages use strict mode (no fallbacks)
- ✅ Teacher platform fully migrated to DB
- ✅ Auth pages fully migrated to DB
- ✅ 404 page migrated to DB
- ✅ Contact form labels migrated to DB

## Work Log (append as tasks complete)
- [ ] Task: …

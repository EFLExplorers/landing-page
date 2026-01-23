# UI Overview

High-level reference for site pages, components, and patterns.

## Navigation
- Header: Logo → home; Platforms dropdown (Teacher, Student); Pricing; About; Contact; Auth (Login, Get Started).
- Footer: Socials, Company links, Support links, bottom bar copy.

## Page Map
- Home (`/`): Hero, Tagline, LearningTools (cards), Services (cards), Pricing teaser (tiers), Register CTA.
- Pricing (`/pricing`): PricingTable (Basic, Premium, Enterprise) + footer note.
- About (`/about`): Mission, Vision, Team, Stats, Values.
- Contact (`/contact`): Hero, Form, FAQ.
- Teacher platform (`/platforms/teacher`): Hero, TeachingTools, LessonModules (selectable), Benefits, CTA.
- Student platform (`/platforms/student`): Hero, Characters, Planets carousel, CTA.
- Auth: login/register/forgot/reset pages (DB-driven with complex form validation and session management).
- System: 404.

## Component Patterns
- Cards: consistent title/subtitle/description/icon; keep max width; support dynamic data.
- CTAs: primary (register/role-specific), secondary (learn more); ensure role-aware links.
- Forms: labeled inputs, required markers, validation messaging, success/error states.
- Carousels: keyboard focusable controls, pause/resume, announce current item.
- Grids: responsive columns; cap text length to avoid overflow.

## Styling Notes
- Uses CSS Modules for component styling with custom utility classes in `shared/components.css` and `utilities.css`.
- Icons: currently emoji; plan to swap to a consistent icon set.
- Images: Next/Image where possible; ensure alt text.

## Testing Hooks
- `data-cy` attributes present on major elements (hero, nav, cards, pricing, contact form, carousels) for Cypress.

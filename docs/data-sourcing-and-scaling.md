# Data Sourcing & Scaling Plan

Goal: reduce duplicated/hardcoded text/objects, centralize data in DB/config, and keep the UI lean.

## Hardcoded Content to Externalize

- Home: learning tools cards; services cards; pricing teaser tiers.
- Pricing page: plans, features, CTAs.
- About: stats, mission/vision/values copy, team members.
- Contact: contact info; FAQs.
- Teacher platform: teaching tools; lesson modules; benefits; CTA.
- Student platform: characters; planets; CTA.
- Courses: placeholder → course catalog.
- Auth/CTA: role-based redirect rules and target URLs.

## Suggested Storage Model

- Tables/collections:
  - `pricing_plans` (name, price, period, badge, description, features[], cta_link)
  - `content_blocks` (page, section, title, subtitle, body, media/icon)
  - `cards` (page, section, title, description, icon/image, cta)
  - `faqs` (page, question, answer)
  - `modules` (name, description, lessons, duration, class_size, color/icon)
  - `characters` (name, image, role)
  - `planets` (name, color/icon, order)
  - `team_members` (name, role, title, image, bio, expertise[])
  - `routes` (role, unauth_target, auth_target, verification_target)
- Keep a seed JSON/TS config to mirror DB schemas for local/dev and SSR.

## Cleanup & De-duplication

- Move repeated CTAs (register links) to a single resolver helper.
- Standardize pricing copy (teaser vs pricing page) from one source.
- Centralize icon references instead of inline emoji where possible.

## Loading/Empty/Error Patterns

- Each dynamic section should render: loading skeleton, empty-state message, and error retry.
- Keep layout stable (fixed card counts with placeholders) to avoid content shift.

## Steps to Implement

- Create shared data configs (or seed data) matching the tables above.
- Swap component-local arrays to props fed from a loader (SSR/static fetch or client fetch).
- Add a CTA resolver utility with role + auth-state inputs.
- Add tests to ensure sections render from provided data and handle empty/error cases.

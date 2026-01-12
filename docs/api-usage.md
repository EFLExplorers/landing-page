# UI ↔ API / DB Usage

Current state: the UI is static; components read in-component arrays (cards, pricing, modules, FAQs). There are no live API calls to a DB yet. This doc lists where data would be sourced once APIs exist.

## Planned Data Dependencies (by page)

- Home
  - LearningTools cards
  - Services cards
  - Pricing teaser tiers
  - Register CTA target URLs (role-aware)
- Pricing
  - Plans (name, price, cadence, badge, description, features, CTA link)
- About
  - Stats (label/value)
  - Team members (name, role, title, image, bio, expertise)
  - Mission/Vision/Values copy blocks
- Contact
  - Contact info (email, phone)
  - FAQs list (question/answer)
- Teacher platform
  - Teaching tools list
  - Lesson modules (name, description, lessons, duration, recommended class size, color/icon)
  - Benefits list
- Student platform
  - Characters (name, image)
  - Planets (name, color/icon)
- Courses
  - Course catalog (placeholder today)
- Auth/CTA
  - Role-aware redirect rules; login/register endpoints; verification states

## Suggested Endpoint Shapes (examples)

- `GET /api/content/home`
  - `learningTools[]: { title, description, icon }`
  - `services[]: { title, description, icon, backgroundIcons[] }`
  - `pricingTeaser[]: { name, price, period, description, cta }`
- `GET /api/content/pricing`
  - `plans[]: { name, price, period, description, badge?, features[], cta }`
- `GET /api/content/about`
  - `stats[]: { label, value }`
  - `team[]: { name, role, title, image, bio, expertise[] }`
  - `values[]: { title, description, icon }`
- `GET /api/content/contact`
  - `contact: { email, phone }`
  - `faqs[]: { question, answer }`
- `GET /api/content/teacher-platform`
  - `tools[]`, `modules[]`, `benefits[]`, `cta`
- `GET /api/content/student-platform`
  - `characters[]`, `planets[]`, `cta`
- `GET /api/courses`
  - `courses[]: { id, title, level, summary, image?, cta }`
- Auth (future)
  - `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`

## Client Integration Notes

- Add loading/empty/error states to all dynamic sections.
- Use a small fetch layer with caching (SWR/React Query) if you introduce client fetches; consider getStaticProps/getServerSideProps if you stay on Next pages router.
- Normalize CTA handling: central helper that resolves target based on role + auth state.
- Keep `data-cy` hooks stable after data becomes dynamic.

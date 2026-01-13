# Repository Page Tree (text view)

This is a page-by-page text tree of the current landing site. It mirrors the structure in the repo and notes where pages are powered by Supabase content.

- Shared layout
  - `_app.tsx` wraps everything in `Layout`
  - `Layout`: `Header` + `main` + `Footer`
  - `Header`: built from `Header` → `Navbar` + `AuthButtons`.\n+    - Data: optional `headerContent` props (DB-driven when provided; no hardcoded fallback copy).\n+  - `Footer`: built from `Footer`.\n+    - Data: optional `footerContent` props (DB-driven when provided; no hardcoded fallback copy).

- `/` (home)
  - `PageLayout` wrapper
  - `HeroSection`: headline + copy, buttons → register student/teacher
  - `TaglineSection`: short value prop
  - `LearningToolsSection`: cards for Interactive Games, Digital Flashcards, Progress Tracking, Practice Exercises, Audio Resources, Video Lessons
  - `ServicesSection`: cards for Student Portal, Teacher Resources, Interactive Learning, Progress Tracking, Assessment Tools, Communication Hub
  - `PricingSection`: tiers (Free Access, Individual, Teacher, School) with CTA per card
  - `RegisterCTASection`: CTA → `/Auth/register`
  - Data sources (current):\n+    - `pages` + `page_sections` (section copy, header/footer sections)\n+    - `content_items` (pricing tiers, services, learning tools)\n+  - Notes:\n+    - Home is strict: missing required Supabase env/seeded content causes SSG/build to fail.

- `/pricing`
  - `PricingTable`: header badge + title/subtitle
  - Plans: Basic (Free) → `/Auth/register/student`; Premium (Most Popular) → `/Auth/register/student`; Enterprise → `/contact`
  - Footer note: 14-day trial + link to contact
  - Data sources (current): static component content (not DB-driven yet)

- `/about`
  - `AboutUsSection`
    - Hero title/subtitle
    - Description + stats grid (Students, Teachers, Success Rate, Support)
    - Mission block (copy + 3 points)
    - Vision block (copy + 3 goals)
    - Team grid (Shinade Groves, Bobby Brown, Nathan Van Der Watt)
    - Values grid (Excellence, Community, Innovation, Accessibility)
  - Data sources (current):\n+    - `pages` + `page_sections` (copy blocks)\n+    - `content_items` (`team_member`, `about_stat`, `core_value`)\n+    - Footer content is passed as `footerContent` props (from DB)

- `/contact`
  - `PageLayout` wrapper
  - `ContactHeroSection`: title/subtitle + email + phone
  - `ContactFormSection`: fields first/last/email/subject/message + submit
  - `ContactFAQSection`: accordion list of FAQs
  - Data sources (current): static component content (not DB-driven yet)

- `/platforms/teacher`
  - `TeacherHeroSection`: headline, CTA → `/Auth/register/teacher`, hero image
  - `TeachingToolsSection`: grid of tools (Lesson Planner, Student Analytics, Interactive Resources, Assessment Tools, Progress Tracking, Resource Library)
  - `LessonModulesSection`: selectable module cards (Beginner, Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced, Business English, Exam Prep, Conversation, Specialized) with lessons/duration/class size
  - `TeacherBenefitsSection`: grid of benefits (Ready-Made Content, Student Progress Tracking, Interactive Learning, Flexible Scheduling)
  - `TeacherCTASection`: CTA → `/Auth/register/teacher`
  - Data sources (current): static component content (not DB-driven yet)

- `/platforms/student`
  - `StudentHeroSection`: headline + CTA → `/Auth/register/student`
  - `StudentCharactersSection`: character cards (Cassidy, Emma, Luke, Riley) + copy
  - `StudentPlanetsSection`: rotating planets carousel with start/stop controls
  - `StudentCTASection`: CTA → `/Auth/register/student`
  - Data sources (current): static component content (not DB-driven yet)

- `/courses`
  - Placeholder page with title and empty course grid
  - Data sources (current): static placeholder

- Auth flows (static pages)
  - Login: `/Auth/login`, `/Auth/login/student`, `/Auth/login/teacher`, `/Auth/login/admin`
  - Register: `/Auth/register`, `/Auth/register/student`, `/Auth/register/teacher`, `/Auth/register/teacher/pending`
  - Password recovery: `/Auth/forgot-password`, `/Auth/reset-password`

- System pages
  - `/404`

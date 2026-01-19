# Repository Page Tree (text view)

This is a page-by-page text tree of the current landing site. It mirrors the structure in the repo and notes where pages are powered by Supabase content.

- Shared layout
  - `_app.tsx` wraps everything in `Layout`
  - `Layout`: `Header` + `main` + `Footer`
  - `Header`: built from `Header` → `Navbar` + `AuthButtons`.
    - Data: fetched globally from `site_sections` (client-side in `Layout`).
  - `Footer`: built from `Footer`.
    - Data: fetched globally from `site_sections` (client-side in `Layout`).

- `/` (home)
  - `PageLayout` wrapper
  - `HeroSection`: headline + copy, buttons → register student/teacher
  - `TaglineSection`: short value prop
  - `LearningToolsSection`: cards for Interactive Games, Digital Flashcards, Progress Tracking, Practice Exercises, Audio Resources, Video Lessons
  - `ServicesSection`: cards for Student Portal, Teacher Resources, Interactive Learning, Progress Tracking, Assessment Tools, Communication Hub
  - `PricingSection`: tiers (Free Access, Individual, Teacher, School) with CTA per card
  - `RegisterCTASection`: CTA → `/Auth/register`
  - Data sources (current):
    - `pages` + `page_sections` (section copy)
    - `content_items` (pricing tiers, services, learning tools)
  - Notes:
    - Home is strict: missing required Supabase env/seeded content causes SSG/build to fail.

- `/pricing`
  - `PricingTable`: header badge + title/subtitle
  - Plans: Basic (Free) → `/Auth/register/student`; Premium (Most Popular) → `/Auth/register/student`; Enterprise → `/contact`
  - Footer note: 14-day trial + link to contact
  - Data sources (current):
    - `pages` + `page_sections` (`pricing-header`, `pricing-footer`)
    - `content_items` (`pricing_plan`)

- `/about`
  - `AboutUsSection`
    - Hero title/subtitle
    - Description + stats grid (Students, Teachers, Success Rate, Support)
    - Mission block (copy + 3 points)
    - Vision block (copy + 3 goals)
    - Team grid (Shinade Groves, Bobby Brown, Nathan Van Der Watt)
    - Values grid (Excellence, Community, Innovation, Accessibility)
  - Data sources (current):
    - `pages` + `page_sections` (copy blocks)
    - `content_items` (`team_member`, `about_stat`, `core_value`)

- `/contact`
  - `PageLayout` wrapper
  - `ContactHeroSection`: title/subtitle + email + phone
  - `ContactFormSection`: fields first/last/email/subject/message + submit (all labels DB-driven)
  - `ContactFAQSection`: accordion list of FAQs
  - Data sources (current):
    - `pages` + `page_sections` (`hero`, `form` with form_labels, `faq`)
    - `content_items` (`faq`)
  - Notes:
    - Contact is strict: missing required Supabase env/seeded content causes SSG/build to fail.
    - Form labels (First Name, Last Name, Email, Subject, Message, Submit button) are stored in `form` section's `form_labels` object.

- `/platforms/teacher`
  - `TeacherHeroSection`: headline, CTA → `/Auth/register/teacher`, hero image
  - `TeachingToolsSection`: grid of tools (Lesson Planner, Student Analytics, Interactive Resources, Assessment Tools, Progress Tracking, Resource Library)
  - `LessonModulesSection`: selectable module cards (Beginner, Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced, Business English, Exam Prep, Conversation, Specialized) with lessons/duration/class size
  - `TeacherBenefitsSection`: grid of benefits (Ready-Made Content, Student Progress Tracking, Interactive Learning, Flexible Scheduling)
  - `TeacherCTASection`: CTA → `/Auth/register/teacher`
  - Data sources (current):
    - `pages` + `page_sections` (hero/tools/lesson-modules/benefits/cta copy)
    - `content_items` (`teaching_tool`, `lesson_module`, `teacher_benefit`)
  - Notes:
    - Teacher platform is strict: missing required Supabase env/seeded content causes SSG/build to fail.

- `/platforms/student`
  - `StudentHeroSection`: headline + CTA → `/Auth/register/student`
  - `StudentCharactersSection`: character cards (Cassidy, Emma, Luke, Riley) + copy
  - `StudentPlanetsSection`: rotating planets carousel with start/stop controls
  - `StudentCTASection`: CTA → `/Auth/register/student`
  - Data sources (current):
    - `pages` + `page_sections` (hero/characters/planets/cta copy)
    - `content_items` (`student_character`, `student_planet`)

- `/courses`
  - Placeholder page with title and empty course grid
  - Data sources (current): static placeholder

- Auth flows (DB-driven pages)
  - Login selection: `/Auth/login` — platform selection page (student/teacher buttons)
    - Data: `pages` + `page_sections` (`selection` section with title, subtitle, button labels, register prompt)
  - Register selection: `/Auth/register` — platform selection page (student/teacher buttons)
    - Data: `pages` + `page_sections` (`selection` section with title, subtitle, button labels, login prompt)
  - Password recovery: `/Auth/forgot-password` — email input form + success state
    - Data: `pages` + `page_sections` (`form` section with form content and success content)
  - Reset password: `/Auth/reset-password` — password reset form + success state
    - Data: `pages` + `page_sections` (`form` section with form content and success content)
  - Teacher pending: `/Auth/register/teacher/pending` — registration pending message
    - Data: `pages` + `page_sections` (`content` section with title, messages array, button)
  - Notes:
    - All auth pages are strict: missing required Supabase env/seeded content causes SSG/build to fail.
    - Role-specific login/register pages (`/Auth/login/student`, `/Auth/login/teacher`, etc.) are handled by shared components.

- System pages
  - `/404` — error page
    - Data: `site_sections` (`404` section with title, message, home_link_text)
    - Notes: 404 page is strict: missing required site_sections content causes SSG/build to fail.

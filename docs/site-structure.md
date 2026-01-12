# Repository Page Tree (text view)

This is a page-by-page text tree of the current landing site. It mirrors the visible structure in the repo (no runtime data or API calls).

- Shared layout
  - `_app.tsx` wraps everything in `Layout`
  - `Layout`: `Header` + `main` + `Footer`
  - `Header`: `Logo` → home, `Navbar` (Platforms dropdown: Teacher, Student; Pricing; About; Contact), `AuthButtons` (Login → `/Auth/login`, Get Started → `/Auth/register`)
  - `Footer`: Socials (LinkedIn, Instagram, Facebook), Company (About, Pricing, Register), Support (Contact, FAQ, Terms & Conditions, Cookie Policy), bottom bar copy

- `/` (home)
  - `PageLayout` wrapper
  - `HeroSection`: headline + copy, buttons → register student/teacher
  - `TaglineSection`: short value prop
  - `LearningToolsSection`: cards for Interactive Games, Digital Flashcards, Progress Tracking, Practice Exercises, Audio Resources, Video Lessons
  - `ServicesSection`: cards for Student Portal, Teacher Resources, Interactive Learning, Progress Tracking, Assessment Tools, Communication Hub
  - `PricingSection`: tiers (Free Access, Individual, Teacher, School) with CTA per card
  - `RegisterCTASection`: CTA → `/Auth/register`

- `/pricing`
  - `PricingTable`: header badge + title/subtitle
  - Plans: Basic (Free) → `/Auth/register/student`; Premium (Most Popular) → `/Auth/register/student`; Enterprise → `/contact`
  - Footer note: 14-day trial + link to contact

- `/about`
  - `AboutUsSection`
    - Hero title/subtitle
    - Description + stats grid (Students, Teachers, Success Rate, Support)
    - Mission block (copy + 3 points)
    - Vision block (copy + 3 goals)
    - Team grid (Shinade Groves, Bobby Brown, Nathan Van Der Watt)
    - Values grid (Excellence, Community, Innovation, Accessibility)

- `/contact`
  - `PageLayout` wrapper
  - `ContactHeroSection`: title/subtitle + email + phone
  - `ContactFormSection`: fields first/last/email/subject/message + submit
  - `ContactFAQSection`: accordion list of FAQs

- `/platforms/teacher`
  - `TeacherHeroSection`: headline, CTA → `/Auth/register/teacher`, hero image
  - `TeachingToolsSection`: grid of tools (Lesson Planner, Student Analytics, Interactive Resources, Assessment Tools, Progress Tracking, Resource Library)
  - `LessonModulesSection`: selectable module cards (Beginner, Elementary, Pre-Intermediate, Intermediate, Upper-Intermediate, Advanced, Business English, Exam Prep, Conversation, Specialized) with lessons/duration/class size
  - `TeacherBenefitsSection`: grid of benefits (Ready-Made Content, Student Progress Tracking, Interactive Learning, Flexible Scheduling)
  - `TeacherCTASection`: CTA → `/Auth/register/teacher`

- `/platforms/student`
  - `StudentHeroSection`: headline + CTA → `/Auth/register/student`
  - `StudentCharactersSection`: character cards (Cassidy, Emma, Luke, Riley) + copy
  - `StudentPlanetsSection`: rotating planets carousel with start/stop controls
  - `StudentCTASection`: CTA → `/Auth/register/student`

- `/courses`
  - Placeholder page with title and empty course grid

- Auth flows (static pages)
  - Login: `/Auth/login`, `/Auth/login/student`, `/Auth/login/teacher`, `/Auth/login/admin`
  - Register: `/Auth/register`, `/Auth/register/student`, `/Auth/register/teacher`, `/Auth/register/teacher/pending`
  - Password recovery: `/Auth/forgot-password`, `/Auth/reset-password`

- System pages
  - `/404`

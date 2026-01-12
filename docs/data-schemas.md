# Data Schemas (proposed)

TypeScript-ish interfaces to align UI, APIs, and DB.

```ts
type CTA = {
  label: string;
  href: string;
  targetRole?: "student" | "teacher" | "admin";
};

type PricingPlan = {
  id: string;
  name: string;
  price: number | "free" | "custom";
  period: "month" | "year" | "";
  badge?: string;
  description: string;
  features: string[];
  cta: CTA;
};

type Card = {
  id: string;
  page: string;
  section: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  backgroundIcons?: string[];
  cta?: CTA;
};

type FAQ = { id: string; page: string; question: string; answer: string };

type Module = {
  id: string;
  name: string;
  description: string;
  lessons: string;
  duration: string;
  classSize: string;
  color?: string;
  icon?: string;
};

type Character = { id: string; name: string; image: string; role?: string };
type Planet = {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  title: string;
  image: string;
  bio: string;
  expertise: string[];
};

type Stat = { label: string; value: string };

type RouteRule = {
  role: "student" | "teacher" | "admin";
  unauthTarget: string;
  authTarget: string;
  verificationTarget?: string;
};
```

Use these as a shared contract for DB tables/collections and API responses. Seed data can mirror these shapes for SSR/static usage.

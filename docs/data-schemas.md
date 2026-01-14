# Data Schemas (current)

This doc describes the shapes used by the current Supabase-backed content model.

## Core tables

### `pages`

```ts
type PageRow = {
  id: string; // uuid
  route: string; // e.g. "/", "/about"
  title?: string | null;
  meta_description?: string | null;
  layout?: string | null;
};
```

### `page_sections`

```ts
type PageSectionRow = {
  id: string; // uuid
  page_id: string; // uuid -> pages.id
  section_key: string; // e.g. "hero", "footer"
  section_type: string; // e.g. "hero", "cta", "footer"
  sort_order: number;
  active: boolean;
  content: Record<string, any>; // JSONB
};
```

### `content_items`

```ts
type ContentItemRow = {
  id: string; // uuid
  content_type: string; // e.g. "pricing", "service", "learning_tool"
  slug?: string | null; // stable unique key (seed v2 uses this)
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  content: Record<string, any>; // JSONB
  metadata: Record<string, any>; // JSONB
  sort_order: number;
  active: boolean;
};
```

## `page_sections.content` shapes (used today)

### Home (`/`) sections

#### `hero`

```ts
type HeroSectionContent = {
  title: string;
  subtitle: string;
  buttons: Array<{ label: string; href: string }>;
};
```

#### `tagline`

```ts
type TaglineSectionContent = {
  title: string;
  subtitle: string;
};
```

#### `learning-tools`

```ts
type LearningToolsSectionContent = {
  title: string;
  subtitle: string;
};
```

#### `how-we-teach`

```ts
type HowWeTeachSectionContent = {
  title: string;
  description: string;
  tabs: Array<{ title: string; content: string; icon?: string }>;
};
```

#### `services`

```ts
type ServicesSectionContent = {
  title: string;
  subtitle: string;
};
```

#### `pricing`

```ts
type PricingSectionContent = {
  title: string;
  subtitle: string;
};
```

#### `register-cta`

```ts
type RegisterCTASectionContent = {
  title: string;
  subtitle: string;
  cta_label: string;
  cta_href: string;
};
```

### Global layout sections (`site_sections.content`)

#### `header`

```ts
type HeaderSectionContent = {
  navbar: {
    dropdown: {
      label: string;
      items: Array<{ label: string; href: string }>;
    };
    links: Array<{ label: string; href: string }>;
  };
  auth_buttons: {
    login: { label: string; href: string };
    register: { label: string; href: string };
  };
};
```

#### `footer`

```ts
type FooterSectionContent = {
  columns: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  bottom_bar: string[];
};
```

### About (`/about`) sections

#### `/about`: `hero`

```ts
type AboutHeroSectionContent = {
  title: string;
  subtitle: string;
};
```

#### `/about`: `description`

```ts
type AboutDescriptionSectionContent = {
  body: string;
};
```

#### `/about`: `tagline`

```ts
type AboutTaglineSectionContent = {
  text: string;
};
```

#### `/about`: `mission`

```ts
type AboutMissionSectionContent = {
  title: string;
  body: string;
  points: string[];
};
```

#### `/about`: `vision`

```ts
type AboutVisionSectionContent = {
  title: string;
  body: string;
  goals: string[];
};
```

#### `/about`: `team-intro`

```ts
type AboutTeamIntroSectionContent = {
  title: string;
  body: string;
};
```

#### `/about`: `values-header`

```ts
type AboutValuesHeaderSectionContent = {
  title: string;
};
```

### Contact (`/contact`) sections

#### `/contact`: `hero`

```ts
type ContactHeroSectionContent = {
  title: string;
  subtitle: string;
  contact_methods: Array<{ icon: string; href: string; text: string }>;
};
```

#### `/contact`: `form`

```ts
type ContactFormSectionContent = {
  title: string;
  subtitle: string;
  subject_options: string[];
};
```

#### `/contact`: `faq`

```ts
type ContactFAQSectionContent = {
  title: string;
  subtitle: string;
};
```

### Pricing (`/pricing`) sections + items

#### `/pricing`: `pricing-header`

```ts
type PricingHeaderSectionContent = {
  badge: string;
  title: string;
  subtitle: string;
};
```

#### `/pricing`: `pricing-footer`

```ts
type PricingFooterSectionContent = {
  note: string;
  help_text: string;
  help_href: string;
  help_label: string;
};
```

#### `/pricing`: `content_items` (`pricing_plan`)

```ts
type PricingPlanItemContent = {
  variant: "basic" | "premium" | "enterprise";
  featured?: boolean;
  price: string; // e.g. "0", "9.99", "Custom"
  currency?: string; // e.g. "$"
  period?: string; // e.g. "/month"
  button: { label: string; href: string; style?: "default" | "primary" | "enterprise" };
  features: string[];
};
```

### Student platform (`/platforms/student`) sections + items

#### `/platforms/student`: `hero`

```ts
type StudentPlatformHeroSectionContent = {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string; width: number; height: number };
};
```

#### `/platforms/student`: `characters`

```ts
type StudentPlatformCharactersSectionContent = {
  intro: string;
  outro: string;
};
```

#### `/platforms/student`: `planets`

```ts
type StudentPlatformPlanetsSectionContent = {
  title: string;
  toggle_on_label: string;
  toggle_off_label: string;
  autoplay_ms: number;
};
```

#### `/platforms/student`: `cta`

```ts
type StudentPlatformCTASectionContent = {
  title: string;
  button: { label: string; href: string };
};
```

#### `/platforms/student`: `content_items` (`student_character`)

```ts
type StudentCharacterItemContent = {
  imageUrl: string;
};
```

#### `/platforms/student`: `content_items` (`student_planet`)

```ts
type StudentPlanetItemContent = {
  color: string; // css var string
  icon: string; // emoji
};
```

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

### Global layout sections stored on `/` today

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

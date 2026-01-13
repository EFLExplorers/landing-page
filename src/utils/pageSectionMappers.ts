import type { PageSection } from "../pages/api/page-content";
import type { FooterContent } from "../components/layout/Header-Footer/Footer";
import type { HeaderContent } from "../components/layout/Header-Footer/Header";

export const mapFooterContentFromSection = (
  section?: PageSection | null
): FooterContent | null => {
  if (!section) return null;
  const columns =
    ((section.content as any)?.columns as FooterContent["columns"]) || [];
  const bottomBar =
    ((section.content as any)?.bottom_bar as FooterContent["bottomBar"]) || [];

  if (!columns.length && !bottomBar.length) return null;

  return {
    columns,
    bottomBar,
  };
};

export const mapHeaderContentFromSection = (
  section?: PageSection | null
): HeaderContent | null => {
  if (!section) return null;
  const raw = (section.content as any) ?? {};

  const navbar = raw.navbar ?? raw.nav ?? null;
  const authButtons = raw.auth_buttons ?? raw.authButtons ?? null;

  if (!navbar && !authButtons) return null;

  return {
    navbar: navbar ?? undefined,
    authButtons: authButtons ?? undefined,
  };
};


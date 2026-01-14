import type { SupabaseClient } from "@supabase/supabase-js";
import type { HeaderContent } from "../components/layout/Header-Footer/Header";
import type { FooterContent } from "../components/layout/Header-Footer/Footer";
import { mapFooterContentFromSection, mapHeaderContentFromSection } from "./pageSectionMappers";

export interface GlobalLayoutContent {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
}

export const getGlobalLayoutContent = async (
  supabase: SupabaseClient
): Promise<GlobalLayoutContent> => {
  const { data, error } = await supabase
    .from("site_sections")
    .select("section_key, content, active")
    .in("section_key", ["header", "footer"])
    .eq("active", true);

  if (error || !data?.length) {
    return { headerContent: null, footerContent: null };
  }

  const headerRow = data.find((s: any) => s.section_key === "header") || null;
  const footerRow = data.find((s: any) => s.section_key === "footer") || null;

  return {
    headerContent: mapHeaderContentFromSection(headerRow as any),
    footerContent: mapFooterContentFromSection(footerRow as any),
  };
};


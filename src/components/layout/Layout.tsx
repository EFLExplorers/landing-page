import { ReactNode, useEffect, useState } from "react";
import { Header, type HeaderContent } from "./Header-Footer/Header";
import { Footer, type FooterContent } from "./Header-Footer/Footer";
import styles from "../../styles/Layout.module.css";
import { supabase, isSupabaseConfigured } from "../../utils/supabaseClient";
import {
  mapFooterContentFromSection,
  mapHeaderContentFromSection,
} from "../../utils/pageSectionMappers";

interface LayoutProps {
  children: ReactNode;
  headerContent?: HeaderContent | null;
  footerContent?: FooterContent | null;
}

export const Layout = ({
  children,
  headerContent = null,
  footerContent = null,
}: LayoutProps) => {
  // Prefer server-provided header/footer; fall back to client fetch when missing.
  const [resolvedHeaderContent, setResolvedHeaderContent] =
    useState<HeaderContent | null>(headerContent);
  const [resolvedFooterContent, setResolvedFooterContent] =
    useState<FooterContent | null>(footerContent);

  useEffect(() => {
    // If a page didn't (or couldn't) provide global content at build time,
    // fall back to fetching it client-side.
    if (resolvedHeaderContent || resolvedFooterContent) return;
    if (!isSupabaseConfigured) return;

    const fetchGlobalSections = async () => {
      const { data, error } = await supabase
        .from("site_sections")
        .select("section_key, content, active")
        .in("section_key", ["header", "footer"])
        .eq("active", true);

      if (error || !data?.length) return;

      const headerRow =
        data.find((s: any) => s.section_key === "header") || null;
      const footerRow =
        data.find((s: any) => s.section_key === "footer") || null;

      setResolvedHeaderContent(mapHeaderContentFromSection(headerRow as any));
      setResolvedFooterContent(mapFooterContentFromSection(footerRow as any));
    };

    void fetchGlobalSections();
  }, [resolvedHeaderContent, resolvedFooterContent]);

  return (
    <div className={styles.appContainer}>
      <Header content={resolvedHeaderContent} />
      <main className={styles.main}>{children}</main>
      <Footer content={resolvedFooterContent} />
    </div>
  );
};

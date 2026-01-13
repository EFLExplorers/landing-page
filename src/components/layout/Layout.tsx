import { ReactNode, useEffect, useState } from "react";
import { Header, type HeaderContent } from "./Header-Footer/Header";
import { Footer, type FooterContent } from "./Header-Footer/Footer";
import styles from "../../styles/Layout.module.css";
import { supabase, isSupabaseConfigured } from "../../utils/supabaseClient";
import { mapFooterContentFromSection, mapHeaderContentFromSection } from "../../utils/pageSectionMappers";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({
  children,
}: LayoutProps) => {
  const [headerContent, setHeaderContent] = useState<HeaderContent | null>(null);
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchGlobalSections = async () => {
      const { data, error } = await supabase
        .from("site_sections")
        .select("*")
        .in("section_key", ["header", "footer"])
        .eq("active", true);

      if (error || !data?.length) return;

      const headerRow = data.find((s: any) => s.section_key === "header") || null;
      const footerRow = data.find((s: any) => s.section_key === "footer") || null;

      // Reuse existing mappers by adapting rows to PageSection-ish shape (content only)
      setHeaderContent(mapHeaderContentFromSection(headerRow as any));
      setFooterContent(mapFooterContentFromSection(footerRow as any));
    };

    void fetchGlobalSections();
  }, []);

  return (
    <div className={styles.appContainer}>
      <Header content={headerContent} />
      <main className={styles.main}>{children}</main>
      <Footer content={footerContent} />
    </div>
  );
};

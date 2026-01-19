import React from "react";
import Link from "next/link";
import type { GetStaticProps } from "next";
import type { HeaderContent } from "@/components/layout/Header-Footer/Header";
import type { FooterContent } from "@/components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "@/utils/globalSections";
import styles from "./404.module.css";

interface Custom404Props {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  title: string;
  message: string;
  homeLinkText: string;
}

export default function Custom404({
  title,
  message,
  homeLinkText,
}: Custom404Props) {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <p>{message}</p>
      <Link href="/">{homeLinkText}</Link>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Custom404Props> = async () => {
  const { supabase, isSupabaseConfigured } = await import(
    "@/utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error("[404] Supabase environment variables are missing.");
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  // Fetch 404 page content from site_sections
  const { data: sectionData, error: sectionError } = await supabase
    .from("site_sections")
    .select("content")
    .eq("section_key", "404")
    .eq("active", true)
    .single();

  if (sectionError || !sectionData) {
    throw new Error(
      `[404] Missing site_sections row for section_key '404': ${
        sectionError?.message || "no data"
      }`
    );
  }

  const content = sectionData.content as any;
  if (!content.title || !content.message || !content.home_link_text) {
    throw new Error(
      "[404] Missing required content fields in 404 site_section (title, message, home_link_text)"
    );
  }

  return {
    props: {
      headerContent,
      footerContent,
      title: content.title,
      message: content.message,
      homeLinkText: content.home_link_text,
    },
  };
};

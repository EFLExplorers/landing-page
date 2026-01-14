import {
  TeacherHeroSection,
  TeachingToolsSection,
  LessonModulesSection,
  TeacherBenefitsSection,
  TeacherCTASection,
} from "@/components/layout/TeacherPlatform";
import styles from "./teacher.module.css";
import type { GetStaticProps } from "next";
import type { HeaderContent } from "@/components/layout/Header-Footer/Header";
import type { FooterContent } from "@/components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "@/utils/globalSections";

interface TeacherPlatformPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
}

export default function TeacherPlatform(_props: TeacherPlatformPageProps) {
  return (
    <main className={styles.main}>
      <TeacherHeroSection />
      <TeachingToolsSection />
      <LessonModulesSection />
      <TeacherBenefitsSection />
      <TeacherCTASection />
    </main>
  );
}

export const getStaticProps: GetStaticProps<TeacherPlatformPageProps> = async () => {
  const { supabase, isSupabaseConfigured } = await import(
    "@/utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    return { props: { headerContent: null, footerContent: null }, revalidate: 300 };
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(supabase);
  return { props: { headerContent, footerContent }, revalidate: 300 };
};


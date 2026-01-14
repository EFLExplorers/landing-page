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
import type { PageSection } from "@/pages/api/page-content";
import type {
  TeachingToolLite,
} from "@/components/layout/TeacherPlatform/TeachingToolsSection";
import type {
  LessonModuleLite,
  LessonModuleColorKey,
} from "@/components/layout/TeacherPlatform/LessonModulesSection";
import type {
  TeacherBenefitLite,
} from "@/components/layout/TeacherPlatform/TeacherBenefitsSection";

interface TeacherPlatformPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  heroSection: PageSection | null;
  toolsSection: PageSection | null;
  modulesSection: PageSection | null;
  benefitsSection: PageSection | null;
  ctaSection: PageSection | null;
  tools: TeachingToolLite[];
  modules: LessonModuleLite[];
  benefits: TeacherBenefitLite[];
}

const emptyTeacherProps: TeacherPlatformPageProps = {
  headerContent: null,
  footerContent: null,
  heroSection: null,
  toolsSection: null,
  modulesSection: null,
  benefitsSection: null,
  ctaSection: null,
  tools: [],
  modules: [],
  benefits: [],
};

export default function TeacherPlatform(props: TeacherPlatformPageProps) {
  return (
    <main className={styles.main}>
      <TeacherHeroSection section={props.heroSection} />
      <TeachingToolsSection section={props.toolsSection} tools={props.tools} />
      <LessonModulesSection section={props.modulesSection} modules={props.modules} />
      <TeacherBenefitsSection
        section={props.benefitsSection}
        benefits={props.benefits}
      />
      <TeacherCTASection section={props.ctaSection} />
    </main>
  );
}

export const getStaticProps: GetStaticProps<TeacherPlatformPageProps> = async () => {
  const { supabase, isSupabaseConfigured } = await import(
    "@/utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    return { props: emptyTeacherProps, revalidate: 300 };
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(supabase);

  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id, route, title, meta_description")
    .eq("route", "/platforms/teacher")
    .single();

  if (pageError || !pageData?.id) {
    return { props: { ...emptyTeacherProps, headerContent, footerContent }, revalidate: 300 };
  }

  const { data: sectionsData } = await supabase
    .from("page_sections")
    .select(
      "id, section_key, section_type, title, subtitle, heading, subheading, body, cta_label, cta_href, content, data, settings, sort_order, active"
    )
    .eq("page_id", pageData.id)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  const sections = sectionsData || [];
  const heroSection = sections.find((s) => s.section_key === "hero") || null;
  const toolsSection = sections.find((s) => s.section_key === "tools") || null;
  const modulesSection =
    sections.find((s) => s.section_key === "lesson-modules") || null;
  const benefitsSection =
    sections.find((s) => s.section_key === "benefits") || null;
  const ctaSection = sections.find((s) => s.section_key === "cta") || null;

  const [toolsData, modulesData, benefitsData] = await Promise.all([
    supabase
      .from("content_items")
      .select("id, title, description, content, sort_order, active")
      .eq("page_id", pageData.id)
      .eq("content_type", "teaching_tool")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("content_items")
      .select("id, title, description, content, sort_order, active")
      .eq("page_id", pageData.id)
      .eq("content_type", "lesson_module")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("content_items")
      .select("id, title, description, content, sort_order, active")
      .eq("page_id", pageData.id)
      .eq("content_type", "teacher_benefit")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const tools: TeachingToolLite[] = (toolsData.data || [])
    .map((row: any) => ({
      id: row.id,
      title: row.title || "",
      description: row.description || "",
      icon: row.content?.icon || "",
    }))
    .filter((t: TeachingToolLite) => t.id && t.title && t.description);

  const modules: LessonModuleLite[] = (modulesData.data || [])
    .map((row: any) => ({
      id: row.id,
      name: row.title || "",
      description: row.description || "",
      students: row.content?.students || "",
      lessons: row.content?.lessons || "",
      duration: row.content?.duration || "",
      colorKey: (row.content?.colorKey || "accent") as LessonModuleColorKey,
    }))
    .filter((m: LessonModuleLite) => m.id && m.name && m.description);

  const benefits: TeacherBenefitLite[] = (benefitsData.data || [])
    .map((row: any) => ({
      id: row.id,
      title: row.title || "",
      description: row.description || "",
    }))
    .filter((b: TeacherBenefitLite) => b.id && b.title && b.description);

  return {
    props: {
      headerContent,
      footerContent,
      heroSection,
      toolsSection,
      modulesSection,
      benefitsSection,
      ctaSection,
      tools,
      modules,
      benefits,
    },
    revalidate: 300,
  };
};


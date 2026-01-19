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
import type { TeachingToolLite } from "@/components/layout/TeacherPlatform/TeachingToolsSection";
import type {
  LessonModuleLite,
  LessonModuleColorKey,
} from "@/components/layout/TeacherPlatform/LessonModulesSection";
import type { TeacherBenefitLite } from "@/components/layout/TeacherPlatform/TeacherBenefitsSection";

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
      <LessonModulesSection
        section={props.modulesSection}
        modules={props.modules}
      />
      <TeacherBenefitsSection
        section={props.benefitsSection}
        benefits={props.benefits}
      />
      <TeacherCTASection section={props.ctaSection} />
    </main>
  );
}

export const getStaticProps: GetStaticProps<
  TeacherPlatformPageProps
> = async () => {
  const { supabase, isSupabaseConfigured } = await import(
    "@/utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error(
      "[TeacherPlatform] Supabase environment variables are missing."
    );
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id, route, title, meta_description")
    .eq("route", "/platforms/teacher")
    .single();

  if (pageError || !pageData?.id) {
    throw new Error(
      `[TeacherPlatform] Missing pages row for route '/platforms/teacher': ${
        pageError?.message || "no id"
      }`
    );
  }

  const { data: sectionsData, error: sectionsError } = await supabase
    .from("page_sections")
    .select(
      "id, section_key, section_type, title, subtitle, heading, subheading, body, cta_label, cta_href, content, data, settings, sort_order, active"
    )
    .eq("page_id", pageData.id)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (sectionsError || !sectionsData?.length) {
    throw new Error(
      `[TeacherPlatform] Missing page_sections for '/platforms/teacher': ${
        sectionsError?.message || "none"
      }`
    );
  }

  const sections = sectionsData;
  const heroSection = sections.find((s) => s.section_key === "hero") || null;
  const toolsSection = sections.find((s) => s.section_key === "tools") || null;
  const modulesSection =
    sections.find((s) => s.section_key === "lesson-modules") || null;
  const benefitsSection =
    sections.find((s) => s.section_key === "benefits") || null;
  const ctaSection = sections.find((s) => s.section_key === "cta") || null;

  if (!heroSection) throw new Error("[TeacherPlatform] Missing hero section.");
  if (!toolsSection)
    throw new Error("[TeacherPlatform] Missing tools section.");
  if (!modulesSection)
    throw new Error("[TeacherPlatform] Missing lesson-modules section.");
  if (!benefitsSection)
    throw new Error("[TeacherPlatform] Missing benefits section.");
  if (!ctaSection) throw new Error("[TeacherPlatform] Missing cta section.");

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

  if (toolsData.error) throw new Error(toolsData.error.message);
  if (modulesData.error) throw new Error(modulesData.error.message);
  if (benefitsData.error) throw new Error(benefitsData.error.message);

  if (!toolsData.data || toolsData.data.length === 0) {
    throw new Error("[TeacherPlatform] Missing teaching tools.");
  }
  if (!modulesData.data || modulesData.data.length === 0) {
    throw new Error("[TeacherPlatform] Missing lesson modules.");
  }
  if (!benefitsData.data || benefitsData.data.length === 0) {
    throw new Error("[TeacherPlatform] Missing teacher benefits.");
  }

  const tools: TeachingToolLite[] = toolsData.data.map((row: any) => {
    if (!row.id || !row.title || !row.description || !row.content) {
      throw new Error(
        "[TeacherPlatform] Teaching tool missing required fields"
      );
    }
    if (!row.content.icon) {
      throw new Error(
        "[TeacherPlatform] Teaching tool missing icon in content"
      );
    }
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.content.icon,
    };
  });

  const modules: LessonModuleLite[] = modulesData.data.map((row: any) => {
    if (!row.id || !row.title || !row.description || !row.content) {
      throw new Error(
        "[TeacherPlatform] Lesson module missing required fields"
      );
    }
    if (
      !row.content.students ||
      !row.content.lessons ||
      !row.content.duration ||
      !row.content.colorKey
    ) {
      throw new Error(
        "[TeacherPlatform] Lesson module missing required content fields (students, lessons, duration, colorKey)"
      );
    }
    return {
      id: row.id,
      name: row.title,
      description: row.description,
      students: row.content.students,
      lessons: row.content.lessons,
      duration: row.content.duration,
      colorKey: row.content.colorKey as LessonModuleColorKey,
    };
  });

  const benefits: TeacherBenefitLite[] = benefitsData.data.map((row: any) => {
    if (!row.id || !row.title || !row.description) {
      throw new Error(
        "[TeacherPlatform] Teacher benefit missing required fields (id, title, description)"
      );
    }
    return {
      id: row.id,
      title: row.title,
      description: row.description,
    };
  });

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
  };
};

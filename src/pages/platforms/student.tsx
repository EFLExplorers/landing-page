import {
  StudentCTASection,
  StudentCharactersSection,
  StudentHeroSection,
  StudentPlanetsSection,
} from "@/components/layout/StudentPlatform";
import styles from "./student.module.css";
import type { GetStaticProps } from "next";
import type { PageSection } from "@/pages/api/page-content";
import type { StudentCharacter } from "@/components/layout/StudentPlatform/sections/CharactersSection";
import type { StudentPlanet } from "@/components/layout/StudentPlatform/sections/PlanetsSection";
import type { HeaderContent } from "@/components/layout/Header-Footer/Header";
import type { FooterContent } from "@/components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "@/utils/globalSections";

interface StudentPlatformPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  heroSection: PageSection | null;
  charactersSection: PageSection | null;
  planetsSection: PageSection | null;
  ctaSection: PageSection | null;
  characters: StudentCharacter[];
  planets: StudentPlanet[];
}

const emptyStudentPlatformProps: StudentPlatformPageProps = {
  headerContent: null,
  footerContent: null,
  heroSection: null,
  charactersSection: null,
  planetsSection: null,
  ctaSection: null,
  characters: [],
  planets: [],
};

export default function StudentPlatform(props: StudentPlatformPageProps) {
  const {
    heroSection,
    charactersSection,
    planetsSection,
    ctaSection,
    characters,
    planets,
  } = props;

  return (
    <main className={styles.main}>
      <StudentHeroSection section={heroSection} />
      <StudentCharactersSection
        section={charactersSection}
        characters={characters}
      />
      <StudentPlanetsSection section={planetsSection} planets={planets} />
      <StudentCTASection section={ctaSection} />
    </main>
  );
}

export const getStaticProps: GetStaticProps<
  StudentPlatformPageProps
> = async () => {
  try {
    const { supabase, isSupabaseConfigured } = await import(
      "@/utils/supabaseClient"
    );

    if (!isSupabaseConfigured) {
      console.warn(
        "[StudentPlatform] Supabase environment variables are missing; using empty content."
      );
      return { props: emptyStudentPlatformProps, revalidate: 300 };
    }

    const { headerContent, footerContent } = await getGlobalLayoutContent(
      supabase
    );

    const { data: pageData } = await supabase
      .from("pages")
      .select("id, route, title, meta_description")
      .eq("route", "/platforms/student")
      .single();

    const { data: sectionsData } = await supabase
      .from("page_sections")
      .select(
        "id, section_key, section_type, title, subtitle, heading, subheading, body, cta_label, cta_href, content, data, settings, sort_order, active"
      )
      .eq("page_id", pageData?.id || "")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    const sections = sectionsData || [];

    const heroSection = sections.find((s) => s.section_key === "hero") || null;
    const charactersSection =
      sections.find((s) => s.section_key === "characters") || null;
    const planetsSection =
      sections.find((s) => s.section_key === "planets") || null;
    const ctaSection = sections.find((s) => s.section_key === "cta") || null;

    const { data: characterItems } = await supabase
      .from("content_items")
      .select("slug, title, content, sort_order, active")
      .eq("page_id", pageData?.id || "")
      .eq("content_type", "student_character")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    const { data: planetItems } = await supabase
      .from("content_items")
      .select("slug, title, content, sort_order, active")
      .eq("page_id", pageData?.id || "")
      .eq("content_type", "student_planet")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    const characters: StudentCharacter[] = (characterItems || [])
      .map((item: any) => ({
        slug: item.slug,
        name: item.title || "",
        imageUrl: item.content?.imageUrl || "",
      }))
      .filter((c: StudentCharacter) => c.slug && c.name && c.imageUrl);

    const planets: StudentPlanet[] = (planetItems || [])
      .map((item: any) => ({
        slug: item.slug,
        name: item.title || "",
        color: item.content?.color || "",
        icon: item.content?.icon || "",
      }))
      .filter((p: StudentPlanet) => p.slug && p.name && p.color && p.icon);

    return {
      props: {
        headerContent,
        footerContent,
        heroSection,
        charactersSection,
        planetsSection,
        ctaSection,
        characters,
        planets,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.warn(
      "[StudentPlatform] Failed to load DB content; using empty content.",
      { error }
    );
    return { props: emptyStudentPlatformProps, revalidate: 300 };
  }
};

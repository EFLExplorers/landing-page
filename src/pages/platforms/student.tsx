import {
  StudentCTASection,
  StudentCharactersSection,
  StudentHeroSection,
  StudentPlanetsSection,
} from "@/components/layout/StudentPlatform";
import styles from "./student.module.css";
import type { GetStaticProps } from "next";
import type { PageContent, PageSection } from "@/pages/api/page-content";
import type { StudentCharacter } from "@/components/layout/StudentPlatform/sections/CharactersSection";
import type { StudentPlanet } from "@/components/layout/StudentPlatform/sections/PlanetsSection";

interface StudentPlatformPageProps {
  pageData: PageContent;
  heroSection: PageSection | null;
  charactersSection: PageSection | null;
  planetsSection: PageSection | null;
  ctaSection: PageSection | null;
  characters: StudentCharacter[];
  planets: StudentPlanet[];
}

const emptyStudentPlatformProps: StudentPlatformPageProps = {
  pageData: {
    id: "",
    route: "/platforms/student",
    title: "",
    meta_description: "",
    sections: [],
  },
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

    const pageContent: PageContent = pageData
      ? {
          id: pageData.id,
          route: pageData.route,
          title: pageData.title,
          meta_description: pageData.meta_description,
          sections: sectionsData || [],
        }
      : { id: "", route: "/platforms/student", sections: [] };

    const heroSection =
      pageContent.sections.find((s) => s.section_key === "hero") || null;
    const charactersSection =
      pageContent.sections.find((s) => s.section_key === "characters") || null;
    const planetsSection =
      pageContent.sections.find((s) => s.section_key === "planets") || null;
    const ctaSection =
      pageContent.sections.find((s) => s.section_key === "cta") || null;

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
        pageData: pageContent,
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

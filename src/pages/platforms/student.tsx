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
  const { supabase, isSupabaseConfigured } = await import(
    "@/utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error(
      "[StudentPlatform] Supabase environment variables are missing."
    );
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id, route, title, meta_description")
    .eq("route", "/platforms/student")
    .single();

  if (pageError || !pageData?.id) {
    throw new Error(
      `[StudentPlatform] Missing pages row for route '/platforms/student': ${
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
      `[StudentPlatform] Missing page_sections for '/platforms/student': ${
        sectionsError?.message || "none"
      }`
    );
  }

  const sections = sectionsData;

  const heroSection = sections.find((s) => s.section_key === "hero") || null;
  const charactersSection =
    sections.find((s) => s.section_key === "characters") || null;
  const planetsSection =
    sections.find((s) => s.section_key === "planets") || null;
  const ctaSection = sections.find((s) => s.section_key === "cta") || null;

  if (!heroSection) throw new Error("[StudentPlatform] Missing hero section.");
  if (!charactersSection)
    throw new Error("[StudentPlatform] Missing characters section.");
  if (!planetsSection)
    throw new Error("[StudentPlatform] Missing planets section.");
  if (!ctaSection) throw new Error("[StudentPlatform] Missing cta section.");

  const { data: characterItems, error: characterError } = await supabase
    .from("content_items")
    .select("slug, title, content, sort_order, active")
    .eq("page_id", pageData.id)
    .eq("content_type", "student_character")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (characterError) throw new Error(characterError.message);

  const { data: planetItems, error: planetError } = await supabase
    .from("content_items")
    .select("slug, title, content, sort_order, active")
    .eq("page_id", pageData.id)
    .eq("content_type", "student_planet")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (planetError) throw new Error(planetError.message);

  if (!characterItems || characterItems.length === 0) {
    throw new Error("[StudentPlatform] Missing student characters.");
  }
  if (!planetItems || planetItems.length === 0) {
    throw new Error("[StudentPlatform] Missing student planets.");
  }

  const characters: StudentCharacter[] = characterItems.map((item: any) => {
    if (!item.slug || !item.title || !item.content) {
      throw new Error(
        "[StudentPlatform] Student character missing required fields"
      );
    }
    if (!item.content.imageUrl) {
      throw new Error(
        "[StudentPlatform] Student character missing imageUrl in content"
      );
    }
    return {
      slug: item.slug,
      name: item.title,
      imageUrl: item.content.imageUrl,
    };
  });

  const planets: StudentPlanet[] = planetItems.map((item: any) => {
    if (!item.slug || !item.title || !item.content) {
      throw new Error(
        "[StudentPlatform] Student planet missing required fields"
      );
    }
    if (!item.content.color || !item.content.icon) {
      throw new Error(
        "[StudentPlatform] Student planet missing color or icon in content"
      );
    }
    return {
      slug: item.slug,
      name: item.title,
      color: item.content.color,
      icon: item.content.icon,
    };
  });

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
  };
};

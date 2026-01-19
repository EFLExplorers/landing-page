import type { NextPage } from "next";
import Head from "next/head";
import { GetStaticProps } from "next";
import {
  AboutUsSection,
  TeamMember,
  AboutStat,
  CoreValue,
} from "../components/layout/About/AboutUsSection";
import { ContentErrorBoundary } from "../components/common/ErrorBoundary";
import { PageSection } from "./api/page-content";
import type { HeaderContent } from "../components/layout/Header-Footer/Header";
import type { FooterContent } from "../components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "../utils/globalSections";

interface AboutPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  pageTitle: string;
  pageDescription: string;
  teamMembers: TeamMember[];
  stats: AboutStat[];
  coreValues: CoreValue[];
  heroSection: PageSection | null;
  descriptionSection: PageSection | null;
  taglineSection: PageSection | null;
  missionSection: PageSection | null;
  visionSection: PageSection | null;
  teamIntroSection: PageSection | null;
  valuesHeaderSection: PageSection | null;
}

const emptyAboutProps: AboutPageProps = {
  headerContent: null,
  footerContent: null,
  pageTitle: "",
  pageDescription: "",
  teamMembers: [],
  stats: [],
  coreValues: [],
  heroSection: null,
  descriptionSection: null,
  taglineSection: null,
  missionSection: null,
  visionSection: null,
  teamIntroSection: null,
  valuesHeaderSection: null,
};

export const AboutPage: NextPage<AboutPageProps> = ({
  pageTitle,
  pageDescription,
  teamMembers,
  stats,
  coreValues,
  heroSection,
  descriptionSection,
  taglineSection,
  missionSection,
  visionSection,
  teamIntroSection,
  valuesHeaderSection,
}) => {

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
      </Head>
      <ContentErrorBoundary contentType="about page content">
        <AboutUsSection
          heroSection={heroSection}
          descriptionSection={descriptionSection}
          taglineSection={taglineSection}
          missionSection={missionSection}
          visionSection={visionSection}
          teamIntroSection={teamIntroSection}
          valuesHeaderSection={valuesHeaderSection}
          teamMembers={teamMembers}
          stats={stats}
          coreValues={coreValues}
        />
      </ContentErrorBoundary>
    </>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  // During build time, use direct API calls instead of fetch
  const { supabase, isSupabaseConfigured } = await import(
    "../utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error("[About] Supabase environment variables are missing.");
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  // Fetch page content
  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id, route, title, meta_description")
    .eq("route", "/about")
    .single();

  if (pageError || !pageData?.id) {
    throw new Error(
      `[About] Missing pages row for route '/about': ${
        pageError?.message || "no id"
      }`
    );
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
  if (!pageData.title || !pageData.meta_description) {
    throw new Error(
      "[About] Missing required page fields (title, meta_description)"
    );
  }

  const pageTitle = pageData.title;
  const pageDescription = pageData.meta_description;

  // Find specific sections
  const heroSection = sections.find((s) => s.section_key === "hero") || null;
  const descriptionSection =
    sections.find((s) => s.section_key === "description") || null;
  const taglineSection =
    sections.find((s) => s.section_key === "tagline") || null;
  const missionSection =
    sections.find((s) => s.section_key === "mission") || null;
  const visionSection =
    sections.find((s) => s.section_key === "vision") || null;
  const teamIntroSection =
    sections.find((s) => s.section_key === "team-intro") || null;
  const valuesHeaderSection =
    sections.find((s) => s.section_key === "values-header") || null;

  // Fetch content types from the unified content_items table (scoped to /about)
  const [teamData, statsData, valuesData] = await Promise.all([
    supabase
      .from("content_items")
      .select(
        "id, title, subtitle, description, content, slug, sort_order, active"
      )
      .eq("page_id", pageData.id)
      .eq("content_type", "team_member")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("content_items")
      .select(
        "id, title, subtitle, description, content, slug, sort_order, active"
      )
      .eq("page_id", pageData.id)
      .eq("content_type", "about_stat")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("content_items")
      .select(
        "id, title, subtitle, description, content, slug, sort_order, active"
      )
      .eq("page_id", pageData.id)
      .eq("content_type", "core_value")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (teamData.error) throw new Error(teamData.error.message);
  if (statsData.error) throw new Error(statsData.error.message);
  if (valuesData.error) throw new Error(valuesData.error.message);

  if (!teamData.data || teamData.data.length === 0) {
    throw new Error("[About] Missing team members.");
  }
  if (!statsData.data || statsData.data.length === 0) {
    throw new Error("[About] Missing about stats.");
  }
  if (!valuesData.data || valuesData.data.length === 0) {
    throw new Error("[About] Missing core values.");
  }

  const teamMembers: TeamMember[] = teamData.data.map((row: any) => {
    if (!row.id || !row.title || !row.subtitle || !row.description || !row.content) {
      throw new Error(
        "[About] Team member missing required fields"
      );
    }
    return {
      id: row.id,
      name: row.title,
      role: row.subtitle,
      title: row.content.role || "",
      image: row.content.image || "",
      bio: row.description,
      expertise: row.content.expertise || [],
    };
  });

  const stats: AboutStat[] = statsData.data.map((row: any) => {
    if (!row.id || !row.title || !row.description) {
      throw new Error(
        "[About] About stat missing required fields (id, title, description)"
      );
    }
    return {
      id: row.id,
      number: row.title,
      label: row.description,
    };
  });

  const coreValues: CoreValue[] = valuesData.data.map((row: any) => {
    if (!row.id || !row.title || !row.description || !row.content) {
      throw new Error(
        "[About] Core value missing required fields"
      );
    }
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      icon: row.content.icon || "",
    };
  });

  if (!heroSection) throw new Error("[About] Missing hero section.");
  if (!descriptionSection)
    throw new Error("[About] Missing description section.");
  if (!taglineSection) throw new Error("[About] Missing tagline section.");
  if (!missionSection) throw new Error("[About] Missing mission section.");
  if (!visionSection) throw new Error("[About] Missing vision section.");
  if (!teamIntroSection) throw new Error("[About] Missing team-intro section.");
  if (!valuesHeaderSection)
    throw new Error("[About] Missing values-header section.");
  if (!teamMembers.length) throw new Error("[About] Missing team members.");
  if (!stats.length) throw new Error("[About] Missing stats.");
  if (!coreValues.length) throw new Error("[About] Missing core values.");

  return {
    props: {
      headerContent,
      footerContent,
      pageTitle,
      pageDescription,
      teamMembers,
      stats,
      coreValues,
      heroSection,
      descriptionSection,
      taglineSection,
      missionSection,
      visionSection,
      teamIntroSection,
      valuesHeaderSection,
    },
  };
};

export default AboutPage;

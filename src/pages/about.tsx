import type { NextPage } from "next";
import Head from "next/head";
import { GetStaticProps } from "next";
import {
  AboutUsSection,
  AboutUsSectionProps,
  TeamMember,
  AboutStat,
  CoreValue,
} from "../components/layout/About/AboutUsSection";
import { ContentErrorBoundary } from "../components/common/ErrorBoundary";
import { PageContent, PageSection } from "./api/page-content";

interface AboutPageProps {
  pageData: PageContent;
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
  pageData: {
    id: "",
    route: "/about",
    title: "",
    meta_description: "",
    sections: [],
  },
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
  pageData,
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
  const safePageData: PageContent = pageData || {
    id: "",
    route: "/about",
    title: "",
    meta_description: "",
    sections: [],
  };

  const pageTitle = safePageData.title || "";
  const pageDescription = safePageData.meta_description || "";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {pageDescription ? (
          <meta name="description" content={pageDescription} />
        ) : null}
        {pageTitle ? <meta property="og:title" content={pageTitle} /> : null}
        {pageDescription ? (
          <meta property="og:description" content={pageDescription} />
        ) : null}
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
  try {
    // During build time, use direct API calls instead of fetch
    const { supabase, isSupabaseConfigured } = await import(
      "../utils/supabaseClient"
    );

    if (!isSupabaseConfigured) {
      console.warn(
        "[About] Supabase environment variables are missing; using empty content."
      );
      return {
        props: emptyAboutProps,
        revalidate: 300,
      };
    }

    // Fetch page content
    const { data: pageData } = await supabase
      .from("pages")
      .select("*")
      .eq("route", "/about")
      .single();

    const { data: sectionsData } = await supabase
      .from("page_sections")
      .select("*")
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
      : { id: "", route: "/about", sections: [] };

    // Fetch content types from the unified content_items table
    const [teamData, statsData, valuesData] = await Promise.all([
      supabase
        .from("content_items")
        .select("*")
        .eq("content_type", "team_member")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("content_items")
        .select("*")
        .eq("content_type", "about_stat")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("content_items")
        .select("*")
        .eq("content_type", "core_value")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const teamMembers: TeamMember[] = teamData.data || [];
    const stats: AboutStat[] = statsData.data || [];
    const coreValues: CoreValue[] = valuesData.data || [];

    // Find specific sections
    const heroSection =
      pageContent.sections?.find((s) => s.section_key === "hero") || null;
    const descriptionSection =
      pageContent.sections?.find((s) => s.section_key === "description") ||
      null;
    const taglineSection =
      pageContent.sections?.find((s) => s.section_key === "tagline") || null;
    const missionSection =
      pageContent.sections?.find((s) => s.section_key === "mission") || null;
    const visionSection =
      pageContent.sections?.find((s) => s.section_key === "vision") || null;
    const teamIntroSection =
      pageContent.sections?.find((s) => s.section_key === "team-intro") || null;
    const valuesHeaderSection =
      pageContent.sections?.find((s) => s.section_key === "values-header") ||
      null;

    const safePageData: PageContent = pageData
      ? {
          id: pageData.id,
          route: pageData.route,
          title: pageData.title || "",
          meta_description: pageData.meta_description || "",
          sections: sectionsData || [],
        }
      : {
          id: "",
          route: "/about",
          title: "",
          meta_description: "",
          sections: [],
        };

    return {
      props: {
        pageData: safePageData,
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
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return {
      props: emptyAboutProps,
      revalidate: 300,
    };
  }
};

export default AboutPage;

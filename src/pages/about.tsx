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
      return { props: emptyAboutProps, revalidate: 300 };
    }

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

    const pageContent: PageContent = {
      id: pageData.id,
      route: pageData.route,
      title: pageData.title,
      meta_description: pageData.meta_description,
      sections: sectionsData || [],
    };

    // Find specific sections
    const heroSection =
      pageContent.sections.find((s) => s.section_key === "hero") || null;
    const descriptionSection =
      pageContent.sections.find((s) => s.section_key === "description") || null;
    const taglineSection =
      pageContent.sections.find((s) => s.section_key === "tagline") || null;
    const missionSection =
      pageContent.sections.find((s) => s.section_key === "mission") || null;
    const visionSection =
      pageContent.sections.find((s) => s.section_key === "vision") || null;
    const teamIntroSection =
      pageContent.sections.find((s) => s.section_key === "team-intro") || null;
    const valuesHeaderSection =
      pageContent.sections.find((s) => s.section_key === "values-header") ||
      null;

    // Fetch content types from the unified content_items table (scoped to /about)
    const [teamData, statsData, valuesData] = await Promise.all([
      supabase
        .from("content_items")
        .select("id, title, subtitle, description, content, slug, sort_order, active")
        .eq("page_id", pageData.id)
        .eq("content_type", "team_member")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("content_items")
        .select("id, title, subtitle, description, content, slug, sort_order, active")
        .eq("page_id", pageData.id)
        .eq("content_type", "about_stat")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("content_items")
        .select("id, title, subtitle, description, content, slug, sort_order, active")
        .eq("page_id", pageData.id)
        .eq("content_type", "core_value")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (teamData.error) throw new Error(teamData.error.message);
    if (statsData.error) throw new Error(statsData.error.message);
    if (valuesData.error) throw new Error(valuesData.error.message);

    const teamMembers: TeamMember[] = (teamData.data || []).map((row: any) => ({
      id: row.id,
      name: row.title || "",
      role: row.subtitle || "",
      title: row.content?.role || "",
      image: row.content?.image || "",
      bio: row.description || "",
      expertise: row.content?.expertise || [],
    }));

    const stats: AboutStat[] = (statsData.data || []).map((row: any) => ({
      id: row.id,
      number: row.title || "",
      label: row.description || "",
    }));

    const coreValues: CoreValue[] = (valuesData.data || []).map((row: any) => ({
      id: row.id,
      title: row.title || "",
      description: row.description || "",
      icon: row.content?.icon || "",
    }));

    if (!heroSection) throw new Error("[About] Missing hero section.");
    if (!descriptionSection)
      throw new Error("[About] Missing description section.");
    if (!taglineSection) throw new Error("[About] Missing tagline section.");
    if (!missionSection) throw new Error("[About] Missing mission section.");
    if (!visionSection) throw new Error("[About] Missing vision section.");
    if (!teamIntroSection)
      throw new Error("[About] Missing team-intro section.");
    if (!valuesHeaderSection)
      throw new Error("[About] Missing values-header section.");
    if (!teamMembers.length) throw new Error("[About] Missing team members.");
    if (!stats.length) throw new Error("[About] Missing stats.");
    if (!coreValues.length) throw new Error("[About] Missing core values.");

    return {
      props: {
        pageData: pageContent,
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
    console.warn("[About] Failed to load DB content; using empty content.", {
      error,
    });
    return { props: emptyAboutProps, revalidate: 300 };
  }
};

export default AboutPage;

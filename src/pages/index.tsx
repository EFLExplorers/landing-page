import { GetStaticProps } from "next";
import { useEffect } from "react";
import { PageLayout } from "../components/layout/PageLayout";
import HeroSection, {
  HeroSectionProps,
} from "../components/layout/Home/HeroSection";
import TaglineSection, {
  TaglineSectionProps,
} from "../components/layout/Home/TaglineSection";
import LearningToolsSection, {
  LearningToolsSectionProps,
} from "../components/layout/Home/LearningToolsSection";
import ServicesSection, {
  ServicesSectionProps,
} from "../components/layout/Home/ServicesSection";
import {
  PricingSection,
  PricingSectionProps,
} from "../components/layout/Home/PricingSection";
import {
  RegisterCTASection,
  RegisterCTASectionProps,
} from "../components/layout/Home/RegisterCTASection";
import {
  HowWeTeachSection,
  HowWeTeachSectionProps,
} from "../components/layout/Home/HowWeTeachSection";
import { ContentErrorBoundary } from "../components/common/ErrorBoundary";
import { PageContent } from "./api/page-content";
import { PricingTier, Service, LearningTool } from "./api/content";

interface HomePageProps {
  heroSection: PageContent["sections"][0] | null;
  taglineSection: PageContent["sections"][0] | null;
  registerCTASection: PageContent["sections"][0] | null;
  servicesSection: PageContent["sections"][0] | null;
  pricingSection: PageContent["sections"][0] | null;
  learningToolsSection: PageContent["sections"][0] | null;
  howWeTeachSection: PageContent["sections"][0] | null;
  pricingTiers: PricingTier[];
  services: Service[];
  learningTools: LearningTool[];
}

const emptyHomeProps: HomePageProps = {
  heroSection: null,
  taglineSection: null,
  registerCTASection: null,
  servicesSection: null,
  pricingSection: null,
  learningToolsSection: null,
  howWeTeachSection: null,
  pricingTiers: [],
  services: [],
  learningTools: [],
};

export const HomePage = ({
  heroSection,
  taglineSection,
  registerCTASection,
  servicesSection,
  pricingSection,
  learningToolsSection,
  howWeTeachSection,
  pricingTiers,
  services,
  learningTools,
}: HomePageProps) => {
  useEffect(() => {
    console.groupCollapsed("[Home] data snapshot");
    console.log("Hero section:", heroSection?.id || "none");
    console.log("Tagline section:", taglineSection?.id || "none");
    console.log("Register CTA section:", registerCTASection?.id || "none");
    console.log("How we teach section:", howWeTeachSection?.id || "none");
    console.log(
      "Pricing tiers count:",
      pricingTiers.length,
      pricingTiers.map((p) => p.id)
    );
    console.log(
      "Services count:",
      services.length,
      services.map((s) => s.id)
    );
    console.log(
      "Learning tools count:",
      learningTools.length,
      learningTools.map((t) => t.id)
    );
    console.groupEnd();
  }, [
    heroSection,
    taglineSection,
    registerCTASection,
    howWeTeachSection,
    pricingTiers,
    services,
    learningTools,
  ]);

  return (
    <PageLayout>
      <ContentErrorBoundary contentType="hero section">
        <HeroSection section={heroSection} />
      </ContentErrorBoundary>

      <ContentErrorBoundary contentType="tagline section">
        <TaglineSection section={taglineSection} />
      </ContentErrorBoundary>

      <ContentErrorBoundary contentType="learning tools">
        <LearningToolsSection
          section={learningToolsSection}
          tools={learningTools}
        />
      </ContentErrorBoundary>

      <ContentErrorBoundary contentType="how we teach">
        <HowWeTeachSection section={howWeTeachSection} />
      </ContentErrorBoundary>

      <ContentErrorBoundary contentType="services">
        <ServicesSection section={servicesSection} services={services} />
      </ContentErrorBoundary>

      <ContentErrorBoundary contentType="pricing">
        <PricingSection section={pricingSection} pricingTiers={pricingTiers} />
      </ContentErrorBoundary>

      <ContentErrorBoundary contentType="register CTA">
        <RegisterCTASection section={registerCTASection} />
      </ContentErrorBoundary>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    // During build time, use direct API calls instead of fetch
    const { supabase, isSupabaseConfigured } = await import(
      "../utils/supabaseClient"
    );

    if (!isSupabaseConfigured) {
      console.warn(
        "[Home] Supabase environment variables are missing; using empty content."
      );
      return {
        props: emptyHomeProps,
        revalidate: 300,
      };
    }

    // Fetch page content
    const { data: pageData } = await supabase
      .from("pages")
      .select("*")
      .eq("route", "/")
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
      : { id: "", route: "/", sections: [] };

    // Find specific sections
    const heroSection = pageContent.sections.find(
      (s) => s.section_key === "hero"
    );
    const taglineSection = pageContent.sections.find(
      (s) => s.section_key === "tagline"
    );
    const registerCTASection = pageContent.sections.find(
      (s) => s.section_key === "register-cta"
    );
    const servicesSection = pageContent.sections.find(
      (s) => s.section_key === "services"
    );
    const pricingSection = pageContent.sections.find(
      (s) => s.section_key === "pricing"
    );
    const learningToolsSection = pageContent.sections.find(
      (s) => s.section_key === "learning-tools"
    );
    const howWeTeachSection = pageContent.sections.find(
      (s) => s.section_key === "how-we-teach"
    );

    // Fetch content types from the unified content_items table
    const [pricingData, servicesData, toolsData] = await Promise.all([
      supabase
        .from("content_items")
        .select("*")
        .eq("content_type", "pricing")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("content_items")
        .select("*")
        .eq("content_type", "service")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("content_items")
        .select("*")
        .eq("content_type", "learning_tool")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const pricingTiers: PricingTier[] = pricingData.data || [];
    const services: Service[] = servicesData.data || [];
    const learningTools: LearningTool[] = toolsData.data || [];

    return {
      props: {
        heroSection: heroSection || null,
        taglineSection: taglineSection || null,
        registerCTASection: registerCTASection || null,
        servicesSection: servicesSection || null,
        pricingSection: pricingSection || null,
        learningToolsSection: learningToolsSection || null,
        howWeTeachSection: howWeTeachSection || null,
        pricingTiers,
        services,
        learningTools,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return {
      props: emptyHomeProps,
      revalidate: 300,
    };
  }
};

export default HomePage;

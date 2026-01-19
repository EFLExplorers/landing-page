import { GetStaticProps } from "next";
import { PageLayout } from "../components/layout/PageLayout";
import HeroSection from "../components/layout/Home/HeroSection";
import TaglineSection from "../components/layout/Home/TaglineSection";
import LearningToolsSection from "../components/layout/Home/LearningToolsSection";
import ServicesSection from "../components/layout/Home/ServicesSection";
import { PricingSection } from "../components/layout/Home/PricingSection";
import { RegisterCTASection } from "../components/layout/Home/RegisterCTASection";
import { HowWeTeachSection } from "../components/layout/Home/HowWeTeachSection";
import { ContentErrorBoundary } from "../components/common/ErrorBoundary";
import type { PageSection } from "./api/page-content";
import type { PricingTierLite } from "../components/layout/Home/PricingSection";
import type { ServiceLite } from "../components/layout/Home/ServicesSection";
import type { LearningToolLite } from "../components/layout/Home/LearningToolsSection";
import type { HeaderContent } from "../components/layout/Header-Footer/Header";
import type { FooterContent } from "../components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "../utils/globalSections";

interface HomePageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  heroSection: PageSection | null;
  taglineSection: PageSection | null;
  registerCTASection: PageSection | null;
  servicesSection: PageSection | null;
  pricingSection: PageSection | null;
  learningToolsSection: PageSection | null;
  howWeTeachSection: PageSection | null;
  pricingTiers: PricingTierLite[];
  services: ServiceLite[];
  learningTools: LearningToolLite[];
}

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
  // During build time, use direct API calls instead of fetch
  const { supabase, isSupabaseConfigured } = await import(
    "../utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error("[Home] Supabase environment variables are missing.");
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  // Fetch page content
  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id, route, title, meta_description")
    .eq("route", "/")
    .single();

  if (pageError || !pageData?.id) {
    throw new Error(
      `[Home] Missing pages row for route '/': ${pageError?.message || "no id"}`
    );
  }

  const { data: sectionsData, error: sectionsError } = await supabase
    .from("page_sections")
    .select(
      "id, section_key, title, subtitle, heading, subheading, body, cta_label, cta_href, content, data"
    )
    .eq("page_id", pageData.id)
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (sectionsError || !sectionsData?.length) {
    throw new Error(
      `[Home] Missing page_sections for '/': ${
        sectionsError?.message || "none"
      }`
    );
  }

  // Only keep the fields the home UI actually reads (reduces __NEXT_DATA__ payload)
  const sections: PageSection[] = (sectionsData || []).map((s: any) => {
    const out: any = {
      id: s.id,
      section_key: s.section_key,
      section_type: "",
      content: s.content ?? {},
      sort_order: 0,
      active: true,
    };

    // Only add keys when present; avoid `undefined` in props (Next.js serialization)
    if (s.title != null) out.title = s.title;
    if (s.subtitle != null) out.subtitle = s.subtitle;
    if (s.heading != null) out.heading = s.heading;
    if (s.subheading != null) out.subheading = s.subheading;
    if (s.body != null) out.body = s.body;
    if (s.cta_label != null) out.cta_label = s.cta_label;
    if (s.cta_href != null) out.cta_href = s.cta_href;
    if (s.data != null) out.data = s.data;

    return out as PageSection;
  });

  // Find specific sections
  const heroSection = sections.find((s) => s.section_key === "hero") || null;
  const taglineSection =
    sections.find((s) => s.section_key === "tagline") || null;
  const registerCTASection =
    sections.find((s) => s.section_key === "register-cta") || null;
  const servicesSection =
    sections.find((s) => s.section_key === "services") || null;
  const pricingSection =
    sections.find((s) => s.section_key === "pricing") || null;
  const learningToolsSection =
    sections.find((s) => s.section_key === "learning-tools") || null;
  const howWeTeachSection =
    sections.find((s) => s.section_key === "how-we-teach") || null;

  // Fetch content types from the unified content_items table
  const [pricingData, servicesData, toolsData] = await Promise.all([
    supabase
      .from("content_items")
      .select("id, title, description, content")
      .eq("page_id", pageData.id)
      .eq("content_type", "pricing")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("content_items")
      .select("id, title, description, content")
      .eq("page_id", pageData.id)
      .eq("content_type", "service")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("content_items")
      .select("id, title, description, content")
      .eq("page_id", pageData.id)
      .eq("content_type", "learning_tool")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (pricingData.error) throw new Error(pricingData.error.message);
  if (servicesData.error) throw new Error(servicesData.error.message);
  if (toolsData.error) throw new Error(toolsData.error.message);

  if (!pricingData.data || pricingData.data.length === 0) {
    throw new Error("[Home] Missing pricing tiers.");
  }
  if (!servicesData.data || servicesData.data.length === 0) {
    throw new Error("[Home] Missing services.");
  }
  if (!toolsData.data || toolsData.data.length === 0) {
    throw new Error("[Home] Missing learning tools.");
  }

  const pricingTiers: PricingTierLite[] = pricingData.data.map((row: any) => {
    if (!row.id || !row.content) {
      throw new Error(
        "[Home] Pricing tier missing required fields (id, content)"
      );
    }
    const out: any = { id: row.id, content: row.content };
    if (row.title != null) out.title = row.title;
    if (row.description != null) out.description = row.description;
    return out as PricingTierLite;
  });

  const services: ServiceLite[] = servicesData.data.map((row: any) => {
    if (!row.id || !row.content) {
      throw new Error(
        "[Home] Service missing required fields (id, content)"
      );
    }
    const out: any = { id: row.id, content: row.content };
    if (row.title != null) out.title = row.title;
    if (row.description != null) out.description = row.description;
    return out as ServiceLite;
  });

  const learningTools: LearningToolLite[] = toolsData.data.map((row: any) => {
    if (!row.id || !row.content) {
      throw new Error(
        "[Home] Learning tool missing required fields (id, content)"
      );
    }
    const out: any = { id: row.id, content: row.content };
    if (row.title != null) out.title = row.title;
    if (row.description != null) out.description = row.description;
    return out as LearningToolLite;
  });

  return {
    props: {
      headerContent,
      footerContent,
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
    },
  };
};

export default HomePage;

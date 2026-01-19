import type { NextPage } from "next";
import Head from "next/head";
import { GetStaticProps } from "next";
import {
  PricingTable,
  type PricingPlan,
} from "../components/layout/Pricing/PricingTable";
import { PageLayout } from "../components/layout/PageLayout";
import type { PageSection } from "./api/page-content";
import type { HeaderContent } from "../components/layout/Header-Footer/Header";
import type { FooterContent } from "../components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "../utils/globalSections";

interface PricingPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  pageTitle: string;
  pageDescription: string;
  headerSection: PageSection | null;
  footerSection: PageSection | null;
  plans: PricingPlan[];
}

const emptyPricingProps: PricingPageProps = {
  headerContent: null,
  footerContent: null,
  pageTitle: "",
  pageDescription: "",
  headerSection: null,
  footerSection: null,
  plans: [],
};

export const Pricing: NextPage<PricingPageProps> = ({
  pageTitle,
  pageDescription,
  headerSection,
  footerSection,
  plans,
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <PageLayout>
        <PricingTable
          headerSection={headerSection}
          footerSection={footerSection}
          plans={plans}
        />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<PricingPageProps> = async () => {
  // During build time, use direct API calls instead of fetch
  const { supabase, isSupabaseConfigured } = await import(
    "../utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error("[Pricing] Supabase environment variables are missing.");
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  // Fetch page content
  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id, route, title, meta_description")
    .eq("route", "/pricing")
    .single();

  if (pageError || !pageData?.id) {
    throw new Error(
      `[Pricing] Missing pages row for route '/pricing': ${
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
      `[Pricing] Missing page_sections for '/pricing': ${
        sectionsError?.message || "none"
      }`
    );
  }

  const sections = sectionsData;
  if (!pageData.title || !pageData.meta_description) {
    throw new Error(
      "[Pricing] Missing required page fields (title, meta_description)"
    );
  }

  const pageTitle = pageData.title;
  const pageDescription = pageData.meta_description;

  const headerSection =
    sections.find((s) => s.section_key === "pricing-header") || null;
  const footerSection =
    sections.find((s) => s.section_key === "pricing-footer") || null;

  if (!headerSection) {
    throw new Error("[Pricing] Missing pricing-header section.");
  }

  if (!footerSection) {
    throw new Error("[Pricing] Missing pricing-footer section.");
  }

  const { data: planItems, error: planError } = await supabase
    .from("content_items")
    .select("slug, title, subtitle, description, content, sort_order, active")
    .eq("page_id", pageData.id)
    .eq("content_type", "pricing_plan")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (planError) throw new Error(planError.message);
  if (!planItems || planItems.length === 0) {
    throw new Error("[Pricing] Missing pricing plans.");
  }

  const plans: PricingPlan[] = planItems.map((item: any) => {
    if (!item.slug || !item.title || !item.content) {
      throw new Error(
        "[Pricing] Pricing plan missing required fields (slug, title, content)"
      );
    }
    return {
      slug: item.slug,
      title: item.title,
      badge: item.subtitle || null,
      description: item.description || null,
      content: item.content,
    };
  });

  return {
    props: {
      headerContent,
      footerContent,
      pageTitle,
      pageDescription,
      headerSection,
      footerSection,
      plans,
    },
  };
};

export default Pricing;

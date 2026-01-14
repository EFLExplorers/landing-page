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
  const safeTitle = pageTitle || "Pricing - ESL Explorers";
  const safeDescription =
    pageDescription ||
    "Choose the best plan to improve your English skills with ESL Explorers.";

  return (
    <>
      <Head>
        <title>{safeTitle}</title>
        <meta name="description" content={safeDescription} />
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
  try {
    const { supabase, isSupabaseConfigured } = await import(
      "../utils/supabaseClient"
    );

    if (!isSupabaseConfigured) {
      console.warn(
        "[Pricing] Supabase environment variables are missing; using empty content."
      );
      return { props: emptyPricingProps, revalidate: 300 };
    }

    const { headerContent, footerContent } = await getGlobalLayoutContent(
      supabase
    );

    const { data: pageData } = await supabase
      .from("pages")
      .select("id, route, title, meta_description")
      .eq("route", "/pricing")
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
    const pageTitle = pageData?.title || "";
    const pageDescription = pageData?.meta_description || "";

    const headerSection =
      sections.find((s) => s.section_key === "pricing-header") || null;
    const footerSection =
      sections.find((s) => s.section_key === "pricing-footer") || null;

    const { data: planItems } = await supabase
      .from("content_items")
      .select("slug, title, subtitle, description, content, sort_order, active")
      .eq("page_id", pageData?.id || "")
      .eq("content_type", "pricing_plan")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    const plans: PricingPlan[] = (planItems || []).map((item: any) => ({
      slug: item.slug,
      title: item.title || "",
      badge: item.subtitle || null,
      description: item.description || null,
      content: item.content || {},
    }));

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
      revalidate: 300,
    };
  } catch (error) {
    console.warn("[Pricing] Failed to load DB content; using empty content.", {
      error,
    });
    return { props: emptyPricingProps, revalidate: 300 };
  }
};

export default Pricing;

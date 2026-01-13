import type { NextPage } from "next";
import Head from "next/head";
import { GetStaticProps } from "next";
import {
  PricingTable,
  type PricingPlan,
} from "../components/layout/Pricing/PricingTable";
import { PageLayout } from "../components/layout/PageLayout";
import type { PageContent, PageSection } from "./api/page-content";

interface PricingPageProps {
  pageData: PageContent;
  headerSection: PageSection | null;
  footerSection: PageSection | null;
  plans: PricingPlan[];
}

const emptyPricingProps: PricingPageProps = {
  pageData: {
    id: "",
    route: "/pricing",
    title: "",
    meta_description: "",
    sections: [],
  },
  headerSection: null,
  footerSection: null,
  plans: [],
};

export const Pricing: NextPage<PricingPageProps> = ({
  pageData,
  headerSection,
  footerSection,
  plans,
}) => {
  const pageTitle = pageData?.title || "Pricing - ESL Explorers";
  const pageDescription =
    pageData?.meta_description ||
    "Choose the best plan to improve your English skills with ESL Explorers.";

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

    const { data: pageData } = await supabase
      .from("pages")
      .select("*")
      .eq("route", "/pricing")
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
      : { id: "", route: "/pricing", sections: [] };

    const headerSection =
      pageContent.sections.find((s) => s.section_key === "pricing-header") ||
      null;
    const footerSection =
      pageContent.sections.find((s) => s.section_key === "pricing-footer") ||
      null;

    const { data: planItems } = await supabase
      .from("content_items")
      .select("*")
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
        pageData: pageContent,
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

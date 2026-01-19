import type { NextPage } from "next";
import Head from "next/head";
import { GetStaticProps } from "next";
import { PageLayout } from "../components/layout/PageLayout";
import { ContactHeroSection } from "../components/layout/Contact/ContactHeroSection";
import { ContactFormSection } from "../components/layout/Contact/ContactFormSection";
import {
  ContactFAQSection,
  type ContactFAQ,
} from "../components/layout/Contact/ContactFAQSection";
import type { PageSection } from "./api/page-content";
import type { HeaderContent } from "../components/layout/Header-Footer/Header";
import type { FooterContent } from "../components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "../utils/globalSections";

interface ContactPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  pageTitle: string;
  pageDescription: string;
  heroSection: PageSection | null;
  formSection: PageSection | null;
  faqSection: PageSection | null;
  faqs: ContactFAQ[];
}

const emptyContactProps: ContactPageProps = {
  headerContent: null,
  footerContent: null,
  pageTitle: "",
  pageDescription: "",
  heroSection: null,
  formSection: null,
  faqSection: null,
  faqs: [],
};

export const ContactPage: NextPage<ContactPageProps> = ({
  pageTitle,
  pageDescription,
  heroSection,
  formSection,
  faqSection,
  faqs,
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="EFL contact, English learning support, language education help, contact us"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
      </Head>
      <PageLayout>
        <ContactHeroSection section={heroSection} />
        <ContactFormSection section={formSection} />
        <ContactFAQSection section={faqSection} faqs={faqs} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  // strict: contact is DB-driven (SSR so build doesn't depend on seeded DB)
  const { supabase, isSupabaseConfigured } = await import(
    "../utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error("[Contact] Supabase environment variables are missing.");
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id, route, title, meta_description")
    .eq("route", "/contact")
    .single();

  if (pageError || !pageData?.id) {
    throw new Error(
      `[Contact] Missing pages row for route '/contact': ${
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
      `[Contact] Missing page_sections for '/contact': ${
        sectionsError?.message || "none"
      }`
    );
  }

  if (!pageData.title || !pageData.meta_description) {
    throw new Error(
      "[Contact] Missing required page fields (title, meta_description)"
    );
  }

  const pageTitle = pageData.title;
  const pageDescription = pageData.meta_description;

  const sections = sectionsData;
  const heroSection = sections.find((s) => s.section_key === "hero") || null;
  const formSection = sections.find((s) => s.section_key === "form") || null;
  const faqSection = sections.find((s) => s.section_key === "faq") || null;

  if (!heroSection) throw new Error("[Contact] Missing hero section.");
  if (!formSection) throw new Error("[Contact] Missing form section.");
  if (!faqSection) throw new Error("[Contact] Missing faq section.");

  const { data: faqItems, error: faqError } = await supabase
    .from("content_items")
    .select("title, description, content, sort_order, active")
    .eq("page_id", pageData.id)
    .eq("content_type", "faq")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (faqError) throw new Error(faqError.message);

  if (!faqItems || faqItems.length === 0) {
    throw new Error("[Contact] Missing FAQ items.");
  }

  const faqs: ContactFAQ[] = faqItems.map((item: any) => {
    if (!item.title || !item.description) {
      throw new Error(
        "[Contact] FAQ item missing required fields (title, description)"
      );
    }
    return {
      question: item.title,
      answer: item.description,
    };
  });

  if (!faqs.length) throw new Error("[Contact] Missing FAQ items.");

  return {
    props: {
      headerContent,
      footerContent,
      pageTitle,
      pageDescription,
      heroSection,
      formSection,
      faqSection,
      faqs,
    },
  };
};

export default ContactPage;

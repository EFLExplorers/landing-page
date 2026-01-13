import type { NextPage } from "next";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { PageLayout } from "../components/layout/PageLayout";
import { ContactHeroSection } from "../components/layout/Contact/ContactHeroSection";
import { ContactFormSection } from "../components/layout/Contact/ContactFormSection";
import {
  ContactFAQSection,
  type ContactFAQ,
} from "../components/layout/Contact/ContactFAQSection";
import type { PageContent, PageSection } from "./api/page-content";

interface ContactPageProps {
  pageData: PageContent;
  heroSection: PageSection | null;
  formSection: PageSection | null;
  faqSection: PageSection | null;
  faqs: ContactFAQ[];
}

const emptyContactProps: ContactPageProps = {
  pageData: { id: "", route: "/contact", title: "", meta_description: "", sections: [] },
  heroSection: null,
  formSection: null,
  faqSection: null,
  faqs: [],
};

export const ContactPage: NextPage<ContactPageProps> = ({
  pageData,
  heroSection,
  formSection,
  faqSection,
  faqs,
}) => {
  const pageTitle = pageData?.title || "Contact Us - ESL Explorers";
  const pageDescription =
    pageData?.meta_description ||
    "Get in touch with ESL Explorers. We're here to help with your English learning journey through innovative education methods and dedicated support.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="ESL contact, English learning support, language education help, contact us"
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

export const getServerSideProps: GetServerSideProps<ContactPageProps> = async () => {
  // strict: contact is DB-driven (SSR so build doesn't depend on seeded DB)
  const { supabase, isSupabaseConfigured } = await import(
    "../utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error("[Contact] Supabase environment variables are missing.");
  }

  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("*")
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
    .select("*")
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

  const pageContent: PageContent = {
    id: pageData.id,
    route: pageData.route,
    title: pageData.title,
    meta_description: pageData.meta_description,
    sections: sectionsData,
  };

  const heroSection =
    pageContent.sections.find((s) => s.section_key === "hero") || null;
  const formSection =
    pageContent.sections.find((s) => s.section_key === "form") || null;
  const faqSection =
    pageContent.sections.find((s) => s.section_key === "faq") || null;

  if (!heroSection) throw new Error("[Contact] Missing hero section.");
  if (!formSection) throw new Error("[Contact] Missing form section.");
  if (!faqSection) throw new Error("[Contact] Missing faq section.");

  const { data: faqItems, error: faqError } = await supabase
    .from("content_items")
    .select("*")
    .eq("page_id", pageData.id)
    .eq("content_type", "faq")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (faqError) throw new Error(faqError.message);

  const faqs: ContactFAQ[] = (faqItems || [])
    .map((item: any) => ({
      question: item.title || "",
      answer: item.description || "",
    }))
    .filter((f: ContactFAQ) => f.question && f.answer);

  if (!faqs.length) throw new Error("[Contact] Missing FAQ items.");

  return {
    props: { pageData: pageContent, heroSection, formSection, faqSection, faqs },
  };
};

export default ContactPage;

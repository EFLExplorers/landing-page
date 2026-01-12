import type { NextPage } from "next";
import Head from "next/head";
import { GetStaticProps } from "next";
import { PageLayout } from "../components/layout/PageLayout";
import { ContactHeroSection, ContactHeroSectionProps } from "../components/layout/Contact/ContactHeroSection";
import { ContactFormSection } from "../components/layout/Contact/ContactFormSection";
import { ContactFAQSection, ContactFAQSectionProps } from "../components/layout/Contact/ContactFAQSection";
import { ContactSection } from "../components/layout/Contact/ContactSection";
import { ContentErrorBoundary } from "../components/common/ErrorBoundary";
import { PageContent } from "./api/page-content";
import { FAQ } from "../components/layout/Contact/ContactFAQSection";

interface ContactPageProps {
  pageData: PageContent;
  faqs: FAQ[];
}

export const ContactPage: NextPage<ContactPageProps> = ({
  pageData,
  faqs
}) => {
  // Find specific sections
  const heroSection = pageData.sections?.find(s => s.section_key === 'hero') || null;

  return (
    <>
      <Head>
        <title>{pageData.title || "Contact Us - ESL Explorers"}</title>
        <meta
          name="description"
          content={pageData.meta_description || "Get in touch with ESL Explorers. We're here to help with your English learning journey through innovative education methods and dedicated support."}
        />
        <meta
          name="keywords"
          content="ESL contact, English learning support, language education help, contact us"
        />
        <meta property="og:title" content={pageData.title || "Contact Us - ESL Explorers"} />
        <meta
          property="og:description"
          content={pageData.meta_description || "Get in touch with ESL Explorers. We're here to help with your English learning journey through innovative education methods and dedicated support."}
        />
        <meta property="og:type" content="website" />
      </Head>
      <PageLayout>
        <ContentErrorBoundary contentType="contact hero">
          <ContactHeroSection section={heroSection} />
        </ContentErrorBoundary>

        <ContactFormSection />

        <ContentErrorBoundary contentType="contact FAQs">
          <ContactFAQSection faqs={faqs} />
        </ContentErrorBoundary>

        <ContactSection />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  try {
    // During build time, use direct API calls instead of fetch
    const { supabase } = await import("../utils/supabaseClient");

    // Fetch page content
    const { data: pageData } = await supabase
      .from("pages")
      .select("*")
      .eq("route", "/contact")
      .single();

    const { data: sectionsData } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_id", pageData?.id || '')
      .eq("active", true)
      .order("sort_order", { ascending: true });

    const pageContent: PageContent = pageData ? {
      id: pageData.id,
      route: pageData.route,
      title: pageData.title,
      meta_description: pageData.meta_description,
      sections: sectionsData || [],
    } : { id: '', route: '/contact', sections: [] };

    // Fetch FAQs from the unified content_items table
    const { data: faqsData } = await supabase
      .from("content_items")
      .select("*")
      .eq("content_type", "faq")
      .eq("active", true)
      .eq("content.category", "contact")
      .order("sort_order", { ascending: true });

    const faqs: FAQ[] = faqsData || [];

    return {
      props: {
        pageData,
        faqs,
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    return {
      props: {
        pageData: { id: '', route: '/contact', sections: [] },
        faqs: [],
      },
      revalidate: 300,
    };
  }
};

export default ContactPage;

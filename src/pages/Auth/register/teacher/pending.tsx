import Link from "next/link";
import styles from "@/styles/Auth.module.css";
import type { GetStaticProps } from "next";
import type { HeaderContent } from "@/components/layout/Header-Footer/Header";
import type { FooterContent } from "@/components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "@/utils/globalSections";

interface TeacherPendingPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  title: string;
  messages: string[];
  buttonLabel: string;
  buttonHref: string;
}

export const TeacherPendingPage = ({
  title,
  messages,
  buttonLabel,
  buttonHref,
}: TeacherPendingPageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.messageBox}>
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <Link href={buttonHref} className={styles.button}>
            {buttonLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherPendingPage;

export const getStaticProps: GetStaticProps<TeacherPendingPageProps> = async () => {
  const { supabase, isSupabaseConfigured } = await import(
    "@/utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error(
      "[TeacherPending] Supabase environment variables are missing."
    );
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id")
    .eq("route", "/Auth/register/teacher/pending")
    .single();

  if (pageError || !pageData?.id) {
    throw new Error(
      `[TeacherPending] Missing pages row for route '/Auth/register/teacher/pending': ${
        pageError?.message || "no id"
      }`
    );
  }

  const { data: sectionData, error: sectionError } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_id", pageData.id)
    .eq("section_key", "content")
    .eq("active", true)
    .single();

  if (sectionError || !sectionData) {
    throw new Error(
      `[TeacherPending] Missing page_sections for '/Auth/register/teacher/pending' (content): ${
        sectionError?.message || "no data"
      }`
    );
  }

  const content = sectionData.content as any;
  if (
    !content.title ||
    !content.messages ||
    !Array.isArray(content.messages) ||
    content.messages.length === 0 ||
    !content.button_label ||
    !content.button_href
  ) {
    throw new Error(
      "[TeacherPending] Missing required content fields in content section"
    );
  }

  return {
    props: {
      headerContent,
      footerContent,
      title: content.title,
      messages: content.messages,
      buttonLabel: content.button_label,
      buttonHref: content.button_href,
    },
    revalidate: 300,
  };
};

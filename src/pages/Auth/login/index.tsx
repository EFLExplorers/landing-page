import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Auth.module.css";
import type { GetStaticProps } from "next";
import type { HeaderContent } from "@/components/layout/Header-Footer/Header";
import type { FooterContent } from "@/components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "@/utils/globalSections";

interface LoginPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
  title: string;
  subtitle: string;
  studentButtonLabel: string;
  teacherButtonLabel: string;
  registerPrompt: string;
  registerLinkText: string;
  registerHref: string;
}

export const LoginPage = ({
  title,
  subtitle,
  studentButtonLabel,
  teacherButtonLabel,
  registerPrompt,
  registerLinkText,
  registerHref,
}: LoginPageProps) => {
  const router = useRouter();

  const handlePlatformSelect = (platform: "student" | "teacher") => {
    router.push(`/Auth/login/${platform}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.buttonGroup}>
          <button
            onClick={() => handlePlatformSelect("student")}
            className={`${styles.button} ${styles.studentButton}`}
          >
            {studentButtonLabel}
          </button>
          <button
            onClick={() => handlePlatformSelect("teacher")}
            className={`${styles.button} ${styles.teacherButton}`}
          >
            {teacherButtonLabel}
          </button>
        </div>

        <p className={styles.registerLink}>
          {registerPrompt}{" "}
          <Link href={registerHref} className={styles.link}>
            {registerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

export const getStaticProps: GetStaticProps<LoginPageProps> = async () => {
  const { supabase, isSupabaseConfigured } = await import(
    "@/utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    throw new Error("[Login] Supabase environment variables are missing.");
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );

  const { data: pageData, error: pageError } = await supabase
    .from("pages")
    .select("id")
    .eq("route", "/Auth/login")
    .single();

  if (pageError || !pageData?.id) {
    throw new Error(
      `[Login] Missing pages row for route '/Auth/login': ${
        pageError?.message || "no id"
      }`
    );
  }

  const { data: sectionData, error: sectionError } = await supabase
    .from("page_sections")
    .select("content")
    .eq("page_id", pageData.id)
    .eq("section_key", "selection")
    .eq("active", true)
    .single();

  if (sectionError || !sectionData) {
    throw new Error(
      `[Login] Missing page_sections for '/Auth/login' (selection): ${
        sectionError?.message || "no data"
      }`
    );
  }

  const content = sectionData.content as any;
  if (
    !content.title ||
    !content.subtitle ||
    !content.student_button_label ||
    !content.teacher_button_label ||
    !content.register_prompt ||
    !content.register_link_text ||
    !content.register_href
  ) {
    throw new Error(
      "[Login] Missing required content fields in selection section"
    );
  }

  return {
    props: {
      headerContent,
      footerContent,
      title: content.title,
      subtitle: content.subtitle,
      studentButtonLabel: content.student_button_label,
      teacherButtonLabel: content.teacher_button_label,
      registerPrompt: content.register_prompt,
      registerLinkText: content.register_link_text,
      registerHref: content.register_href,
    },
    revalidate: 300,
  };
};

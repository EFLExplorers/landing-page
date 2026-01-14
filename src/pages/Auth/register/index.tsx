import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Auth.module.css";
import type { GetStaticProps } from "next";
import type { HeaderContent } from "@/components/layout/Header-Footer/Header";
import type { FooterContent } from "@/components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "@/utils/globalSections";

interface RegisterPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
}

export const RegisterPage = (_props: RegisterPageProps) => {
  const router = useRouter();

  const handlePlatformSelect = (platform: "student" | "teacher") => {
    router.push(`/Auth/register/${platform}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Join ESL Explorers</h1>
        <p className={styles.subtitle}>Choose your account type:</p>

        <div className={styles.buttonGroup}>
          <button
            onClick={() => handlePlatformSelect("student")}
            className={`${styles.button} ${styles.studentButton}`}
          >
            📚 Register as Student
          </button>
          <button
            onClick={() => handlePlatformSelect("teacher")}
            className={`${styles.button} ${styles.teacherButton}`}
          >
            👨‍🏫 Register as Teacher
          </button>
        </div>

        <div className={styles.registerLink}>
          Already have an account?{" "}
          <Link href="/Auth/login" className={styles.link}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 

export const getStaticProps: GetStaticProps<RegisterPageProps> = async () => {
  const { supabase, isSupabaseConfigured } = await import(
    "@/utils/supabaseClient"
  );

  if (!isSupabaseConfigured) {
    return { props: { headerContent: null, footerContent: null }, revalidate: 300 };
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(supabase);
  return { props: { headerContent, footerContent }, revalidate: 300 };
};
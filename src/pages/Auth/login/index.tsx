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
}

export const LoginPage = (_props: LoginPageProps) => {
  const router = useRouter();

  const handlePlatformSelect = (platform: "student" | "teacher") => {
    router.push(`/Auth/login/${platform}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Select your platform to continue:</p>

        <div className={styles.buttonGroup}>
          <button
            onClick={() => handlePlatformSelect("student")}
            className={`${styles.button} ${styles.studentButton}`}
          >
            📚 Student Login
          </button>
          <button
            onClick={() => handlePlatformSelect("teacher")}
            className={`${styles.button} ${styles.teacherButton}`}
          >
            👨‍🏫 Teacher Login
          </button>
        </div>

        <p className={styles.registerLink}>
          New to ESL Explorers?{" "}
          <Link href="/Auth/register" className={styles.link}>
            Register here
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
    return {
      props: { headerContent: null, footerContent: null },
      revalidate: 300,
    };
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(
    supabase
  );
  return { props: { headerContent, footerContent }, revalidate: 300 };
};

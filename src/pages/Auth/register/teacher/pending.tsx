import Link from "next/link";
import styles from "@/styles/Auth.module.css";
import type { GetStaticProps } from "next";
import type { HeaderContent } from "@/components/layout/Header-Footer/Header";
import type { FooterContent } from "@/components/layout/Header-Footer/Footer";
import { getGlobalLayoutContent } from "@/utils/globalSections";

interface TeacherPendingPageProps {
  headerContent: HeaderContent | null;
  footerContent: FooterContent | null;
}

export const TeacherPendingPage = (_props: TeacherPendingPageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Registration Pending</h1>
        <div className={styles.messageBox}>
          <p>
            Thank you for registering as a teacher with ESL Explorers. Your
            application is currently under review.
          </p>
          <p>
            Our admin team will verify your credentials and approve your
            account. You will receive an email notification once your account
            has been approved.
          </p>
          <p>Please note that this process may take 1-2 business days.</p>
        </div>
        <div className={styles.buttonGroup}>
          <Link href="/Auth/login" className={styles.button}>
            Return to Login
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
    return { props: { headerContent: null, footerContent: null }, revalidate: 300 };
  }

  const { headerContent, footerContent } = await getGlobalLayoutContent(supabase);
  return { props: { headerContent, footerContent }, revalidate: 300 };
};

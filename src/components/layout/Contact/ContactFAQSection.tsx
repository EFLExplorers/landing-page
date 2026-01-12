import { useState } from "react";
import styles from "./ContactFAQSection.module.css";

export type FAQ = {
  id: string;
  content_type: string;
  title: string;
  description: string;
  content: {
    category: string;
  };
  sort_order: number;
  active: boolean;
};

export interface ContactFAQSectionProps {
  faqs: FAQ[];
}

export const ContactFAQSection = ({ faqs }: ContactFAQSectionProps) => {
  // Database-driven content only
  if (!faqs || faqs.length === 0) return null;

  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const toggleQuestion = (faqId: string) => {
    setActiveQuestion(activeQuestion === faqId ? null : faqId);
  };

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Find answers to common questions about our English learning programs and services
          </p>
        </div>

        <div className={styles.faqGrid}>
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`${styles.faqItem} ${
                activeQuestion === faq.id ? styles.active : ""
              }`}
              onClick={() => toggleQuestion(faq.id)}
            >
              <div className={styles.faqQuestion}>
                <span className={styles.questionText}>{faq.title}</span>
                <span className={styles.faqArrow}>
                  {activeQuestion === faq.id ? "−" : "+"}
                </span>
              </div>
              {activeQuestion === faq.id && (
                <div className={styles.faqAnswer}>
                  <p>{faq.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 
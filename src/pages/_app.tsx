import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Layout } from "../components/layout/Layout";
import type { HeaderContent } from "../components/layout/Header-Footer/Header";
import type { FooterContent } from "../components/layout/Header-Footer/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

type AppPageProps = {
  headerContent?: HeaderContent | null;
  footerContent?: FooterContent | null;
  [key: string]: any;
};

function App({ Component, pageProps }: AppProps<AppPageProps>) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="ESL Explorers - Learning Platform" />
        <title>ESL Explorers</title>
      </Head>
      <Layout
        headerContent={pageProps.headerContent ?? null}
        footerContent={pageProps.footerContent ?? null}
      >
        <Component {...pageProps} />
        <SpeedInsights />
        <Analytics />
      </Layout>
    </>
  );
}

export default App;

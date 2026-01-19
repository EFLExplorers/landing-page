import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseHost = supabaseUrl ? new URL(supabaseUrl).origin : null;

  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Supabase for faster API calls */}
        {supabaseHost && (
          <>
            <link rel="preconnect" href={supabaseHost} />
            <link rel="dns-prefetch" href={supabaseHost} />
          </>
        )}
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/assets/images/logo/Logo.png"
          as="image"
          type="image/png"
        />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/_next/static/css/app.css" as="style" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

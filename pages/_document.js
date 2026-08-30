import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body>
        {/* Enables scroll-reveal initial states before hydration.
            Without JS (or before this runs) all reveal content stays visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js");`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

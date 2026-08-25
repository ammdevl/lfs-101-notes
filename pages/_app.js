import LenisProvider from "@layouts/components/LenisProvider";
import { ProgressProvider } from "@components/ProgressContext";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "styles/style.scss";
import "lenis/dist/lenis.css";

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
      // Announce the new page to screen readers after navigation
      const announcer = document.getElementById("sr-announcer");
      if (announcer) announcer.textContent = document.title;
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <ProgressProvider>
        <LenisProvider>
          <Component {...pageProps} />
        </LenisProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default App;

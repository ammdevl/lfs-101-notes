import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

const LenisProvider = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  if (reducedMotion) return children;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        autoResize: true,
        // Anchor clicks are handled by Base's delegated handler because the
        // page scrolls inside #content (a nested container), which Lenis
        // root mode cannot scroll itself.
        anchors: false,
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;

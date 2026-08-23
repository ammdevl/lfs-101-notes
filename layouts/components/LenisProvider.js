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
        anchors: true,
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;

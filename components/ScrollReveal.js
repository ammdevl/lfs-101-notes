import { useEffect, useRef } from "react";

/**
 * Wraps children in a scroll-reveal container. Starts hidden only when JS
 * is available (html.js, added by an inline script in _document), animates
 * in via IntersectionObserver. No-JS renders and reduced motion stay visible.
 */
const ScrollReveal = ({
  children,
  delay = 0,
  scale = false,
  className = "",
  as: Tag = "div",
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${scale ? "reveal--scale" : ""} ${className}`.trim()}
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;

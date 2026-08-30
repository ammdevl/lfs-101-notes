// Shared scroll helpers. Lenis root drives window scrolling, so programmatic
// jumps must go through lenis.scrollTo() — a raw window.scrollTo() gets
// overridden by Lenis's animation loop. Falls back to window.scrollTo when
// Lenis is unavailable (prefers-reduced-motion disables the provider).

function marginFor(target) {
  try {
    return parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  } catch {
    return 0;
  }
}

export function scrollToTarget(lenis, target, reduceMotion = false) {
  if (!target) return;
  const offset = -marginFor(target);
  if (lenis?.scrollTo) {
    lenis.scrollTo(target, {
      offset,
      immediate: !!reduceMotion,
      // Late-loading images shift layout while the animation runs; snap once
      // to the target's settled position — but never chase shifts larger than
      // a viewport (layout still churning).
      onComplete: () => {
        if (reduceMotion) return;
        setTimeout(() => {
          const remaining = target.getBoundingClientRect().top - marginFor(target);
          if (Math.abs(remaining) > 40 && Math.abs(remaining) < window.innerHeight) {
            lenis.scrollTo(target, { offset, immediate: true });
          }
        }, 80);
      },
    });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
  }
}

export function scrollToTopOfPage(lenis, reduceMotion = false) {
  if (lenis?.scrollTo) {
    lenis.scrollTo(0, { immediate: !!reduceMotion });
  } else {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }
}

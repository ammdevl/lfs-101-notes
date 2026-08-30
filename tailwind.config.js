const theme = require("./config/theme.json");

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;

function family(name) {
  return theme.fonts.font_family[name]
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
}

let fontDisplay = family("display");
let fontDisplayType = theme.fonts.font_family.display_type;
let fontPrimary = family("primary");
let fontPrimaryType = theme.fonts.font_family.primary_type;
let fontSecondary = family("secondary");
let fontSecondaryType = theme.fonts.font_family.secondary_type;
let fontMono = family("mono");
let fontMonoType = theme.fonts.font_family.mono_type;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "540px",
      md: "768px",
      lg: "992px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        text: theme.colors.default.text_color.default,
        "text-heading": theme.colors.default.text_color.heading,
        "text-secondary": theme.colors.default.text_color.secondary,
        "text-muted": theme.colors.default.text_color.muted,
        "text-link": theme.colors.default.text_color.link,
        "text-code": theme.colors.default.text_color.code,
        primary: {
          DEFAULT: theme.colors.default.theme_color.primary,
          dark: "#4338ca",
          light: "#818cf8",
        },
        accent: {
          DEFAULT: theme.colors.default.theme_color.accent,
          dark: "#6d28d9",
          light: "#a78bfa",
        },
        success: {
          DEFAULT: theme.colors.default.theme_color.success,
          dark: "#047857",
          light: "#34d399",
        },
        body: theme.colors.default.theme_color.body,
        border: theme.colors.default.theme_color.border,
        sidebar: theme.colors.default.theme_color.sidebar,
        "code-inline": theme.colors.default.theme_color.code_inline,
        callout: theme.colors.default.theme_color.callout,
        darkmode: {
          text: theme.colors.darkmode.text_color.default,
          "text-heading": theme.colors.darkmode.text_color.heading,
          "text-secondary": theme.colors.darkmode.text_color.secondary,
          "text-muted": theme.colors.darkmode.text_color.muted,
          "text-link": theme.colors.darkmode.text_color.link,
          "text-code": theme.colors.darkmode.text_color.code,
          primary: {
            DEFAULT: theme.colors.darkmode.theme_color.primary,
            dark: "#6366f1",
            light: "#a5b4fc",
          },
          accent: {
            DEFAULT: theme.colors.darkmode.theme_color.accent,
            dark: "#7c3aed",
            light: "#c4b5fd",
          },
          success: {
            DEFAULT: theme.colors.darkmode.theme_color.success,
            dark: "#10b981",
            light: "#6ee7b7",
          },
          body: theme.colors.darkmode.theme_color.body,
          border: theme.colors.darkmode.theme_color.border,
          sidebar: theme.colors.darkmode.theme_color.sidebar,
          "code-inline": theme.colors.darkmode.theme_color.code_inline,
          callout: theme.colors.darkmode.theme_color.callout,
        },
      },
      fontSize: {
        base: font_base + "px",
        h1: h1 + "rem",
        "h1-sm": h1 * 0.8 + "rem",
        h2: h2 + "rem",
        "h2-sm": h2 * 0.8 + "rem",
        h3: h3 + "rem",
        "h3-sm": h3 * 0.8 + "rem",
        h4: h4 + "rem",
        h5: h5 + "rem",
        h6: h6 + "rem",
      },
      fontFamily: {
        display: [fontDisplay, fontDisplayType],
        primary: [fontPrimary, fontPrimaryType],
        secondary: [fontSecondary, fontSecondaryType],
        mono: [fontMono, fontMonoType],
      },
      spacing: {
        sidebar: "280px",
        topbar: "56px",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.10)",
        lift: "0 2px 4px rgba(15, 23, 42, 0.05), 0 16px 40px -12px rgba(79, 70, 229, 0.22)",
        glow: "0 0 0 1px rgba(79, 70, 229, 0.18), 0 12px 40px -8px rgba(79, 70, 229, 0.35)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        "gradient-primary-soft": "linear-gradient(135deg, rgba(79,70,229,0.10) 0%, rgba(124,58,237,0.10) 100%)",
        "gradient-text": "linear-gradient(120deg, #4f46e5 0%, #7c3aed 55%, #a855f7 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.4)" },
          "60%": { opacity: "1", transform: "scale(1.18)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.3s ease-out both",
        shimmer: "shimmer 1.8s linear infinite",
        blink: "blink 1.1s step-end infinite",
        "gradient-pan": "gradient-pan 6s ease infinite",
        pop: "pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

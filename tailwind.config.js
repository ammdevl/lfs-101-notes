const theme = require("./config/theme.json");

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;

let fontPrimary = theme.fonts.font_family.primary
  .replace(/\+/g, " ")
  .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
let fontPrimaryType = theme.fonts.font_family.primary_type;
let fontSecondary = theme.fonts.font_family.secondary
  .replace(/\+/g, " ")
  .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
let fontSecondaryType = theme.fonts.font_family.secondary_type;
let fontMono = theme.fonts.font_family.mono
  .replace(/\+/g, " ")
  .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
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
          dark: "#1e40af",
          light: "#3b82f6",
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
            dark: "#2563eb",
            light: "#60a5fa",
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
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

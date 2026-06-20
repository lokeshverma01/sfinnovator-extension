/**
 * Tailwind CSS v3 configuration.
 *
 * Design philosophy: our single source of color truth is the set of CSS
 * variables defined in src/styles/global.css (so light/dark theming is just a
 * variable swap). Here we map those variables into Tailwind's theme so you can
 * write semantic classes like `bg-bg`, `text-muted`, `border-border`,
 * `text-accent` — and they automatically respond to the active theme.
 *
 * Rule (see CONTRIBUTING.md): never hard-code hex colors in components — use
 * these token-backed classes.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Toggle dark mode via a `data-theme="dark"` attribute on <html>
  // (set by our no-flash theme script), not the default `.dark` class.
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-subtle': 'var(--bg-subtle)',
        text: 'var(--text)',
        muted: 'var(--text-muted)',
        border: 'var(--border)',
        card: 'var(--card)',
        accent: 'var(--accent)',
        'accent-contrast': 'var(--accent-contrast)',
        'tag-bg': 'var(--tag-bg)',
        'tag-text': 'var(--tag-text)',
      },
      maxWidth: {
        content: 'var(--max-content)', // 1080px — landing / card grid
        reading: 'var(--max-reading)', // 720px  — article reading column
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
      },
    },
  },
  plugins: [],
};

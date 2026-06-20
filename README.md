# SF Innovator

A Salesforce learning blog at **[sfinnovator.com](https://sfinnovator.com)** — end-to-end implementations, real use-case scenarios, error debugging write-ups, and a portfolio of solutions you can validate.

Built to be **fast, SEO-first, secure, and cheap to run** (static site, no database).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) (static output, zero JS by default) |
| Content | Markdown / MDX in Git (no database) |
| Styling | Tailwind CSS v3 + CSS-variable design tokens |
| Theming | Light/dark via `data-theme`, no-flash, persisted |
| Hosting | TBD — Cloudflare Pages (planned) / currently evaluating |
| Package manager | pnpm |

See [docs/adr/](docs/adr/) for the full reasoning behind each choice.

## Local development

```bash
pnpm install            # install dependencies
pnpm approve-builds esbuild sharp   # approve required build scripts (one-time)
pnpm dev                # start dev server (http://localhost:4321)
pnpm build              # production build → dist/
pnpm preview            # preview the production build
```

Requires Node 20+ (see `.nvmrc`) and pnpm.

## Project structure

```
src/
├── components/   reusable UI (Header, Footer, ThemeToggle, PostCard, BaseHead)
├── layouts/      page shells (BaseLayout)
├── pages/        file-based routes (index.astro = landing page)
├── content/      blog + portfolio content + schema (config.ts)
├── lib/          logic: siteConfig, seo, utils ("backend skeleton")
└── styles/       global.css (design tokens)
public/           static assets (robots.txt, favicon)
docs/             architecture, build log, components, security, troubleshooting
design/           approved HTML design mockup
```

## Documentation

This project is documented as it is built. Start at **[docs/README.md](docs/README.md)**:

- [Architecture Decision Records](docs/adr/) — why the stack is what it is
- [Implementation Log](docs/implementation-log/) — step-by-step build journal (reproducible)
- [Component Catalog](docs/components/) — every reusable component
- [Security Practices](docs/security/security-practices.md) — standards + pre-merge checklist
- [Troubleshooting Runbook](docs/troubleshooting/) — symptom → file → fix
- [CONTRIBUTING.md](CONTRIBUTING.md) — coding standards (read before contributing)

## License

© Lokesh Verma. All rights reserved.

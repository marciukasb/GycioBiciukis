# Gyčio Bičiukis

Website for a beekeeping hobby/business. Next.js 14 (App Router) static export, SCSS modules, Vitest.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # vitest
npm run build   # static site in ./out
```

## Content

Blog posts are Markdown files with frontmatter in `app/_data/_blog/`, read at build time by `app/utils/blog.ts`.
They are managed through [Marksman](https://github.com/marciukasb/marksman) via `.cms.json`.
Images live in `public/images` and are referenced as `/images/...`.

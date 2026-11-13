# Gyčio Bičiūkis Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing bare-bones scaffold into the finished Lithuanian "workshop journal" site for gyciobiciukis.lt: logo-first home page that never looks empty, posts with topics, About story, RSS feed and newsletter sign-up.

**Architecture:** Fully static Next.js 14 export. All content is Markdown/front matter read at build time by small pure-ish modules in `app/utils/`; pages are server components that call those modules and render presentational components from `app/_components/`. Site-wide constants live in `app/_data/site.ts` so the logo, hero photo and copy can be swapped in one place.

**Tech Stack:** Next.js 14.2 (App Router, `output: "export"`), TypeScript, SCSS modules, `gray-matter`, `marked` 15, Vitest (node environment), `next/font/google`.

**Spec:** `docs/superpowers/specs/2026-11-13-gycio-biciukis-site-design.md`

## Global Constraints

- All UI copy is Lithuanian; `<html lang="lt">` (already set).
- Dates display in `lt-LT` long format, computed in UTC: `"2026-05-10"` → `"2026 m. gegužės 10 d."`.
- Fonts must include the `latin-ext` subset (ą č ę ė į š ų ū ž).
- Palette: warm paper/cream backgrounds, honey/amber accents, dark warm brown text; never `#fff` or `#000` as page background/text.
- No contact details, contact page, shop, prices, comments, search or dark mode anywhere.
- Static export only: no server code, no runtime API routes (build-time `force-static` route handlers are fine).
- Mobile first; every page must work at 360px wide with no horizontal scroll.
- Topics (exact): `Statyba`, `Žinios`, `Bitynas`, `Spiečiai`.
- Stats labels (exact): `aviliai`, `sodai`, `bičių šeimos`; stats front-matter keys: `aviliai`, `sodai`, `seimos`.
- Posts live at `/irasai`, post pages at `/irasai/[slug]`, topic pages at `/irasai/tema/[topic]`, About at `/apie`, feed at `/rss.xml`.
- Site URL: `https://gyciobiciukis.lt`. Owner name (assumed, unconfirmed): `Gytis`.
- Keep existing tests passing; `npm test -- --run`, `npm run lint`, `npm run build` must all succeed at the end of every task.

## Review Focus

1. **Post without a thumbnail** — cards, featured card and post page render complete with no broken `<img>`; `next/image` must never receive `src=""`.
2. **Post with an empty or unknown topic** (e.g. typo `Statybos`) — shows no tag chip, is excluded from every topic page, still appears in `/irasai` and on Home.
3. **Post with missing or invalid `date`** — doesn't crash the build, sorts after dated posts, displays no date, RSS omits `<pubDate>` for it.
4. **Titles/summaries with `&`, `<`, quotes or Lithuanian letters** — RSS stays valid XML (escaped), pages render the characters correctly.
5. **`stats.md` or `about.md` missing, or a stat that isn't a number** — build succeeds; the stats strip hides tiles with no number (and hides entirely if all are missing); About shows the placeholder notice.

---

## File Structure

```
app/_data/site.ts                 site-wide constants (name, URL, owner, tagline, intro, logo, hero)
app/_data/topics.ts               TOPICS list + lookups
app/_data/meta.ts                 (modify) page metadata, imports SITE_NAME from site.ts
app/_data/stats.md                stats front matter (placeholders)
app/_data/about.md                About story (placeholder text)
app/_data/newsletter.ts           newsletter service config (Task 8)
app/utils/index.ts                (modify) formatDate → lt-LT, UTC
app/utils/blog.ts                 (modify) isoDate, safe dates, image links
app/utils/posts.ts                pure selectors: homePostLayout, adjacentPosts, postsByTopic
app/utils/content.ts              readStats, readAbout
app/utils/rss.ts                  buildRss
app/types/BlogPost.ts             (modify) add isoDate
app/layout.tsx                    (modify) fonts, Footer
app/globals.scss                  (modify) base theme
styles/_colors.scss               (modify) palette tokens
app/_components/Navigation/*      (modify) Lithuanian links
app/_components/Footer/*          footer shell + newsletter slot
app/_components/Logo/*            round logo image
app/_components/Home/*            Hero, LatestPosts, StatsStrip, StoryTeaser
app/_components/Posts/*           PostCard, FeaturedPost, TopicTag, TopicFilter, PostNav, EmptyPosts
app/_components/BlogPost/*        (modify) post page article
app/_components/Newsletter/*      sign-up form (Task 8)
app/page.tsx                      (modify) Home
app/irasai/page.tsx               posts list            (replaces app/blog/page.tsx)
app/irasai/[slug]/page.tsx        post page             (replaces app/blog/[slug]/page.tsx)
app/irasai/tema/[topic]/page.tsx  topic page
app/apie/page.tsx                 About                 (replaces app/about/page.tsx)
app/rss.xml/route.ts              RSS feed
app/not-found.tsx                 (modify) 404
public/images/logo.svg            placeholder round logo
```

Delete: `app/contacts/`, `app/blog/`, `app/about/`, `app/_components/BlogList/` (replaced by `Posts/`).

---

### Task 1: Content layer for posts

**Files:**
- Create: `app/_data/site.ts`, `app/_data/topics.ts`, `app/utils/posts.ts`, `app/utils/posts.test.ts`, `app/_data/topics.test.ts`
- Modify: `app/utils/index.ts`, `app/utils/index.test.ts`, `app/utils/blog.ts`, `app/utils/blog.test.ts`, `app/types/BlogPost.ts`, `app/_data/meta.ts`

**Interfaces:**
- Produces:
  - `site.ts`: `SITE_NAME = "Gyčio Bičiūkis"`, `SITE_URL = "https://gyciobiciukis.lt"`, `OWNER_NAME = "Gytis"`, `TAGLINE = "Bitės, aviliai ir medus iš mūsų sodo"`, `INTRO = "Gytis žiemą stato avilius, o vasarą jais rūpinasi bitės. Čia jis dalinasi tuo, ką pastatė ir ko išmoko."`, `LOGO_SRC = "/images/logo.svg"`, `HERO_IMAGE = ""` (empty → CSS placeholder).
  - `topics.ts`: `type Topic = { name: string; slug: string }`; `TOPICS: Topic[]` = Statyba/`statyba`, Žinios/`zinios`, Bitynas/`bitynas`, Spiečiai/`spieciai`; `topicByName(name: string): Topic | undefined`; `topicBySlug(slug: string): Topic | undefined`.
  - `BlogPost` gains `isoDate: string` (`"YYYY-MM-DD"` or `""`); `date` stays the formatted display string (or `""`).
  - `posts.ts`: `homePostLayout(posts: BlogPost[]): { featured: BlogPost | null; rest: BlogPost[] }` (rest = next up to 3); `adjacentPosts(posts: BlogPost[], slug: string): { newer: BlogPost | null; older: BlogPost | null }` (posts are newest-first); `postsByTopic(posts: BlogPost[], topicSlug: string): BlogPost[]`.
  - `readAllPosts()` / `readPostBySlug()` keep their signatures.

- [ ] **Step 1: Update `index.test.ts` for Lithuanian dates and write failing tests**

```ts
expect(formatDate('2026-05-10')).toBe('2026 m. gegužės 10 d.');
expect(formatDate('2026-01-01')).toBe('2026 m. sausio 1 d.'); // no UTC shift
expect(formatDate('not-a-date')).toBe('');
```

- [ ] **Step 2: Write failing tests in `blog.test.ts`** (keep existing ones; update the date assertion to `'2026 m. sausio 15 d.'`)

```ts
it('exposes isoDate', ...)                 // posts[0].isoDate === '2026-01-15'
it('sorts undated posts last without crashing', ...)  // post without date: date === '', isoDate === '', last in list
it('wraps body images in a link to the full image', ...)
  // body '![Avilys](/images/a.jpg)' → description contains
  // '<a href="/images/a.jpg" class="post-image-link"' and '<img src="/images/a.jpg" alt="Avilys" loading="lazy"'
```

- [ ] **Step 3: Write failing tests in `topics.test.ts` and `posts.test.ts`**

```ts
expect(topicByName('Žinios')?.slug).toBe('zinios');
expect(topicByName('Statybos')).toBeUndefined();
expect(topicBySlug('spieciai')?.name).toBe('Spiečiai');

// homePostLayout
expect(homePostLayout([])).toEqual({ featured: null, rest: [] });
expect(homePostLayout([a])).toEqual({ featured: a, rest: [] });
expect(homePostLayout([a, b, c, d, e]).rest).toEqual([b, c, d]);
// adjacentPosts (list newest-first: [a, b, c])
expect(adjacentPosts([a, b, c], 'b')).toEqual({ newer: a, older: c });
expect(adjacentPosts([a, b, c], 'a').newer).toBeNull();
expect(adjacentPosts([a], 'missing')).toEqual({ newer: null, older: null });
// postsByTopic: matches by topicByName(post.topic)?.slug; unknown/empty topics excluded
```

- [ ] **Step 4: Run tests, verify they fail**

Run: `npx vitest --run`
Expected: new tests FAIL (missing modules / old en-US output).

- [ ] **Step 5: Implement**
  - `formatDate`: `lt-LT`, `{ year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }`; return `''` for empty or invalid dates.
  - `blog.ts`: add `isoDate` (from existing `coerceDate`, `''` if not a valid date); sort with undated posts last; render body with a `marked` instance (`new Marked({ renderer: { image(...) } })`) that outputs `<a href="SRC" class="post-image-link" target="_blank" rel="noopener"><img src="SRC" alt="ALT" loading="lazy"></a>`. Share one parse function between `readAllPosts` and `readPostBySlug` instead of duplicating the mapping.
  - Create `site.ts`, `topics.ts`, `posts.ts` with the interfaces above; `meta.ts` imports `SITE_NAME` from `site.ts` (drop its own export and the `Contacts` entry, add `Apie` titles in Lithuanian: Home `SITE_NAME`, `Įrašai`, `Apie`, 404 `Puslapis nerastas`).

- [ ] **Step 6: Run tests, verify they pass**

Run: `npx vitest --run`
Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add app && git commit -m "feat: Lithuanian dates, topics and post selectors"
```

---

### Task 2: Stats and About content

**Files:**
- Create: `app/utils/content.ts`, `app/utils/content.test.ts`, `app/_data/stats.md`, `app/_data/about.md`

**Interfaces:**
- Produces:
  - `type Stats = { aviliai: number | null; sodai: number | null; seimos: number | null }`
  - `readStats(): Promise<Stats>` — reads `app/_data/stats.md`; missing file → all `null`; any value that isn't a finite number (after `Number(...)`) → `null`.
  - `type About = { html: string; photo: string }`
  - `readAbout(): Promise<About>` — reads `app/_data/about.md` (front matter `photo` optional); missing file → `{ html: '', photo: '' }`.

- [ ] **Step 1: Write failing tests** (mock `fs/promises` the same way `blog.test.ts` does)

```ts
// stats.md '---\naviliai: 24\nsodai: 3\nseimos: 18\n---\n' → { aviliai: 24, sodai: 3, seimos: 18 }
// seimos: "daug" → seimos === null
// readFile rejects → { aviliai: null, sodai: null, seimos: null }
// about.md '---\nphoto: /images/tetis.jpg\n---\n\nSveiki' → html contains '<p>Sveiki</p>', photo '/images/tetis.jpg'
// readFile rejects → { html: '', photo: '' }
```

- [ ] **Step 2: Run, verify fail** — `npx vitest --run app/utils/content.test.ts` → FAIL (module missing).

- [ ] **Step 3: Implement `content.ts`; create data files**
  - `stats.md`: `aviliai: 24`, `sodai: 3`, `seimos: 18` (placeholders).
  - `about.md`: no front matter photo; body starts with the line `> Šis tekstas laikinas – čia bus istorija apie tai, kaip viskas prasidėjo.` followed by two short placeholder paragraphs that follow the spec's story outline (house built together, bees as a gift, winter hive building with jigs, roof swarm traps).

- [ ] **Step 4: Run, verify pass** — `npx vitest --run` → all PASS.

- [ ] **Step 5: Commit** — `git add app && git commit -m "feat: stats and about content readers"`

---

### Task 3: Theme, layout shell, logo

**Files:**
- Create: `public/images/logo.svg`, `app/_components/Logo/Logo.tsx`, `app/_components/Logo/Logo.module.scss`, `app/_components/Footer/Footer.tsx`, `app/_components/Footer/Footer.module.scss`
- Modify: `styles/_colors.scss`, `app/globals.scss`, `app/layout.tsx`, `app/_components/Navigation/Navigation.tsx`, `app/_components/Navigation/Navigation.module.scss`
- Delete: `app/contacts/`

**Interfaces:**
- Produces: `<Logo size={number} className?={string} />` (renders `<img src={LOGO_SRC} alt={SITE_NAME}>`, round, fixed square size); `<Footer>{children?}</Footer>` where children is the newsletter slot (empty until Task 8); SCSS tokens in `_colors.scss`: `$paper`, `$card`, `$honey`, `$amber`, `$ink`, `$inkSoft`, `$line`; CSS classes `.serif` and `.hand` in `globals.scss` mapping to CSS variables `--font-serif`, `--font-hand`.

- [ ] **Step 1: Placeholder logo** — `public/images/logo.svg`: the round badge from `.superpowers/brainstorm/*/content/logo-hero.html` (cream disc, honey inner circle, simple cartoon beekeeper face, ring text `GYČIO BIČIŪKIS • NAMINIS MEDUS •`) as a standalone SVG with `viewBox="0 0 200 200"` and the font set to a generic sans fallback.

- [ ] **Step 2: Fonts and theme** — in `layout.tsx` load `Fraunces` (headings, `--font-serif`), `Nunito` (body), `Caveat` (`--font-hand`) via `next/font/google` with `subsets: ["latin", "latin-ext"]`; render `<Navigation />`, `{children}`, `<Footer />`. Palette values: paper `#f7f0e3`, card `#fffaf0`, honey `#f2a900`, amber `#c9820a`, ink `#3a2a1a`, inkSoft `#7a5a3a`, line `#e5cfa8`. Headings use the serif.

- [ ] **Step 3: Navigation** — site name (serif, links home) on the left; links `Įrašai` → `/irasai`, `Apie` → `/apie`; stays one row at 360px.

- [ ] **Step 4: Footer** — newsletter slot (children) above a small line `© {current year} Gyčio Bičiūkis`; no contact details.

- [ ] **Step 5: Delete `app/contacts/`**

- [ ] **Step 6: Verify**

Run: `npm run lint && npm run build`
Expected: both succeed; route list has no `/contacts`.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: workshop-journal theme, logo placeholder, footer shell"`

---

### Task 4: Home page

**Files:**
- Create: `app/_components/Home/Hero.tsx`, `LatestPosts.tsx`, `StatsStrip.tsx`, `StoryTeaser.tsx` (+ one `.module.scss` each); `app/_components/Posts/PostCard.tsx`, `FeaturedPost.tsx`, `TopicTag.tsx`, `EmptyPosts.tsx` (+ scss)
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `readAllPosts`, `homePostLayout`, `readStats`, `Stats`, `topicByName`, site constants, `<Logo>`.
- Produces (reused in Task 5): `<PostCard post={BlogPost} />`, `<FeaturedPost post={BlogPost} />`, `<TopicTag topic={string} />` (renders nothing when `topicByName(topic)` is undefined; links to `/irasai/tema/<slug>`), `<EmptyPosts />`.

- [ ] **Step 1: Build the components**
  - `Hero`: rounded photo block (`HERO_IMAGE` as background, or a warm honey/brown gradient when empty), `<Logo>` overlapping the lower-left edge, rotated about −8°, with a drop shadow; `TAGLINE` as serif `<h1>` on the photo, bottom-right, readable over any photo (dark gradient scrim).
  - Intro paragraph: `INTRO`.
  - `LatestPosts`: uses `homePostLayout`; 0 → `<EmptyPosts />` (dashed honey border, `.hand` line `Pirmasis įrašas jau pakeliui…`, sub-line `Netrukus čia atsiras pirmieji užrašai iš bityno.`); 1 → `<FeaturedPost>` under heading `Naujausias įrašas`; 2+ → featured + up to 3 `<PostCard>`s + link `Visi įrašai →` to `/irasai`.
  - `PostCard` / `FeaturedPost`: scrapbook card (card background, soft shadow); image only when `thumbnail` is non-empty (otherwise a text-only card that still looks finished); topic via `<TopicTag>`; date only when non-empty; featured shows `summary`.
  - `StatsStrip`: tiles in order aviliai / sodai / bičių šeimos; skip tiles whose value is `null`; render nothing if all are `null`.
  - `StoryTeaser`: round image (about photo, or a honey placeholder circle), heading `Kaip viskas prasidėjo`, line `Dovana, kuri užpildė kiekvieną laisvą minutę…`, link `Skaityti →` to `/apie`.
  - Page order: Hero, intro, LatestPosts, StatsStrip, StoryTeaser.

- [ ] **Step 2: Verify the three post states with sample content**

Run each, then `npm run build` and open `out/index.html`:
1. No posts in `app/_data/_blog/` → contains `Pirmasis įrašas jau pakeliui`.
2. One sample post (no thumbnail) → contains `Naujausias įrašas`, no `<img` with empty `src`.
3. Five sample posts (one with an unknown topic, one without a date) → featured + 3 cards, build succeeds.

Delete the sample posts afterwards (`app/_data/_blog/` back to only `.gitkeep`).

- [ ] **Step 3: Verify** — `npm test -- --run && npm run lint && npm run build` all succeed.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: home page with hero, latest posts, stats and story teaser"`

---

### Task 5: Posts list, topic pages, post page

**Files:**
- Create: `app/irasai/page.tsx`, `app/irasai/[slug]/page.tsx`, `app/irasai/tema/[topic]/page.tsx`, `app/_components/Posts/TopicFilter.tsx`, `PostNav.tsx` (+ scss)
- Modify: `app/_components/BlogPost/BlogPost.tsx`, `BlogPost.module.scss`
- Delete: `app/blog/`, `app/_components/BlogList/`

**Interfaces:**
- Consumes: `readAllPosts`, `readPostBySlug`, `adjacentPosts`, `postsByTopic`, `TOPICS`, `topicBySlug`, `PostCard`, `TopicTag`, `EmptyPosts`, `Footer` newsletter slot (none yet).
- Produces: `<PostNav newer={BlogPost|null} older={BlogPost|null} />`; `<TopicFilter active={string | null} />` (chip row: `Visi` → `/irasai`, then each topic → `/irasai/tema/<slug>`).

- [ ] **Step 1: Posts list** — `/irasai`: `<h1>Įrašai</h1>`, `<TopicFilter active={null} />`, grid of `<PostCard>`s newest first, `<EmptyPosts />` when empty.

- [ ] **Step 2: Topic pages** — `generateStaticParams` returns every `TOPICS` slug (always, even with no posts); `dynamicParams = false`; page shows `<TopicFilter active={slug} />`, the filtered cards, or a short `.hand` note `Šia tema įrašų dar nėra.` when none.

- [ ] **Step 3: Post page** — move `[slug]` to `/irasai/[slug]`, keep the `_empty` fallback param; `generateMetadata` sets title `"<post title> – Gyčio Bičiūkis"` and description from `summary`. `BlogPost` shows title, date (if any), `<TopicTag>`, body; body images full content width, rounded, `.post-image-link` with `cursor: zoom-in`; `<PostNav>` at the bottom (newer labelled `← Naujesnis`, older `Senesnis →`).

- [ ] **Step 4: Verify with sample posts** (same five as Task 4) — `npm run build` produces `out/irasai.html`, `out/irasai/<slug>.html` for each, and `out/irasai/tema/{statyba,zinios,bitynas,spieciai}.html`; the unknown-topic post appears in `irasai.html` but in no topic page. Remove samples.

- [ ] **Step 5: Verify** — `npm test -- --run && npm run lint && npm run build`.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: posts list, topic pages and post page under /irasai"`

---

### Task 6: About page and 404

**Files:**
- Create: `app/apie/page.tsx`
- Modify: `app/not-found.tsx`
- Delete: `app/about/`

**Interfaces:**
- Consumes: `readAbout`, `About`, `<Logo>`.

- [ ] **Step 1: About** — `<h1>Kaip viskas prasidėjo</h1>`; optional photo (from `About.photo`) shown as a tilted scrapbook print; body HTML styled like the post body. When `html` is `''`, show `.hand` note `Istorija jau rašoma…`.

- [ ] **Step 2: 404** — heading `Puslapis nerastas`, line `Atrodo, ši bitė nuskrido kitur.`, link `Grįžti į pradžią` → `/`, small `<Logo>`.

- [ ] **Step 3: Verify** — `npm run build`; `out/apie.html` contains the placeholder line from `about.md`; `out/404.html` contains `Puslapis nerastas`. Then `npm test -- --run && npm run lint`.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: about page and 404"`

---

### Task 7: RSS feed and CMS config

**Files:**
- Create: `app/utils/rss.ts`, `app/utils/rss.test.ts`, `app/rss.xml/route.ts`
- Modify: `.cms.json`, `app/layout.tsx` (feed `<link rel="alternate" type="application/rss+xml">` via `metadata.alternates`)

**Interfaces:**
- Consumes: `readAllPosts`, `BlogPost`, `SITE_NAME`, `SITE_URL`, `TAGLINE`.
- Produces: `buildRss(posts: BlogPost[], siteUrl: string): string` (RSS 2.0; channel title `SITE_NAME`, link `siteUrl`, description `TAGLINE`, language `lt`; one `<item>` per post with `title`, `link` = `${siteUrl}/irasai/${slug}`, `guid` = same link, `description` = summary, `pubDate` (RFC-822 from `isoDate`) only when `isoDate` is set, and `<enclosure url="${siteUrl}${thumbnail}" type="image/jpeg" length="0"/>` only when `thumbnail` is set).

- [ ] **Step 1: Write failing tests**

```ts
// title 'Medus & vaškas <2026>' → output contains 'Medus &amp; vaškas &lt;2026&gt;'
// post link 'https://gyciobiciukis.lt/irasai/sablonas'
// isoDate '2026-01-15' → '<pubDate>Thu, 15 Jan 2026 00:00:00 GMT</pubDate>'
// isoDate '' → no '<pubDate>' in that item
// thumbnail '' → no '<enclosure'
// [] → valid channel with zero <item>
```

- [ ] **Step 2: Run, verify fail** — `npx vitest --run app/utils/rss.test.ts`.

- [ ] **Step 3: Implement** `rss.ts` (escape `& < > " '`), and `app/rss.xml/route.ts` with `export const dynamic = 'force-static'` and a `GET` returning `buildRss(await readAllPosts(), SITE_URL)` with `Content-Type: application/rss+xml; charset=utf-8`.

- [ ] **Step 4: `.cms.json`** — collection `name` → `Įrašai`; `topic` → `{ "name": "topic", "type": "select", "options": ["Statyba", "Žinios", "Bitynas", "Spiečiai"] }`. Do not add stats yet.

- [ ] **Step 5: Verify** — `npm test -- --run && npm run lint && npm run build`; `out/rss.xml` exists and starts with `<?xml`.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: RSS feed and topic select in CMS config"`

---

### Task 8: Newsletter sign-up

**Files:**
- Create: `app/_data/newsletter.ts`, `app/_components/Newsletter/Newsletter.tsx`, `Newsletter.module.scss`
- Modify: `app/_components/Footer/Footer.tsx`, `app/irasai/[slug]/page.tsx`

**Interfaces:**
- Produces: `NEWSLETTER: { action: string; emailField: string; hidden?: Record<string, string> } | null`; `<Newsletter />` renders nothing when `NEWSLETTER` is `null`.

- [ ] **Step 1: Choose the service (checkpoint with the user)** — research current free plans of MailerLite, Buttondown and Kit (and any obvious alternative) for: RSS-to-email included free, under 100 subscribers, double opt-in, EU/GDPR support, a plain HTML form endpoint. Present a recommendation to the user, who creates the account and connects `https://gyciobiciukis.lt/rss.xml`. Record the form `action` URL and field name in `newsletter.ts`. If the user hasn't set it up yet, set `NEWSLETTER = null` and continue — the form appears once the config is filled.

- [ ] **Step 2: Build `<Newsletter />`** — heading `Gaukite naujus įrašus el. paštu`, email input (placeholder `jusu@pastas.lt`, `type="email"`, `required`), button `Prenumeruoti`, small note `Laiškas tik tada, kai atsiranda naujas įrašas. Atsisakyti galima bet kada.`. Plain HTML `<form method="post" action={NEWSLETTER.action} target="_blank">` so it works without JS; the service's own page shows the confirmation (MonaArchus `Form.vue` is the copy-tone reference only).

- [ ] **Step 3: Place it** — in `<Footer>` on every page and at the bottom of each post page above `<PostNav>`.

- [ ] **Step 4: Verify** — with `NEWSLETTER = null`: build succeeds and `out/index.html` has no `<form`. With a dummy config: `out/index.html` contains `Prenumeruoti`. Restore the real/`null` value. `npm test -- --run && npm run lint`.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: newsletter sign-up form"`

---

### Task 9: Final check and deploy

- [ ] **Step 1: Full verification** — `npm test -- --run && npm run lint && npm run build` all succeed with `app/_data/_blog/` empty.
- [ ] **Step 2: Visual check at phone and desktop width** — `npm run dev`; check `/`, `/irasai`, `/irasai/tema/statyba`, `/apie`, a missing URL, at 360px and 1280px: no horizontal scroll, logo overlaps the hero edge, Lithuanian letters render in all three fonts.
- [ ] **Step 3: Push** — `git push`; confirm the `🚀 Deploy` run succeeds (requires the `SSH_PRIVATE_KEY` secret) and https://gyciobiciukis.lt serves the new home page.

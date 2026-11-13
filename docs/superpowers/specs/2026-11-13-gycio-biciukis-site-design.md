# Gyčio Bičiūkis — Site Design

**Date:** 2026-11-13
**Status:** Draft, awaiting approval
**Repo:** `marciukasb/GycioBiciukis` (scaffold already exists; see "Current state")

---

## Intent

A Christmas present for a dad who keeps bees. He builds his own hives over the winter, using his own design and jigs he made to speed up and standardise the work. He keeps the hives in his back garden, at his daughter's garden and at a few friends' places, and he catches swarms with traps on his roof. Beekeeping started as a gift from his daughter after he and his son finished building the family house together. It filled an empty space, and the bees now take up all his free time. He lost a lot of colonies last winter and kept going.

The son has moved out, and the dad has no one to show his projects to day to day. Whenever his son visits, he's eager to show what he's built. **The site exists to give him an audience.** It's a public place where he posts what he built, what he learned (he watches a lot of bee content in several languages) and what's happening with the bees, and where family, beekeeper friends and the people who buy his honey can follow along.

The domain `gyciobiciukis.lt` was his birthday present; the site is the Christmas present.

## Readers

- **Family** (the son and daughter): want to see what he's up to and be told when he posts.
- **Beekeeper friends:** come for the builds and the know-how.
- **Honey buyers:** want the story behind the jar. A QR code or the URL on his jar stickers may send them here later, so expect first-time visitors on phones with no context.

## Goals

1. The first thing anyone sees is **his logo** and his place, so it's obvious within seconds whose site this is.
2. The site feels **modern but cozy**: handmade, personal, warm.
3. The site **never looks empty or sad**, whether it has 0, 1 or many posts.
4. **Posting is simple and reliable.** He posts himself through Marksman (see "Related project").
5. People can **sign up to get an email** when he publishes a new post.

## Non-goals

- Selling honey. No shop, prices, ordering, contact form or contact details. He doesn't produce enough to advertise.
- A contacts page (Ember has one; this site drops it).
- Comments, accounts, search or dark mode.
- An English version. The site is Lithuanian only (`<html lang="lt">`).

## Anti-goals (failure even if it technically works)

- It looks like a shop or a corporate site.
- His contact details are spread around the site.
- It looks empty or sad on Christmas morning.
- Posting is fiddly enough that he stops doing it.

---

## Look and feel (decided)

The direction is a **"workshop journal"** with a cleaner, modern layout. The user chose this from mockups (option 3, "sticker on a photo").

- **Palette:** warm paper and cream backgrounds, honey and amber accents, dark warm brown text. No pure white or pure black. The real logo's colours may adjust this once the file is available.
- **Type:** a classic serif for headings (the mockups used Fraunces), a friendly rounded sans-serif for body text (mockups used Nunito; it must support Lithuanian characters such as ą č ę ė į š ų ū ž) and an occasional handwritten accent (mockups used Caveat). The handwritten accent is the designer's suggestion and is kept sparse.
- **Photos** do most of the work. Post cards look like prints in a scrapbook: an off-white card with a soft shadow.
- **Mobile first.** Most readers will be on phones.
- **Assets:** a designer friend may later supply illustrations (bees, hive outlines, a honeycomb pattern). The build must not depend on them; use placeholders and simple CSS until they arrive.

### Logo

His real logo is round: a cartoon of him with text running around the edge. It's printed on stickers for his honey jars. The son is looking for the file (format unknown). Until then, use a round placeholder badge and keep it easy to replace: one file in `public/images/`, referenced from a single component.

---

## Pages

### Home (`/`)

From top to bottom:

1. **Navigation:** links to Įrašai (posts) and Apie (about). The site name or logo goes on the left, or is omitted on Home because the hero shows it.
2. **Hero:** a large photo of his hives or garden with rounded corners. His **round logo sits on the lower-left corner like a jar sticker**, slightly rotated and overlapping the bottom edge. The headline is on the photo, e.g. "Bitės, aviliai ir medus iš mūsų sodo". A temporary hero photo is needed (see open items).
3. **Intro:** one or two sentences about who he is.
4. **Latest posts.** The layout depends on how many posts exist:
   - **0 posts:** a friendly dashed-border placeholder with a handwritten line, e.g. "Pirmasis įrašas jau pakeliui…" ("The first post is on its way…").
   - **1 post:** that post as a single large featured card (photo, topic, title, excerpt, date).
   - **2+ posts:** the newest as the featured card, with a row of smaller cards below (up to 3), plus a link to all posts.
5. **"Garden in numbers" strip:** three stat tiles for **aviliai** (hives), **sodai** (gardens/locations) and **bičių šeimos** (bee colonies). Values come from `app/_data/stats.md` (see "Stats").
6. **Story teaser:** a round photo, the heading "Kaip viskas prasidėjo" ("How it all started"), one line and a link to Apie.
7. **Footer:** the newsletter sign-up (see "Newsletter") and a small copyright line. No contact details.

The mockups saved in `.superpowers/brainstorm/` (`logo-hero.html` option 3 and `post-states.html`) are the visual reference.

### Posts (`/irasai` or `/blog`, builder's call)

- All posts, newest first, as scrapbook cards.
- Filter by topic, done statically (e.g. one page per topic, or client-side filtering on the static page).
- Works with 0 posts, showing the same friendly empty state.

### Post page (`/<posts>/[slug]`)

- Title, date (Lithuanian format), topic tag, then the body.
- Photos appear between paragraphs at the content width; tapping one opens it larger (a lightweight lightbox or a link to the full image).
- A thumbnail is **optional**. Posts without one must look complete both in lists and on the post page.
- At the bottom: links to the previous and next posts, and the newsletter sign-up.
- Posts typically have **a few photos** (1–5), not big galleries. No carousel.

### About (`/apie`)

- The story: the house built together, the bees given by his daughter, the hives he builds each winter with his own jigs, the roof swarm traps, the hard winter.
- **The son writes this, with help from his sister.** Ship it with Lithuanian placeholder text and an obvious marker. The content lives in a Markdown file (e.g. `app/_data/about.md`) so it can be edited without touching code.

### 404

A warm, on-brand "page not found" in Lithuanian with a link home.

---

## Content model

### Posts

Markdown files with front matter in `app/_data/_blog/` (already set up). The fields:

| field     | type     | notes                                            |
| --------- | -------- | ------------------------------------------------ |
| title     | text     |                                                  |
| summary   | textarea | used as the excerpt on cards                     |
| topic     | select   | fixed list (below)                               |
| date      | date     |                                                  |
| thumbnail | image    | optional                                         |
| body      | markdown | images inline as `![alt](/images/...)`           |

**Topics** (fixed list, a `select` in `.cms.json`): **Statyba** (builds), **Žinios** (things he learned), **Bitynas** (season and hive updates), **Spiečiai** (swarms and roof traps). This list is the designer's proposal and is easy to change.

Images are stored in `public/images/` and referenced as `/images/<file>`.

### Stats

`app/_data/stats.md`, front matter only:

```yaml
---
aviliai: 24
sodai: 3
seimos: 18
---
```

The numbers are placeholders. It's declared in `.cms.json` as a **single-entry** item so Marksman can edit it directly. Marksman doesn't support single entries yet; that's tracked in the Marksman project. Until then, the file is edited on GitHub. Label text for each stat is in the site code, not the file.

### About

`app/_data/about.md`: Markdown body with optional front matter (e.g. a photo).

### `.cms.json`

Update it to make the topic a `select` with the list above, and add the stats single-entry declaration in whatever shape the Marksman work settles on. If that shape isn't decided when the site is built, add only the topic change and leave stats out of `.cms.json` for now.

---

## Newsletter

- At build time, generate an **RSS feed** (e.g. `/rss.xml`) covering all posts: title, link, date, summary and thumbnail where there is one.
- A **footer sign-up form** in Lithuanian (an email field and a button, with success and error messages) posts to a **third-party newsletter service** that:
  - stores the subscriber list (the user is fine with a third party holding it),
  - handles double opt-in and unsubscribing (GDPR, since the site is in Lithuania),
  - sends an email automatically when a new item appears in the RSS feed.
- **The service is not chosen yet.** Candidates include MailerLite, Buttondown and Kit. The deciding requirement is that **RSS-to-email is included in a free plan** at family-and-friends scale (under 100 subscribers). Check this before building the form, because the form markup depends on the service.
- The son and daughter subscribe like everyone else. No custom email step is needed in the deploy workflow.
- The MonaArchus repo's `src/components/Form.vue` (an EmailJS contact form) is a useful reference for Lithuanian form copy and success/failure states, but it is not the mechanism.

---

## Constraints

- **Stack (already scaffolded):** Next.js 14.2 App Router with `output: "export"`, SCSS modules (shared variables, breakpoints and colours are injected automatically), TypeScript, Vitest, `gray-matter` and `marked`. The site is fully static with no server code.
- **Hosting:** Hostinger, the same account as EmberInstruments. `.github/workflows/main.yml` builds, runs the tests and rsyncs `out/` to `domains/gyciobiciukis.lt/public_html/` on every push to `master`. It needs the `SSH_PRIVATE_KEY` repo secret, which the user is adding.
- **Content is edited through Marksman,** a client-side CMS that commits to the repo through the GitHub API. Marksman commit messages start with `cms:`.
- **Lithuanian only:** all UI text, dates (`lt-LT`) and slugs must handle Lithuanian characters. Post slugs come from Marksman's `generateSlug`, which drops non-ASCII letters (e.g. "Šablonas" becomes "ablonas"). That's a Marksman issue to fix there; the site should simply use whatever slug the file has.
- **Deadline:** live before **Christmas 2026**, with time left over for the Marksman work.

## Current state

The repo already contains a bare-bones scaffold: placeholder pages (Home, About, Blog, Contacts, 404), a fixed navigation bar, the Markdown blog pipeline with tests (copied from EmberInstruments and adapted), `.cms.json` with a "Blog Posts" collection, the deploy workflow, and `SITE_NAME = "Gyčio Bičiūkis"`. The Contacts page goes away and Blog becomes the posts page, in Lithuanian.

## Open items (not blocking the build)

- **The logo file** (the son is looking for it). Use a placeholder until it's found.
- **His first name** for the intro text is assumed to be Gytis (from "Gyčio"). Confirm before launch.
- **A hero photo** of the hives or garden. Use a warm placeholder until the son provides one.
- **The About text** (written by the son and daughter).
- **The newsletter service** choice (see above).

## Left to the builder

- Exact fonts, colours, spacing and component breakdown, within the look described above.
- Whether the posts URL is `/irasai` or stays `/blog`.
- How topic filtering works, as long as it's static.
- Image lightbox approach (keep it light).
- How the RSS feed is generated during a static export.

---

## Related project: Marksman reliability (separate, after the site)

Not part of this build, but the reason the site must stay compatible with it. Next brainstorm:

- drag in several photos at once, with automatic resizing and conversion to JPEG (he uses Android and Windows, and gets photos onto the PC with Phone Link)
- unique image filenames (no silent overwrites)
- `select` topics in the editor
- drafts that can be reopened
- one deploy per post instead of one per image commit
- single-entry support (for `stats.md`)
- Lithuanian-friendly slugs
- hosting and access for him (it already deploys to GitHub Pages; he needs his own token)
- possibly later: start a post from his phone and finish it on the computer

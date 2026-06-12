# SEO Playbook — abdulhadisheikh.com

> **For Claude sessions:** Read this file fully before doing any SEO task. It defines the strategy,
> the routine, and the rules. The owner's positioning: business process automation,
> change & project management, and marketing & sales process consulting. Global/remote clients.
> Tone: warm, witty, honest, first-person. Never invent credentials or metrics.

---

## 1. Goal & funnel

- **Business goal:** inbound consulting inquiries via email (magic.alive11@gmail.com).
- **Funnel:** search → blog post or service page → internal links → /services/ → email CTA.
- **Conversion pages:** `/services/` (primary), `/about/`, `/acme-spm` (proof).
- Every blog post must link to at least one service and end at the contact CTA (the BlogPost layout adds it automatically).

## 2. Keyword strategy — three pillars

New domain with low authority → target **long-tail, problem-phrased keywords** (low difficulty,
high intent) and let pillar pages accumulate authority. One primary keyword per page, in: title
tag, H1, first 100 words, one H2, and the meta description.

### Pillar A — Business Process Automation (service page section = pillar)
Supporting post targets (problem-phrased, low competition):
- "how to automate approval workflows without coding"
- "spreadsheet to workflow automation" / "stop managing projects in spreadsheets"
- "demand intake process template"
- "business process automation consultant" (pillar/services)
- "executive dashboard for project status"

### Pillar B — Change & Project Management
- "why software rollouts fail adoption"
- "change management for new software implementation"
- "project portfolio visibility for leadership"
- "change management is therapy" (already owned — strengthen it)
- "risk register out of spreadsheets"

### Pillar C — Marketing & Sales Process
- "cold email scripts that get replies B2B"
- "sales qualification framework small business"
- "marketing spend can't trace to revenue"
- "positioning for service businesses"
- "cold calling objection handling examples" (existing post: cold-calling-karachi — strengthen)

### Rules
- Check existing posts before writing: never cannibalize (two pages targeting one keyword).
- Prefer keywords a buyer types when they HAVE the problem, not when researching the industry.
- The personal-story angle is the differentiator (E-E-A-T): every post grounds advice in
  lived experience (cold calls, cement factory, platform implementations).

## 3. Content routine (the recurring Sonnet task)

**Cadence: 1 post per week minimum.** Each session:

1. Read this playbook + `git log --oneline -10` for context.
2. Check `/seo-data/` for fresh GSC/Ahrefs exports (see §6). If present, pick the target
   keyword from data (queries with impressions but position > 10 = quick wins). If absent,
   take the next unused keyword from §2, rotating pillars A → B → C.
3. Write the post in `src/content/post/` (`.md`, follow existing frontmatter shape:
   title, description, publishDate "DD mon YYYY", tags, optional ogImage).
   - 1,200–2,000 words. Title ≤ 60 chars with the keyword. Description ≤ 155 chars.
   - Structure: hook story → the problem → concrete framework/steps → honest caveats → CTA.
   - 2–4 internal links (one to a service, one to a related post). 1–2 external links to
     authoritative sources.
   - Voice: first person, warm, witty, no corporate filler, no AI clichés ("in today's
     fast-paced world", "game-changer", "delve").
4. Update one OLD post (rotate): refresh date if meaningfully edited, add internal links to
   the new post, tighten the intro.
5. Build (`npm run build`) to verify, commit, push/PR.

**Monthly session (first week of month):** technical crawl review — broken links, sitemap,
Core Web Vitals from Vercel Analytics/Speed Insights, GSC coverage errors, schema validation
(validator.schema.org against the live homepage and one post).

## 4. Technical SEO — current state (done, don't redo)

- ✅ JSON-LD: Person + WebSite sitewide, BlogPosting on posts (BaseHead.astro)
- ✅ Prerendered static pages, sitemap, robots.txt, RSS
- ✅ WebP images, OG images 1200×630, canonical URLs, Twitter meta `name=` fixed
- ✅ 301: /projects/acme-spm → /acme-spm
- ✅ Ahrefs verification meta tag; Vercel Web Analytics script
- ⚠️ TODO when touched: alt text on any new images; keep titles unique; new pages need
  `export const prerender = true`

## 5. Off-page (owner tasks — Claude drafts, owner posts)

Each content session, also produce ONE of (rotate):
- A LinkedIn version of the week's post (300 words, hook-first, link in comments style)
- 2 community answers (r/projectmanagement, r/smallbusiness, Indie Hackers, relevant
  Slack/Discord) where a post genuinely answers the question — draft them from the post
- A guest-post pitch (target: PM/automation/marketing blogs) — one paragraph pitch + 3 titles
- Directory/profile checklist item: Clutch, Credly badges linked to site, Google Business
  Profile, relevant freelancer platforms

## 6. Data inputs (owner provides, drop into `/seo-data/` in repo)

| Source | Export | Cadence |
|---|---|---|
| Google Search Console | Performance → Queries + Pages CSV (last 28 days) | Monthly |
| Ahrefs | Site Audit issues CSV + Organic Keywords + 2–3 competitor gap CSV | Monthly |
| Vercel Analytics | Top pages + referrers (screenshot or CSV) | Monthly |

Claude: when these exist, prioritize (1) GSC queries at position 5–20 (title/content tweaks),
(2) pages with impressions but CTR < 1% (rewrite title/description), (3) Ahrefs errors.

## 7. Measurement targets (review monthly)

- Month 1–2: indexed pages growing, first non-branded impressions in GSC
- Month 3–4: 5+ keywords in top 50, 100+ organic visits/month
- Month 6: 3+ keywords in top 10, first organic inquiry email
- Always: every post indexed within a week (request indexing in GSC if not)

## 8. Hard rules

- Never fabricate case-study numbers, client names, or credentials.
- Never keyword-stuff; if it reads awkward, the keyword loses.
- Don't change site structure/nav/URLs without the owner asking.
- Bug fixes and SEO changes in separate commits.

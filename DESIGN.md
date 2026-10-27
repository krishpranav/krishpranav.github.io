# Since 6th grade: design system

The site is one page, told by me in the first person. It opens on who I am, set bold, with "I've been coding since 6th grade." beneath it. It is calm in the way apple.com is: a near-white ground, soft-grey tiles, near-black ink, one family set big and tight, and a lot of air. One chapter, open source, goes dark. Beside it stands my portrait, drawn in a hand-painted anime style, shown whole. Colour lives in the pictures: the portrait and the cities I've been to. The companies I've worked at appear as their own marks, in the same ink as the words around them.

Tokens live in `app/tokens.css` (Tailwind v4 `@theme static`, so every token is also a utility: `bg-paper-2`, `text-muted`, `font-outlier`). Shared rules are in `app/base.css`, and components in `app/globals.css`. The first lines of `globals.css` are the Hallmark stamp, its waivers, and the record of what the redesign reworded or dropped. Content lives in `lib/resume.ts`; no copy about experience is hard-coded in components.

## Content rules

- Every role, date and number comes from the latest résumé (`public/Krisna_Pranav_Resume.pdf`) or GitHub (`lib/github.generated.json`, refreshed by `scripts/fetch-github.mjs`). The previous résumé's figures stay retired.
- First person throughout: "I build", "Where I've been", "Say hello". No interview questions as heads, and no product-page taglines.
- No demo widgets. The work is told in words, official marks and real figures.
- Marks carry meaning wherever a thing has one, all official and all in the current ink:
  - **Employers** (Turing, Uber, PayPal, Crossing Hurdles) and **projects I've fixed** (Tauri, Playwright) are masks from `public/logos/`.
  - **The labs whose teams I work with directly at Turing** (Anthropic, OpenAI, Google, Meta) appear on the Turing tile and inline in the story.
  - **Tools and languages** on every stack line, **the platforms the notetaker joins** (Zoom, Teams, Meet, phone), **my games** (Counter-Strike's mark and the CS:GO wordmark, Fortnite) and **my trades** (Bitcoin, Dogecoin, a chart) come from `components/primitives/Marks.tsx`.
  - A tool with no official mark (gRPC, AWS, SSE) is simply written. There are no client logos.
- No em or en dashes in copy. A date range is two dates joined by a drawn rule (`<Period>`).
- Accounts: GitHub, LinkedIn and X (@krishpranav5), the ones my GitHub profile links. Each is shown with its own mark (`components/primitives/Social.tsx`).
- Cities are the ones I've been to: Singapore, where I'm based and work; Bengaluru, where I travel often; and San Francisco. Each is a 1200x411 pixel panorama in one golden-hour palette. San Francisco is my own image (`public/cool-bg.jpg`). Bengaluru (Vidhana Soudha, trumpet trees in bloom, an auto-rickshaw) and Singapore (Marina Bay Sands, the ArtScience Museum, the skyline, the Supertrees) are painted to match it by `scripts/cities.mjs`, at 400x137 and scaled 3x. Its kit draws a warped dithered sky, streaky cirrus, cumulus from sunlit puffs, glass towers, rippled reflections, foliage from leaf clumps and blooms, in colours sampled from the SF image.
- At Uber I worked in its AI labs, on work used to train frontier AI models (my own account).
- Off the clock is in my own words: 5,000 hours in CS:GO, 1,250 in Fortnite, professional sim racing, and trading crypto, meme coins and the stock market. Nothing is added to it.
- No education on the page.
- Location is Singapore (`Asia/Singapore`, UTC+08:00), my main place and where I work; I travel often to Bengaluru. The local clock is 12-hour ("7:40 pm") and renders nothing until the client knows the time.

## Colour (OKLCH)

| Token | Value | Use |
|---|---|---|
| `paper` | `oklch(99.3% 0.002 270)` | page ground |
| `paper-2` | 96.7% | tiles (work, how I work), quiet pills |
| `paper-3` | 93.2% | pill hover, hairlines inside tiles |
| `ink` | `oklch(21% 0.006 270)` | heads, body, the filled pill |
| `ink-2` | 38% | running text inside tiles |
| `muted` | 53% | leads, captions, meta |
| `rule` | 89% | hairlines between rows |
| `accent`, `accent-ink` | ink, paper | the accent is the ink; the page is monochrome on purpose |
| `focus` | `oklch(53% 0.19 258)` | focus rings, 2px, instant |
| `night`, `night-2`, `night-3` | 15.5%, 21%, 26% | the dark chapter, its cards, its logo wells |
| `night-ink`, `night-muted`, `night-rule`, `night-focus` | 97%, 72%, 31%, a light blue | type, rules and focus on night |

Light, with one dark chapter. The bar turns night while it sits over it.

## Type

- **Onest** (variable, 400/500/600) for everything, through `--font-display` and `--font-body`. Heads are 600, tight-tracked, one weight and one colour.
- **Geist Mono** (`--font-outlier`) only for code in the diffs.
- Roles: `.t-hero` (to 96px), `.t-section` (to 72px), `.t-statement` (to 52px, the story), `.t-figure` (to 88px, proportional figures), `.t-title` (to 32px), `.t-lead` (to 26px). Body is 17px.
- Labels and captions are the body face, a step smaller, sentence case, never tracked capitals.

## Grid and space

The container is 1200px, centred, with a 40/24/20px gutter. The grid is 12 columns from 60rem and 4 below, with a 24px column gap (16px on phones). Section gaps are 160/112/80px (`--section-gap`), with `-s` and `-l` steps. Sections land flush under the 52px bar when jumped to (`lib/lenis.ts`).

## Surfaces

- **Tile:** `paper-2`, 28px radius (`--radius-card`), no shadow, no border. It holds the work bento and "How I like to work".
- **Inner:** 14px radius (`--radius-inner`), for logo wells, diffs, and palette rows.
- **Pill:** 999px. There is one filled recipe, `.btn--primary` (ink), recoloured through `--btn-fill` in the night bar; every other button is the quiet grey pill.
- **Glass:** the bar uses paper at 78% with blur 20px, or night at 72% over the dark chapter.
- **Portrait:** 28px radius, a 1px ink hairline at 8%, no drop shadow.

## Components

- **Portrait** (`Portrait`): my illustrated portrait (`public/me/illustrated.jpeg`, 1792x2400), shown whole and still. The frame takes the image's exact proportions, so nothing is cropped, with the card radius, a 1px hairline and the pop shadow. It is served as AVIF, then WebP, then JPEG at 600, 900 and 1200 wide. In the hero it pairs with the text, centred with a 96px gap, at up to 440px wide.
- **Social marks:** 44px round targets, muted ink that turns to ink on a paper-2 wash. They sit in the hero's action row, the mobile menu, and the contact links with their handles.
- **Logo:** an SVG or PNG used as a CSS mask in `currentColor`, at an optical height per mark. With `inline`, it stands in for the company name inside a sentence, sized in em and dropped to sit on the baseline (`INLINE` in `Logo.tsx`).
- **Story:** five lines in `.t-statement`, pinned on desktop while each lights from 18% to full ink (CSS scroll timeline). It is static and fully lit elsewhere.
- **Work bento:** spans of 12, 7+5 and 5+7. Each tile has a mark or a name, an optional real figure, a first-person h3, two sentences, and a footer with the title, dates and stack.
- **Experience:** native `<details>` rows on one 12-column grid. A company with an official mark shows the mark, inline and middle-aligned on the row's first line (Crossing Hurdles' badge with its name beside it). A plus turns to a cross, and the detail settles in. The list ends on "6th grade".
- **Off the clock:** a games tile (Counter-Strike's mark and the CS:GO wordmark, 5,000 as the figure, Fortnite beneath a hairline) beside the racing and trading lines, set large with their marks inline.
- **Cities stack:** pixel panoramas piled like prints, the next card peeking above at 2deg. The front card follows a drag and, thrown past 90px or sent on by the arrows, flies out to the side and tucks in at the back; city names jump straight to one. Under 40rem the frame turns 4:3 and holds each city's landmark (`focus`). Without script the cards sit in a column; under reduced motion they swap without flying.
- **Command menu:** ⌘K, or the footer's "Press ⌘K" button (`kp:palette` event).

## Motion

The hero settles in once (`.rise`, staggered). Sections reveal once with a 24px rise; content is visible without script and under reduced motion. The story is the page's one scroll pattern. Lenis smooths the wheel and is off under reduced motion. Only `transform` and `opacity` animate.

## Verification

`npx tsc --noEmit`, then `npx next build` (static export). For the Hallmark lint, run `node ~/.claude/skills/hallmark/scripts/sloplint.mjs <files> --render --kept --url http://localhost:3123/` with the dev server up. The share image and icons come from `node scripts/og.mjs` after a build.

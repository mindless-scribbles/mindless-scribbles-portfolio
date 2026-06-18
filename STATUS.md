# STATUS.md

## Last Session

- **Date:** 2026-06-16
- **Summary:** Started the **home hero font experiment** on a new branch `experiment/home-fonts-logo` (off `main`). Goal: change the font of "Mindless" in the hero wordmark and possibly the header "MS" logo. (1) Swapped "Mindless" (`.wordSolid`) from Playfair Display to the Google font **Rubik Glitch** — registered `Rubik_Glitch` via `next/font/google` as `--font-glitch` in `HomePage.tsx`. (2) Then reworked it per request into a **hover-driven glitch transition**: resting state is back to original Playfair; on hover, a ~650ms RGB-split glitch burst masks an instant swap to Rubik Glitch, then a ~4500ms `ease-in` crossfade drifts back to Playfair, locked against re-trigger until fully reverted. Implemented as a two-layer stack (serif + glitch span, `data-text="Mindless"`) driven by a JS state machine (`idle → in → out → idle`) in `HomeUI.tsx`, with glitch keyframes + `prefers-reduced-motion` guard in `home.module.css`.
- **✅ RESOLVED (2026-06-18):** The "no visible animation on hover" was **not a bug** — the browser was reporting `prefers-reduced-motion: reduce`, so `triggerGlitch` (`HomeUI.tsx:28-31`) correctly early-returned. Confirmed by driving system Chrome over the DevTools Protocol (Node 22, no deps): with normal motion, hover flips `data-glitch` `idle→in`, glitch layer opacity→1, font resolves to **Rubik Glitch** — effect works perfectly; with `prefers-reduced-motion: reduce` emulated, it stays `idle` (suppressed). State machine, CSS, and font wiring are all correct. **Decision (revised): the reduced-motion guard was REMOVED — the full glitch now plays for all visitors regardless of `prefers-reduced-motion`.** Rationale: a large share of visitors (incl. the user, on Windows with animation effects off) run reduced-motion by default, which made the signature hover effect invisible; user explicitly chose "always full glitch" over an accessibility-correct fallback. Removed the JS `matchMedia` early-return in `triggerGlitch` (`HomeUI.tsx`) **and** the `@media (prefers-reduced-motion: reduce)` block in `home.module.css`. Re-verified via CDP: hover now flips `idle→in` + Rubik Glitch + opacity 1 in BOTH normal and emulated-reduced-motion modes; `tsc --noEmit` clean. **Work is still uncommitted on the branch** — ready to commit.

### Prior session (2026-05-30)

- Home footer + expertise copy polish. Replaced the two-button footer (View Reel / Start Project) with a single two-line **Current / Experiment** outline button, center-aligned. Fixed landscape-mobile layout: capped `.mission` max-width (320→260px) and added a 24px footer column-gap so the mission block stops touching the button; lifted the hero wordmark off the footer and nudged it right with `transform: translate(15px, -10px)` on `.heroArea` in the `(orientation: landscape) and (max-height: 600px)` media query. Rewrote the expertise bio to tighter copy ending "pixels that breathe". All landscape tweaks live in that one media query (`home.module.css:441`). Committed `0bbce7a` + `5f894ff`, pushed to `origin/main` (now at `5f894ff`).

### Prior session (2026-04-12)

- Extracted `dondecastro-demoreel/` out of this repo into its own standalone local git repo. Moved the folder up one level (`../dondecastro-demoreel/`), committed the deletion here (`9af6bd1`), then `git init`'d the new location with a single root commit (`f487eb8`). No GitHub remote created for the new repo yet — user will push it when they open the demoreel session.

## Project State

**mindless-scribbles.com** is live on Vercel as a Next.js (Pages Router) playground. Core site structure and design are in place.

Shipped so far (recent commits):

- Repo repurposed from the original Stackbit template into the mindless-scribbles.com playground (`a28e783`).
- First-pass site design (`dd42bce`) and mobile-responsive typography/layout pass (`12e4b53`, `43f03fc`).
- Home landing design in `src/components/home/` — `HomeUI` chrome (brand, nav, cursor), `ThreeBackground` 3D scene, `BlurMask`, `CustomCursor`.
- Journal system: `a5af98b` added journal detail pages with a cellular shader background; `243e0ef` added a journal template and excluded underscore-prefixed files (`_template.md`) from routing. One real entry so far: `reaction-diffusion-systems.md`.
- Info page split into `/expertise` and `/contact` with a dedicated contact form module (`d99393b`).
- Unified header/nav continuity (`aef785d`), email + socials with click-to-copy (`acd9dbd`), TRANSMIT_DATA button match (`660df2e`), `lumo` → `home` rename (`c41dd51`).
- `dondecastro-demoreel/` subfolder extracted into its own repo (`9af6bd1`).

**Clean on `main`:** nothing uncommitted; local and `origin/main` both at `9af6bd1`.

## Files Modified (this session)

All uncommitted, on branch `experiment/home-fonts-logo`:

- `src/components/home/HomePage.tsx` — imported `Rubik_Glitch` from `next/font/google` (weight 400, `--font-glitch`); added `rubikGlitch.variable` to the page wrapper className.
- `src/components/home/HomeUI.tsx` — added the glitch state machine (`GLITCH_IN_MS = 650`, `GLITCH_OUT_MS = 4500`, `GlitchState`, `glitch` state, `lockRef`, `timersRef`, `triggerGlitch`, cleanup `useEffect`); replaced the single `.wordSolid` `<h1>` with a two-`<span>` stack (`wordLayerSerif` + `wordLayerGlitch data-text="Mindless"`), `data-glitch={glitch}` + `onMouseEnter={triggerGlitch}` on the `<h1>`.
- `src/components/home/home.module.css` — `.wordSolid` is now a `position:relative; display:inline-block; pointer-events:auto` container; added `.wordLayerSerif` (Playfair 600), `.wordLayerGlitch` (Rubik Glitch + `::before`/`::after` RGB-split slices), `[data-glitch='in']` / `[data-glitch='out']` state rules, `glitchJitter` / `glitchSliceA` / `glitchSliceB` keyframes, and a `prefers-reduced-motion` guard.

## Key Decisions

- **Resting state = original Playfair; Rubik Glitch only appears on hover.** The hero reverts to the original font at rest (per the spec: glitch _to_ Rubik on hover, slow drift _back_ to Playfair).
- **Two-layer stack to fake a font morph.** Fonts can't tween, so "Mindless" is rendered twice (serif in flow defines the box; glitch overlaid absolute) and the burst masks the discrete swap; the return is an opacity/blur crossfade.
- **No fade-back (revised 2026-06-18).** The original slow `ease-in` revert to Playfair was removed per user preference. Flow is now `idle → in (650ms burst) → held` — after the burst the word **settles on the static Rubik Glitch font and stays**. It resets to Playfair only on **page refresh** (state initializes to `idle`).
- **Fires once, then locked** via `lockRef` (never unlocked) — the glitch plays a single time per page load; refresh to replay.

## Next Steps

- [ ] **User to eyeball the effect with motion enabled** (DevTools Rendering → `prefers-reduced-motion: no-preference`, or Windows Animation effects = On), then **commit the branch** if happy.
- [ ] Once visually confirmed: dial timing/intensity (`GLITCH_IN_MS`/`GLITCH_OUT_MS`, keyframe `translate` px, revert `blur`) to taste.
- [ ] Decide whether the header **"MS" logo** also gets Rubik Glitch (still Playfair).
- [ ] (carryover) Wire up the Contact form; add more journal entries.
- [ ] (carryover) Push `dondecastro-demoreel/` repo to GitHub when starting that project.

## Active Context
<!-- This section tracks anything Claude needs to know to pick up where we left off.
     Could be: a tricky bug being debugged, an architectural choice being evaluated,
     a dependency issue, or a feature half-built. -->

On branch `experiment/home-fonts-logo` (off `main` at `2a1c8fd`), 3 files modified, **uncommitted**. `main` itself is clean/pushed.

The hero glitch effect is **built, type-checks, and verified working** — the earlier "no animation" was `prefers-reduced-motion: reduce` suppressing it (see resolved note above). Code path: `HomeUI.tsx` `triggerGlitch` sets `data-glitch` on the `<h1>`, CSS `[data-glitch='in'/'out']` selectors drive the two-span stack. Decision locked: **reduced-motion guard removed** — full glitch plays for everyone (user's explicit call; the effect is a deliberate signature interaction and was invisible to the many visitors who run animations-off). Remaining work is purely the user's visual sign-off + commit, then optional timing tuning.

Verification gap: there is **no working lint** — repo has no `lint` script and ESLint v9 here has no flat config, so the `npx eslint .` in CLAUDE.md fails. Type-checking via `npx tsc --noEmit` works and was clean.

The `dondecastro-demoreel/` repo is still parked at `/home/ddecastro/workspace/github.com/mindless-scribbles/dondecastro-demoreel/` (root commit `f487eb8`), still needs a GitHub remote + first push before work begins there.

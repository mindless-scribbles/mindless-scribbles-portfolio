# STATUS.md

## Last Session

- **Date:** 2026-06-18
- **Summary:** Big iteration on the **home hero "Mindless" glitch** (branch `experiment/home-fonts-logo`). Two arcs: (A) **resolved** the lingering "no animation on hover" bug — it was never broken, the browser had `prefers-reduced-motion: reduce` and `triggerGlitch` correctly early-returned. Verified by driving system Chrome over the DevTools Protocol (Node 22, no deps — see LESSONS). Per user's call, **removed the reduced-motion guard** (JS `matchMedia` return + the `@media` block) so the signature effect plays for everyone. (B) **Redesigned the effect itself.** Dropped the Rubik Glitch font swap (read as too drastic) — "Mindless" now **stays Playfair Display** and distorts *in place* via an SVG `feTurbulence` + `feDisplacementMap` filter (horizontal chunk shred; vertical channel flattened to 0.5 so it never drifts up/down). Then choreographed it for "life": SMIL on the displacement `scale` does anticipation → overshoot hit → pull → hold → relapse → settle; the turbulence `seed` churns during the burst; a slow continuous seed drift + faint scale throb keep the settled end-state **breathing** (never a frozen frame). CSS jolt/chroma/fringe layer on top (steppy position flicker + smooth chroma dissolve). Fires once per page load; **refresh resets to clean Playfair**. `tsc --noEmit` clean throughout; behaviour verified at each step via CDP.
- **Commits this session (on `experiment/home-fonts-logo`, off `main` @ `2a1c8fd`):** `87352c4` (Rubik hover-glitch, now superseded), `ab5c651` (switch to Playfair SVG-distortion), `a658bc0` (punchy jolt + eased settle + smooth chroma fade), `104c22f` (choreographed rhythm + living/breathing end-state). Plus this wrap commit. **Branch pushed to origin.**
- **Open:** user still wants to give the "life" version a final in-browser sign-off and may tune intensity/breathing. **Perf watch:** the rest-state boil animates `feTurbulence` continuously (Chrome computes turbulence on the CPU) on top of the Three.js background — if janky on low-end machines, slow it, make it periodic, or keep only the cheap scale-throb and freeze the seed.

### Prior session (2026-06-16)

- Started the home hero font experiment on `experiment/home-fonts-logo`. Original approach (since replaced): swapped "Mindless" to the **Rubik Glitch** Google font with a hover burst that crossfaded back to Playfair. That hover-driven-revert design and the two-layer font stack are gone as of 2026-06-18 (now a single Playfair span distorted by an SVG filter).

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

Committed on branch `experiment/home-fonts-logo` (`87352c4`, `ab5c651`, `a658bc0`, `104c22f` + wrap):

- `src/components/home/HomePage.tsx` — **removed** the Rubik Glitch font (no longer imported/registered; was `--font-glitch`). Back to just Playfair / Space Mono / Italianno.
- `src/components/home/HomeUI.tsx` — single Playfair `.wordGlitch` span (no two-layer font stack); minimal state machine `idle → on` (`lockRef`, fires once); `triggerGlitch` sets `data-glitch='on'` and kicks the SMIL via `getElementById('mindlessScaleBurst').beginElement()`. Added the hidden `<svg>` `#mindlessGlitchDistort` filter (feTurbulence + feComponentTransfer chunk-quantize + feDisplacementMap) with SMIL `<animate>`s for the scale burst, seed churn, and the rest-state breathing (scale-throb additive + seed drift).
- `src/components/home/home.module.css` — `.wordGlitch` (Playfair) + `::before`/`::after` chroma fringe; `[data-glitch='on']` rules; keyframes `glitchJolt` (steppy, anticipation + relapse), `glitchChroma` (smooth, relapse bump), `glitchFringeA/B` (steppy clip flicker), `glitchFringeFade` (smooth opacity dissolve), `.glitchDefs` holder. Old Rubik/`wordLayer`/`glitchSlice`/`held`/`out` rules all gone.
- `.gitignore` — ignore `*.tsbuildinfo`.

## Key Decisions

- **Keep Playfair, distort in place.** The Rubik Glitch *font swap* read as too drastic, so "Mindless" stays Playfair Display and is shredded by an SVG `feTurbulence`+`feDisplacementMap` filter. Horizontal chunks only — the displacement-map green (vertical) channel is flattened to 0.5 so the word never drifts up/down.
- **SVG filter is driven by SMIL, not CSS** (CSS can't animate filter-primitive attributes like `scale`/`seed`). `beginElement()` triggers the scale burst; the seed-churn (`begin="...begin"`) and the breathing loops (`begin="...end"`) chain off it.
- **Choreographed, not monotonic.** Burst = anticipation → overshoot → pull → hold → relapse → settle, with the seed boiling during it. The settled end-state **breathes** (faint continuous seed drift + scale throb) so it's never a dead frozen frame.
- **Reduced-motion guard removed** — full glitch for everyone (user's explicit call; it was invisible to visitors who run animations-off).
- **Fires once per load, resets on refresh** (`lockRef` never unlocked; state starts `idle` = clean Playfair).

## Next Steps

- [ ] **User to give the "life" version a final in-browser sign-off**; tune hit/relapse intensity (`scale` `values="0;2;32;16;24;28;19;24"`), burst length (`1s`), or breathing (`values="0;1.6;-1.4;1;0"`, `5.5s`/`9s` loops) to taste.
- [ ] **Perf watch:** rest-state boil animates `feTurbulence` continuously (CPU) over the Three.js bg — if janky on low-end, slow it / make it periodic / freeze the seed and keep only the scale-throb.
- [ ] Decide whether to **merge `experiment/home-fonts-logo` → `main`** (still an experiment branch) — and whether the header **"MS" logo** gets any matching treatment (still Playfair).
- [ ] (carryover) Wire up the Contact form; add more journal entries.
- [ ] (carryover) Push `dondecastro-demoreel/` repo to GitHub when starting that project.

## Active Context
<!-- This section tracks anything Claude needs to know to pick up where we left off.
     Could be: a tricky bug being debugged, an architectural choice being evaluated,
     a dependency issue, or a feature half-built. -->

On branch `experiment/home-fonts-logo` (off `main` at `2a1c8fd`), **all committed and pushed to origin**. `main` itself unchanged/clean. Branch is NOT merged to main.

The hero glitch is feature-complete and verified working (CDP-checked at every step; `tsc` clean). Effect path: `HomeUI.tsx` `triggerGlitch` sets `data-glitch='on'` + `beginElement()` on the SMIL scale burst → CSS `[data-glitch='on']` rules run the jolt/chroma/fringe, the SVG filter shreds + boils, then settles into a breathing end-state. Only open item is the user's subjective sign-off / fine-tuning of the motion, plus the perf watch above.

**Debugging tip carried forward:** this page is client-rendered (empty `#__next` in SSR), so `curl` can't see the hero. To inspect hover/animation behaviour, drive system Chrome over the DevTools Protocol from Node 22 (global `WebSocket`, no deps) — see LESSONS for the recipe. Used it all session to read `data-glitch`, computed styles, live `feDisplacementMap.scale`/`feTurbulence.seed`, and to screenshot states.

Verification gap: there is **no working lint** — repo has no `lint` script and ESLint v9 here has no flat config, so the `npx eslint .` in CLAUDE.md fails. Type-checking via `npx tsc --noEmit` works and was clean.

The `dondecastro-demoreel/` repo is still parked at `/home/ddecastro/workspace/github.com/mindless-scribbles/dondecastro-demoreel/` (root commit `f487eb8`), still needs a GitHub remote + first push before work begins there.

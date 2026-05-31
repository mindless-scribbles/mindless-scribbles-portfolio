# STATUS.md

## Last Session

- **Date:** 2026-05-30
- **Summary:** Home footer + expertise copy polish. Replaced the two-button footer (View Reel / Start Project) with a single two-line **Current / Experiment** outline button, center-aligned. Fixed landscape-mobile layout: capped `.mission` max-width (320→260px) and added a 24px footer column-gap so the mission block stops touching the button; lifted the hero wordmark off the footer and nudged it right with `transform: translate(15px, -10px)` on `.heroArea` in the `(orientation: landscape) and (max-height: 600px)` media query. Rewrote the expertise bio to tighter copy ending "pixels that breathe". All landscape tweaks live in that one media query (`home.module.css:441`). Committed `0bbce7a` + `5f894ff`, pushed to `origin/main` (now at `5f894ff`).

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

- `src/components/home/HomeUI.tsx` — footer button block: single `Current<br />Experiment` outline link, removed Start Project.
- `src/components/home/home.module.css` — `text-align: center` on `.btn`; landscape media query gained `.mission` max-width 260px, `.footer` column-gap 24px, and `.heroArea` `transform: translate(15px, -10px)`.
- `src/components/expertise/ExpertiseUI.tsx` — rewrote bio copy (line 31).

## Key Decisions

- **Extract `dondecastro-demoreel` cleanly, no history carryover.** Used plain `mv` + fresh `git init` rather than `git filter-repo` or `git subtree split` — the folder only had 5 scaffolding files and no meaningful git history worth preserving.
- **New demoreel repo has no remote yet.** User deferred the push decision (private vs public, which GitHub account) until they start actively working on that project. Netlify works fine with private repos, so there's no deploy-driven reason to make it public.

## Next Steps

- [ ] Push the new `dondecastro-demoreel/` repo to GitHub when starting that project. Current `gh` CLI auth is `mindless-scribbles`; if it should live under a personal account, switch auth first with `gh auth switch` / `gh auth login`, then `gh repo create dondecastro-demoreel --private --source . --remote origin --push`.
- [ ] Wire up the Contact form so submissions actually go somewhere (email, Formspree, or a simple API route).
- [ ] Add more journal entries using `content/pages/journal/_template.md` as the starting point.

## Active Context
<!-- This section tracks anything Claude needs to know to pick up where we left off.
     Could be: a tricky bug being debugged, an architectural choice being evaluated,
     a dependency issue, or a feature half-built. -->

Repo is clean and pushed (`origin/main` at `5f894ff`). This session was pure UI/copy polish on the home footer + expertise bio. Landscape-mobile numbers (mission max-width 260px, hero `translate(15px, -10px)`, footer gap 24px) were eyeballed, not verified in a real device/browser — worth a quick `npm run dev` check on a landscape phone size if revisited.

The `dondecastro-demoreel/` repo is still parked at `/home/ddecastro/workspace/github.com/mindless-scribbles/dondecastro-demoreel/` (root commit `f487eb8`), still needs a GitHub remote + first push before work begins there.

# STATUS.md

## Last Session

- **Date:** 2026-04-12
- **Summary:** Split the Info page into two routes — `/expertise` and `/contact`. Renamed `src/components/info/` → `src/components/expertise/` (and the files inside: `InfoPage.tsx` → `ExpertisePage.tsx`, `InfoUI.tsx` → `ExpertiseUI.tsx`, `info.module.css` → `expertise.module.css`), moved the route to `src/pages/expertise/`, and extracted the contact form into a new `src/components/contact/` module with its own `src/pages/contact/index.tsx`. Updated `content/data/config.json` nav labels from `Info`/`/info` to `Expertise`/`/expertise`. Homepage nav cleanup (M-S dash removal + Index link removal) committed as `4f2b91f`.

## Project State

**mindless-scribbles.com** is live on Vercel as a Next.js (Pages Router) playground. Core site structure and design are in place.

Shipped so far (recent commits):

- Repo repurposed from the original Stackbit template into the mindless-scribbles.com playground (`a28e783`).
- First-pass site design (`dd42bce`) and mobile-responsive typography/layout pass (`12e4b53`, `43f03fc`).
- Home landing design in `src/components/home/` — `HomeUI` chrome (brand, nav, cursor), `ThreeBackground` 3D scene, `BlurMask`, `CustomCursor`.
- Journal system: `a5af98b` added journal detail pages with a cellular shader background; `243e0ef` added a journal template and excluded underscore-prefixed files (`_template.md`) from routing. One real entry so far: `reaction-diffusion-systems.md`.
- Info/Expertise page with bio, contact form, and skill marquee (`6e81e9b`).
- Homepage nav cleanup — removed the M-S dash and the Index link (`4f2b91f`).
- Three `technique_reference/` notes committed: `pointcloud_pipeline.md`, `email_forwarding.md`, `design_decisions.md`.

**Uncommitted on `main`:** the Info → Expertise rename, the new Contact route, and the `config.json` nav update (see Active Context).

## Files Modified (this session)

- `src/components/info/` → `src/components/expertise/` — directory and files renamed (`InfoPage.tsx` → `ExpertisePage.tsx`, `InfoUI.tsx` → `ExpertiseUI.tsx`, `info.module.css` → `expertise.module.css`).
- `src/pages/info/index.tsx` → `src/pages/expertise/index.tsx` — page route moved.
- `src/components/contact/` — new module (`ContactPage.tsx`, `ContactUI.tsx`, `contact.module.css`), extracted from the former Info page's contact form.
- `src/pages/contact/index.tsx` — new page route for the standalone Contact page.
- `content/data/config.json` — nav label `Info` → `Expertise` and URL `/info` → `/expertise` (both header and footer nav entries).
- `CLAUDE.md` — five workflow sections are now in the file (Session Continuity, Learning Loop, Planning, Verification, Context Management).
- `LESSONS.md` — added a lesson about legacy `content/pages/*.md` files shadowing explicit routes.
- `STATUS.md` — this file, brought in line with the expertise/contact split.

## Key Decisions

- **Contact pulled out of Expertise into its own route.** Each page now has one clear job, and the Contact section is reachable from the header without mid-page scrolling.
- **Naming: "Expertise" instead of "Info".** Matches the nav label users see; removes the Stackbit-era "Info" term.
- Deploy target is Vercel. `netlify.toml` and Stackbit annotations are legacy and intentionally left alone.

## Next Steps

- [ ] Commit the expertise rename + contact split + `config.json` nav update (currently uncommitted on `main`). Verify with `npm run build` first.
- [ ] Wire up the Contact form so submissions actually go somewhere (email, Formspree, or a simple API route).
- [ ] Add more journal entries using `content/pages/journal/_template.md` as the starting point.
- [ ] Confirm the Session Continuity loop works end-to-end on the next real task.

## Active Context
<!-- This section tracks anything Claude needs to know to pick up where we left off.
     Could be: a tricky bug being debugged, an architectural choice being evaluated,
     a dependency issue, or a feature half-built. -->

**Uncommitted expertise/contact split:**

Staged changes touching:

- `src/components/expertise/` (renamed from `info/`, files renamed inside)
- `src/components/contact/` (new)
- `src/pages/expertise/index.tsx` (moved from `src/pages/info/`)
- `src/pages/contact/index.tsx` (new)
- `content/data/config.json` (nav label + URL)
- `CLAUDE.md` (workflow sections)

Before committing: run `npm run build` to catch any stale import paths from the rename, then `npm run dev` and browse `/expertise` and `/contact` to confirm both render cleanly and the header nav routes correctly.

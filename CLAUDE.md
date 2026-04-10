# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Site Purpose

This is **mindless-scribbles.com** — a Next.js playground for experiments, blog posts, and interactive demos. It is NOT the dondecastro.com professional portfolio (that lives in `dondecastro-demoreel/` as reference material for a separate Astro repo).

## Commands

- **Dev server:** `npm run dev` (Next.js dev server)
- **Build:** `npm run build`
- **Lint:** `npx eslint .` (extends `next/core-web-vitals`, `@next/next/no-img-element` is off)
- **Format:** `npx prettier --write .` (config in `.prettierrc`)
- **Deploy target:** Vercel — connect `mindless-scribbles/mindless-scribbles-portfolio` on vercel.com

There are no tests configured in this project.

Note: `netlify.toml` and the Stackbit visual editor are leftover from the original template. They are not used — deploy target is Vercel.

## Architecture

This is a Next.js (Pages Router) site using Tailwind CSS v4 and the Netlify/Stackbit visual editor. All pages are statically generated.

### Content System

Content lives in **`content/`** as Markdown (with YAML frontmatter) and JSON files:
- `content/pages/` — page content (blog posts, projects, info, index). URL paths are derived from file paths relative to `content/pages/`.
- `content/data/` — global data: site config (`config.json`), theme style (`style.json`), team members.

Content is loaded at build time by `src/utils/content.ts`: it reads all files, parses frontmatter/JSON, resolves cross-file references using model definitions, and injects Stackbit annotation attributes (dev mode only).

### Routing & Page Rendering

A single catch-all route (`src/pages/[...slug].tsx`) handles all pages:
1. `getStaticPaths` — enumerates all content objects with URL paths
2. `getStaticProps` — loads all content, finds the page matching the URL, enriches it via `src/utils/static-props-resolvers.ts` (adds related posts/projects to feeds), and attaches global props (site config + theme)
3. The page renders via `DynamicComponent`, which resolves the component by the content object's `type` field

### Component System

`src/components/components-registry.tsx` maps content `type` strings to dynamically imported React components. Each component is automatically wrapped with `<Annotated>` for visual editor support. Components are organized as:
- `layouts/` — page-level layouts (PageLayout, PostLayout, ProjectLayout, feed layouts)
- `sections/` — page sections (Hero, CTA, Contact, Text, etc.)
- `molecules/` — composite blocks (ImageBlock, VideoBlock, FormBlock with form controls)
- `atoms/` — primitives (Action/button, Link, Social icon, BackgroundImage)
- `svgs/` — icon components

### Content Models (Stackbit)

`.stackbit/models/` defines the content schema — field types, reference relationships, and model names. These drive both the visual editor UI and the reference resolution in `content.ts`. `stackbit.config.ts` wires everything together.

### Type System

`src/types/generated.ts` contains TypeScript types derived from the Stackbit models. `src/types/base.ts` has base content types (`ContentObject`, metadata attributes). Path alias `@/*` maps to `./src/*`.

### Styling

Tailwind CSS v4 with `@tailwindcss/postcss`. Main stylesheet at `src/css/main.css`. Theme style values from `content/data/style.json` are mapped to CSS class names via `src/utils/map-styles-to-class-names.ts` and `src/utils/theme-style-utils.ts`.

## Technique Reference

`technique_reference/` contains workflow notes, pipeline guides, and tips accumulated during development. Check here before asking how to do something — it may already be documented.

Current entries:
- `pointcloud_pipeline.md` — Maya/scan → PLY/PCD → Three.js web pipeline

## dondecastro.com

Reference material for the separate `dondecastro-demoreel` Astro repo lives in `dondecastro-demoreel/`. Do not edit those files here — they are for use in a separate repository.

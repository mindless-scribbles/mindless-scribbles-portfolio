# LESSONS.md

Project-specific lessons learned across sessions. Read at session start. Update after any correction or mistake.

## Rules
<!-- Each rule should be concrete and actionable. Format:
     **[Short label]:** What to do (or not do), and why. -->

**No test suite — verify with build, lint, and browser:**
This repo has no automated tests. "Done" means `npm run build` succeeds, `npx eslint .` is clean for files you touched, and for any UI/visual change you started `npm run dev` and looked at it in a browser. Do not invent a test framework or write tests unless asked — it's a static playground, not a tested codebase.

**Netlify and Stackbit files are legacy — ignore them:**
`netlify.toml` and the Stackbit visual-editor annotations are leftover from the original template. Deploy target is Vercel. Don't "fix" or modernize the Netlify/Stackbit remnants unless the user explicitly asks.

**Check `technique_reference/` before inventing a workflow:**
The repo has a `technique_reference/` directory with workflow notes (pointcloud pipeline, email forwarding, design decisions). If a task smells like something that's been done before in this repo, skim those files first rather than reinventing the approach.

**Legacy `content/pages/*.md` can shadow explicit `src/pages/*` routes:**
The catch-all `src/pages/[...slug].tsx` enumerates every Markdown file under `content/pages/` as a static path. If you add an explicit route like `src/pages/expertise/index.tsx` while a matching `content/pages/expertise.md` still exists, `next build` fails with a path-conflict error. Before creating a new top-level route, check `content/pages/` for a file that would produce the same URL and delete or rename it. Learned when shipping the original `/info` page — `content/pages/info.md` had to be removed before the build would pass.

<!-- Example of a good lesson:
**Never modify the config loader without running integration tests:**
Unit tests pass but the config loader has side effects on the database
connection pool. Always run `npm run test:integration` after changes
to src/config/. Learned 2026-04-10 when a config refactor broke
staging for 2 hours. -->

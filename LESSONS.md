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

**Don't commit scaffolding for a separate project into this repo:**
`dondecastro-demoreel/` was scaffolded as a subfolder here (`a-different-project/` inside the portfolio repo), which conflated two unrelated sites' histories. Kept this way, every commit to either project would mix into the portfolio's `main`. If a folder represents a separate deployable project (different domain, different stack, different deploy target), it gets its own repo from day one — scaffold it as a sibling in `~/workspace/github.com/<org>/<project>/` with its own `git init`, not as a subfolder of an existing repo. Learned 2026-04-12 when extracting `dondecastro-demoreel/` (destined for `dondecastro.com` on Astro + Netlify) out into its own repo.

**Verify framework APIs before coding — training data lags reality:**
Tailwind CSS v4 and Next.js (Pages Router) APIs shift between versions, and the session-start hook explicitly warns that LLM knowledge of them is outdated. Before using an unfamiliar Tailwind v4 directive/utility, a Next.js config option, or any library API you're not certain of, check the installed version (`package.json`) or official docs rather than writing from memory — a 30-second check beats a silently-wrong build. (Adapted from the `unreal-python` template's "inspect before you code" rule.)

**Don't run `npm run build` while `npm run dev` is live:**
A production `build` cleans and rewrites `.next`, deleting the dev server's compiled pages mid-run. The dev server then 500s with `ENOENT: .next/server/pages/index.js` and the page renders all white. If it happens: stop the dev server, `rm -rf .next`, and restart `npm run dev`. To verify a build without breaking dev, stop the dev server first (or build in a separate checkout). Learned 2026-05-30 after a build-during-dev wiped the running server's artifacts.

**"No animation on hover" was `prefers-reduced-motion`, not a bug — and you can verify hover JS headlessly:**
The hero glitch effect appeared broken ("no visible change on hover") for a whole session. Root cause: the browser reported `prefers-reduced-motion: reduce` (common on Windows/WSL when "Show animations" is off or Battery Saver is on), and `triggerGlitch` correctly early-returns in that case. Before assuming a motion/hover effect is broken, check reduced-motion first. To verify per-tab without touching OS settings: DevTools → Cmd/Ctrl+Shift+P → "Show Rendering" → "Emulate CSS media feature prefers-reduced-motion" → `no-preference`. To debug hover/JS behavior that `curl` can't see (this site is client-rendered — empty `#__next` in SSR), drive the system Chrome via the DevTools Protocol from Node 22 (global `WebSocket`, no deps): launch `google-chrome-stable --headless=new --remote-debugging-port`, attach over CDP, `Input.dispatchMouseEvent` a real `mouseMoved` over the element, then read back the mutated attribute/computed style. Confirmed the state machine + CSS were correct this way. Learned 2026-06-18.

**`npx eslint .` does not work — use `tsc` for verification:**
The repo has no `lint` script in `package.json` and ESLint v9 is installed without a flat `eslint.config.js`, so the `npx eslint .` documented in CLAUDE.md fails with "couldn't find an eslint.config file." Don't burn time trying to make it run. For verification use `npx tsc --noEmit` (type-checks clean) plus the dev-server compile + browser check. If lint is actually wanted, that's a separate setup task (add a flat config or `next lint`). Learned 2026-06-16.

<!-- Example of a good lesson:
**Never modify the config loader without running integration tests:**
Unit tests pass but the config loader has side effects on the database
connection pool. Always run `npm run test:integration` after changes
to src/config/. Learned 2026-04-10 when a config refactor broke
staging for 2 hours. -->

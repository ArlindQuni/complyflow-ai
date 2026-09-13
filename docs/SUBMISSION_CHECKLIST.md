# ComplyFlow AI — submission checklist

Deadline-oriented list of what remains outside the repository. Update the status boxes as each item
completes.

## Done

- [x] **App deployed and reachable** — https://complyflow-copilot.lovable.app (judge walkthrough at
      https://complyflow-copilot.lovable.app/judge-demo)
- [x] **Devpost project shell created** — project exists on the AI Builders Hackathon 2026 page
- [x] **Submission copy drafted in repo** — `docs/DEVPOST_SUBMISSION.md`
- [x] **Demo video script drafted** — `docs/DEMO_VIDEO_SCRIPT.md`
- [x] **Pitch deck content drafted** — `docs/PITCH_DECK_CONTENT.md`

## 1. Public GitHub repository

- [ ] Connect GitHub from Lovable project settings and push the repo
- [ ] Set visibility to public
- [ ] Confirm `README.md`, `docs/` and `.env.example` are present and no secrets are committed
- [ ] Check out a fresh clone and run `npm install && npm run build` to confirm it builds standalone
- [ ] Paste the repo URL into the Devpost "Try it out" / repository field

## 2. Devpost fields

- [ ] Project name and tagline from `docs/DEVPOST_SUBMISSION.md`
- [ ] Full description sections (Inspiration, What it does, How we built it, Challenges,
      Accomplishments, What we learned, What's next)
- [ ] Built-with tags: TypeScript, React, TanStack Start, Vite, Tailwind CSS, shadcn/ui, Zod, Gemini
- [ ] Links: live app, `/judge-demo`, GitHub repo, video, deck
- [ ] Upload 3–5 screenshots (dashboard, analysis detail with evidence highlighted, risk panel,
      tasks view, how-it-works pipeline)
- [ ] Thumbnail image set
- [ ] Category / track selected

## 3. Demo video

- [ ] Record following `docs/DEMO_VIDEO_SCRIPT.md` (target 3:30, hard cap 4:00)
- [ ] Reset the demo workspace before recording; 1920×1080, clean browser chrome
- [ ] Check audio levels and that on-screen text is legible at 720p
- [ ] Upload to YouTube or Vimeo as **public or unlisted** (not private)
- [ ] Paste the video URL into Devpost and verify it plays in an incognito window

## 4. Pitch deck

- [ ] Build the 9 slides from `docs/PITCH_DECK_CONTENT.md`
- [ ] Capture the screenshots each slide calls for
- [ ] Export to PDF
- [ ] Upload to Devpost (or share a link with public view access) and verify the link opens logged out

## 5. Discord

- [ ] Join the hackathon Discord server
- [ ] Post an introduction in the designated channel
- [ ] Share the project in the showcase/submissions channel if one exists
- [ ] Check announcement channels for any judging-day instructions

## 6. Final QA

- [ ] Open the live app in a fresh incognito window: `/`, `/dashboard`, `/new`, `/analyses/...`,
      `/tasks`, `/how-it-works`, `/judge-demo` all load
- [ ] Run one live analysis and one **Run offline engine** analysis end to end
- [ ] Confirm obligation evidence highlights in the source text and no unsupported dates appear
- [ ] Confirm "Reset demo" restores the seeded workspace
- [ ] Check mobile width (375px) on the landing and analysis pages
- [ ] Re-read every submitted claim against `docs/DEVPOST_SUBMISSION.md` — no affiliation claims, no
      production metrics, no legal-advice framing
- [ ] Confirm all links use `complyflow-copilot.lovable.app`

## 7. Final submit

- [ ] Submit on Devpost **before the deadline** (submit early; edits are usually allowed afterwards)
- [ ] Screenshot the submission confirmation
- [ ] Re-open the public Devpost page logged out and verify every link works

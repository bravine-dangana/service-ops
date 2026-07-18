# Service Ops Platform (Next.js)

An interactive knowledge base of Cellulant's payment services — a home page of service cards,
each opening a roadmap.sh-style branching flow diagram with plain-language explanations per step.

## Getting started

Requires Node.js 18.18+ (LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `app/page.tsx` — home page, "Payment Flows" / "Platform & Infrastructure" grid
- `app/[service]/page.tsx` — roadmap page for a given service slug
- `data/services.ts` — all service + step content (edit this to update copy)
- `lib/roadmap-layout.ts` — turns a service's linear `steps` into a trunk + placeholder-branch
  node/edge graph for the diagram
- `components/roadmap/RoadmapCanvas.tsx` — renders the diagram (React Flow) + wires up progress
  tracking and the step detail panel
- `components/roadmap/RoadmapNode.tsx` — the yellow trunk / tan branch node visual
- `components/SidePanel.tsx` — step detail drawer (shared by all nodes)
- `hooks/useProgress.ts` — persists "reviewed" steps per service in `localStorage`

## Content status

Step explanations are marked `draft` until a subject-matter expert reviews them (see `status` on
each step in `data/services.ts`). The Checkout flow is written out in full as the working example.
The other four services list steps directly from the roadmap brief; wording should be reviewed by
each product team before flipping their `status` to `reviewed`.

Each trunk step also gets one placeholder "branch" node (dotted connector) in the diagram — these
are stand-ins for sub-topics that will be authored and rearranged from an admin page later, not
real content yet.

## Notes

- Built with Next.js (App Router) + TypeScript + Tailwind CSS + `reactflow` for the diagram canvas.
- Branded per Cellulant's official brandkit (cellulant.io/brandkit): Montserrat font, the brand
  palette (`cellulant.blue #009EDA`, `cellulant.navy #005BA0`, `cellulant.mustard #FFBE1A`,
  `cellulant.purple #7030A0`, `tingg.green #05E386`, `tingg.navy #294383` — see
  `tailwind.config.ts`), and a dark navy theme matching cellulant.io's site chrome. The roadmap
  diagram page itself is light-themed (white/yellow nodes) to match roadmap.sh's actual roadmap
  pages.
- The logo in the header/footer is currently a plain text wordmark (`components/site/Logo.tsx`) —
  swap in the real logo file once you have it downloaded into `/public`.
- No backend yet — progress tracking (which steps are "reviewed") is local to the browser. Node
  positions/content are static in `data/services.ts` — an admin page to edit them would write to a
  database and feed `RoadmapCanvas` from there instead.

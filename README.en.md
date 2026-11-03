# ATELIER SELECT

Stack: **React + TypeScript + Tailwind CSS**.
An independent bilingual automotive collection built with React 19, Vite and React Router. Includes a public collection and a browser-local inventory studio.

## Run

Requires Node.js 22 or a newer LTS release.

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

Collection: `/`. Inventory studio: `/admin.html`. Both HTML entry paths are included in the static build.

## Explore

Search inventory, filter by body style and budget, sort by price or year, save favorites and compare up to three vehicles. Open details and save a local inquiry. The studio supports vehicle creation, editing and available/reserved/sold statuses. Sold stock disappears from the collection. Inquiry handling records timestamps and locks closed records. CSV exports include only the current inquiry filter. The selling form produces an unsent preview. A fixed-payment calculator handles zero-interest and fully prepaid budgets.

## Scope

All vehicles, specifications and prices are fictional. Images are AI-generated illustrations. This is a frontend portfolio project with localStorage persistence, not a live dealership service. No authentication, remote database, payments, email or real booking. Studio access is not an authorization boundary. Use test contact information. Records stay in the current browser and cannot be shared across devices. Same-origin tabs synchronize changes. Clearing site data clears the local records.

14 tests cover domain rules and end-to-end component workflows. See [Architecture](docs/ARCHITECTURE.md) and [Review guide](docs/REVIEW_GUIDE.md).

Suggested repository: `atelier-motors`. Hosting configuration under `.openai/` belongs to the current demonstration Site; remove it for independent deployment to a different provider.

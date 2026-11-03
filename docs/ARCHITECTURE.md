# Architecture

## Boundaries

- `src/main.tsx`: React mount, router, error boundary, i18n provider.
- `src/App.tsx`: application entry.
- `src/features/dealer/DealerPage.tsx`: storefront orchestration, filters, comparison and local inquiry form.
- `src/features/dealer/Admin.tsx`: vehicle editor, inquiry history and CSV export UI.
- `src/features/dealer/components/`: budget calculator and selling-request preview.
- `src/features/dealer/useDealer.ts`: shared persistence and commands for both routes.
- `src/features/dealer/domain/inventory.ts`: filtering, normalization, validation, inquiry snapshots and allowed transitions. No React or browser storage dependencies.
- `src/features/dealer/domain/loan.ts`: amortization formula and input checks.
- `src/shared/hooks/useStoredState.ts`: localStorage writes, error state and same-origin tab synchronization.
- `src/shared/lib/`: ID generation, CSV formula neutralization, formatting and storage adapter.
- `src/shared/i18n/`: translation dictionary and URL-aware language preference.
- `tests/`: business rules and component workflows.

## Data flow

The storefront and studio instantiate the same `useDealer` hook and use isolated `atelier-*` storage keys. `useStoredState` dispatches a local event after successful writes and listens to browser storage events across tabs. Storage write failures return false and show feedback; callers do not report a successful save.

Inquiry creation validates that the selected vehicle still exists and is not sold. It snapshots the name and price so later inventory edits do not rewrite the original inquiry. Inquiry transitions append timestamped history. New records may move to contacted or closed; contacted may move to closed; closed is terminal.

Vehicle validation converts numeric form values, requires positive finite prices, plausible integer years and nonnegative integer mileage, and restricts status, body style and illustrative-image keys. A sold vehicle is hidden from inventory search and inquiry selectors, while existing inquiry snapshots remain available.

Record IDs use randomUUID where available and random bytes from getRandomValues otherwise, supporting HTTP previews. IDs are local record identifiers and confer no permissions.

## Production extension

Replace storage commands with a server repository, move validation and status transitions behind authenticated endpoints, and use transactional writes before accepting concurrent staff edits. Add consent/retention rules before collecting real contact data. Preserve the inquiry snapshot and activity history contracts. A public production studio requires server-enforced authorization; a hidden URL is insufficient.

The current localStorage implementation is appropriate for a portfolio showcase; it is not a transactional multiuser database. Simultaneous edits in multiple tabs may overwrite each other.

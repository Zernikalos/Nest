# V2 Migration - Feature Freeze

## Purpose

During the IDE V2 separation migration, non-critical editor features are frozen to avoid dual implementations and migration drift.

## Frozen (do not implement until migration completes)

- New editor widgets beyond the first vertical (tree + selection + tabs + document)
- Major refactors of existing editor UI components
- New keyboard shortcuts or menu items that affect editor behavior
- Changes to project/open/save flow that bypass runtime contracts

## Allowed

- Bug fixes in existing editor behavior
- Styling and accessibility improvements
- Migration-related work (extracting logic to ide-core, wiring adapters)
- Non-editor pages (projects list, devices, settings, exporter)

## Exit

Freeze lifts when Phase 2 (First Vertical Slice) exit criteria are met:

- No canonical tree/selection/tab logic remains in React hooks
- Vertical works end-to-end in app

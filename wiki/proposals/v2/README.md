# IDE V2 North Star (Proposals)

## Purpose

This folder defines the V2 "polar star" for Zernikalos Studio editor architecture.

The target is a framework-agnostic IDE runtime where React, Vue, or Svelte are only rendering adapters.

## Documents

- `north-star.md`: vision, principles, and final shape
- `architecture-target.md`: technical target architecture and contracts
- `migration-roadmap.md`: disruptive migration plan with milestones
- `migration-to-monolitic.md`: proposal to flatten most package sources into root-level applications/config folders while keeping `reactui` isolated for now
- `adr-non-negotiables.md`: architecture decisions that should not be diluted
- `freeze-features.md`: feature freeze during migration
- `move-zernikalos-domain-to-ide-core.md`: proposal for moving editor domain orchestration out of the UI and into the runtime

## Scope

This is not an incremental cleanup proposal.
This is a directional V2 architecture to steer major decisions and avoid long-term lock-in.

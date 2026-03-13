# V3 Proposal: Frontend–Backend Boundary (Services and RPC)

## Status

Draft. Complements `architecture-improvements.md` by defining how the renderer (Vue) and the backend (Electron main process, Nest server) relate.

## Context

Today the frontend (Vue) talks to the backend in an ad-hoc way:

- Some operations go through **ports** whose implementations call HTTP (Nest) or IPC (Electron) — e.g. `ProjectPort`, `AssetConversionPort`, `EngineSessionPort`. The runtime does not know it’s RPC; it just calls the port.
- Other operations may use Vue composables or direct HTTP/IPC from components. There is no single, explicit “service layer” that represents “backend capabilities” as injectable frontend services.

In platforms like Theia, the **frontend and backend are two processes**, each with its own DI container. They communicate over **JSON-RPC** (over WebSockets or HTTP). Backend services are exposed via RPC; the frontend has **proxy** objects that implement the same interface and forward calls over the wire. So “the thing that relates frontend and backend” is not a contribution or a widget — it is the **RPC channel** plus **services**: one implementation in the backend, one proxy in the frontend.

This proposal clarifies that boundary and suggests a cleaner service-based split.

## 1. What Relates Frontend and Backend

- **Not contributions:** A contribution is an extension point (e.g. CommandContribution, WidgetContribution). Contributions live in one process: either they are bound in the frontend container or in the backend container. There is no “contribution that is both frontend and backend”; there are two separate contributions (or services) that work together.
- **Not widgets:** Widgets are UI; they live in the frontend (or in the runtime as descriptors, with the view in the frontend). A widget may *use* a service that is implemented in the backend and consumed via a frontend proxy, but the widget itself does not span both processes.
- **Services over RPC:** The relation is: **backend exposes a service** (e.g. project API, file system, asset conversion). The **frontend** has a **proxy** that implements the same interface and sends RPC calls. The runtime (or Vue) injects the proxy and uses it; it does not care that the implementation is remote. So the “glue” is: (1) the RPC layer (transport + protocol), (2) the service interface (shared or mirrored), (3) the backend implementation, (4) the frontend proxy.

## 2. Current vs Proposed Mental Model

**Current:**

- Ports are the abstraction the runtime uses. Implementations live in the host (Vue/Electron); they call HTTP or IPC inside the implementation. This is already “service-like” (interface in core, implementation in adapter). The missing piece is a consistent, explicit “backend container + RPC + frontend proxy” story so that every backend capability is a service with one implementation (backend) and one proxy (frontend).

**Proposed:**

- **Backend (Electron main / Nest):** Runs in Node. Has its own DI container (optional but useful). Exposes **services** over a defined channel (e.g. JSON-RPC over IPC or HTTP). For example: `ProjectService`, `AssetConversionService`, `FileSystemService`. Each service is registered in the backend container and bound to an RPC handler.
- **Frontend (Vue / renderer):** Has its own DI container. Binds **proxies** that implement the same service interfaces and forward calls to the backend (IPC or HTTP). The runtime (or Vue) injects `ProjectPort`; the container resolves it to the proxy. So the runtime still depends on ports (interfaces); the adapter binds the port to a proxy that talks to the backend.
- **Single “contribution” that spans both:** There is none. A **feature** may have:
  - A **backend contribution** (or service) that implements the RPC handler and does the real work.
  - A **frontend contribution** or binding that registers the proxy for that service and possibly registers commands/widgets that use it.
  The two are separate classes in separate processes; they “meet” only at the RPC boundary.

## 3. Implications for ide-core and Ports

- **ide-core** continues to depend only on **port interfaces** (StoragePort, ProjectPort, AssetConversionPort, EngineSessionPort, etc.). It does not know about RPC or processes.
- **Port implementations** in the frontend can be:
  - **Local** (e.g. LocalStorageStoragePort) — no backend.
  - **Proxy** — implements the port interface and forwards to the backend via IPC/HTTP. The backend has the “real” implementation exposed as an RPC service.
- So the “frontend–backend boundary” is: **backend exposes services; frontend binds port interfaces to proxies that call those services.** No change to the port contracts; only a clearer rule for how proxy implementations are structured and how the backend is organized (one service per capability, exposed via RPC).

## 4. Optional: Backend DI Container

- If we introduce a backend DI container (e.g. in Electron main or in the Nest app), then:
  - Backend services are bound in that container.
  - RPC handlers are registered by a small bootstrap that iterates over “exported” services and creates JSON-RPC handlers (or REST endpoints) that delegate to the container-resolved implementation.
- This mirrors Theia: two containers, two processes, communication over RPC. Contributions on the backend (e.g. BackendApplicationContribution) can register additional RPC handlers or startup logic.

## 5. Summary

| Question | Answer |
|----------|--------|
| What relates frontend and backend? | **Services:** backend implementation + RPC + frontend proxy. Not contributions, not widgets. |
| Can a contribution be both frontend and backend? | No. A contribution is bound in one container (one process). A *feature* can have one contribution (or service) on each side that work together via RPC. |
| Where do widgets live? | Frontend (or runtime descriptor + frontend view). They may *use* services that are implemented in the backend and consumed via proxy. |
| What changes in ide-core? | Nothing in the port interfaces. Adapters (vueui, electronapp) would bind port implementations to proxies that call backend services over a defined RPC layer. |

This document defines the frontend–backend boundary so that when we add DI and contribution points (see `architecture-improvements.md`), we keep a clear rule: **extensibility and composition** are handled by contributions and the container; **cross-process communication** is handled by services and RPC, with ports in the frontend bound to proxies when the implementation lives in the backend.

# Tech Stack Overview for LLM

This document outlines the technical stack of the React UI project. It is specifically formatted for easy parsing by a Large Language Model (LLM).

## Core Framework & Build Tool

- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Package Manager**: pnpm

## Styling

- **CSS Framework**: Tailwind CSS v4
    - **Integration**: Via `@tailwindcss/vite` plugin.
    - **Configuration**: Primarily through `vite.config.ts` and `@import` / `@plugin` directives in the main CSS file. A `tailwind.config.js` will not be available for plugin configurations since we are on v4, it is deprecated.
- **Global Styles**: Located in `src/index.css`, which imports Tailwind's base styles, components, utilities, and plugins.

## UI Components

- **Component System**: shadcn/ui
    - **Configuration**: Managed by `components.json`.
    - **Component Location**: Components are added directly to the `src/components` directory.
    - **Utilities**: Core utilities for `shadcn/ui` (like `cn` for classname merging) are in `src/lib/utils.ts`.
    - **Import Alias**: The project uses a path alias `@` which points to the `src/` directory. This is configured in `tsconfig.json` and `vite.config.ts`.

## Routing

- **Library**: React Router DOM
- **Configuration**:
    - The router is created using `createBrowserRouter`.
    - The main router configuration is located in `src/main.tsx`.
    - The application is wrapped with `<RouterProvider>` in `src/main.tsx`.

## Data Fetching & State Management

- **Server State**: TanStack Query (React Query) v5
    - **Configuration**:
        - A `QueryClient` is instantiated in `src/main.tsx`.
        - The application is wrapped with `<QueryClientProvider>` in `src/main.tsx`.
        - Used for server state management (ProjectMetadata, AppSettings), caching, and background data fetching.
        - Queries and mutations are organized in `src/queries/` directory.
- **Local State**: Zustand
    - Used for local/client state only (project file paths, UI state, ZKO conversion state).
    - Stores are organized in `src/stores/` directory.
    - Stores contain only state and simple setters, no business logic.

**Hybrid Approach**: The application uses both Zustand (local) and React Query (server) for optimal state management.

## Icons

- **Library**: React Icons
- **Usage**: Import icons directly from the specific icon pack required (e.g., `react-icons/fa` for Font Awesome).

## Project Configuration Files

- `vite.config.ts`: Main configuration file for the Vite build tool, including plugins for React and Tailwind CSS, and the path alias setup.
- `tsconfig.json`: Single, unified TypeScript configuration for the entire project.
- `package.json`: Defines project metadata, scripts (`dev`, `build`, etc.), and dependencies managed by `pnpm`.
- `pnpm-lock.yaml`: The lockfile for `pnpm`.
- `index.html`: The main entry point for the Vite application.
- `.gitignore`: Standard file for ignoring `node_modules`, `dist`, `.env` files, etc.

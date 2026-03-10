# UI Theming Strategy

This document explains the theming mechanism for the application, designed for easy parsing by an LLM.

## Core Mechanism: CSS Variables

The entire theming system is built upon CSS Custom Properties (variables), consistent with the `shadcn/ui` methodology.

- **Central Configuration**: All theme variables are defined in `src/index.css`.
- **Live Theming**: Components use these variables via Tailwind's utility classes (e.g., `bg-background`, `text-primary`). Changes to the variables propagate instantly without a build step.

## Light & Dark Mode

The application supports both light and dark themes out-of-the-box.

- **Light Theme (Default)**: Color variables are defined within the `:root` selector. This is the default theme.
- **Dark Theme**: An alternative set of color variables is defined under the `.dark` class selector.
- **Theme Toggling**: To switch to dark mode, the `dark` class must be applied to the `<html>` element. Removing it reverts to the light theme.

Example from `src/index.css`:

```css
:root {
    --background: oklch(1 0 0); /* White */
    --foreground: oklch(0.13 0.028 261.692); /* Black */
    /* ... other light theme variables */
}

.dark {
    --background: oklch(0.13 0.028 261.692); /* Black */
    --foreground: oklch(0.985 0.002 247.839); /* White */
    /* ... other dark theme variables */
}
```

## Customization

- **How to Customize**: To alter the application's look and feel, modify the `oklch()` color values within the `:root` and `.dark` selectors in `src/index.css`.
- **Color Format**: `oklch()` is used for its perceptual uniformity and ability to define colors in a human-readable way (lightness, chroma, hue).
- **Radius**: Border radius for components is controlled by the `--radius` variable, also defined in `:root`.

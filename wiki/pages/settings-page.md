# Settings Page

> **Note**: This page has been significantly updated and expanded. For detailed documentation, see the [Settings Page Documentation](./settings-page/) folder.

## Overview

The Settings Page provides a comprehensive configuration interface for Zernikalos Studio. It has evolved from a simple settings page into a sophisticated modular system featuring nested routing, reusable components, and seamless theme integration.

## 📁 Documentation

All detailed documentation is located in the [settings-page](./settings-page/) folder:

- **[README](./settings-page/README.md)** - Complete overview and quick reference
- **[Overview](./settings-page/overview.md)** - Comprehensive system architecture
- **[Components Architecture](./settings-page/components-architecture.md)** - Detailed component hierarchy and usage
- **[Fields System](./settings-page/fields-system.md)** - Reusable field components and patterns
- **[Sections Guide](./settings-page/sections-guide.md)** - Existing sections and how to create new ones

## 🎯 Quick Reference

- **Main Component**: `src/pages/settings/SettingsPage.tsx`
- **Router Configuration**: `src/pages/settings/settingsRouter.tsx`
- **Current Sections**: General, Appearance
- **Route Pattern**: `/settings/[section-name]`

## Current Sections

- **General Settings** (`/settings/general`) - Application behavior and preferences
- **Appearance Settings** (`/settings/appearance`) - Theme and UI customization

For complete documentation, examples, and implementation guides, please refer to the [Settings Page Documentation](./settings-page/) folder.

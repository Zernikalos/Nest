/**
 * Maps workbench widget ids to Vue components for rendering.
 * Used by EditorLayout to render the correct component per area.
 */
import type { Component } from 'vue';
import SceneTree from '@/components/SceneTree.vue';

export const WIDGET_REGISTRY: Record<string, Component> = {
  'scene-tree': SceneTree,
};

export function getWidgetComponent(id: string): Component | undefined {
  return WIDGET_REGISTRY[id];
}

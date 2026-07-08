import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue';
import {
  APP_MENU_MANIFEST,
  activateMenuItem,
  isMenuItemEnabled,
  menuContextToKeys,
  resolveMenuManifest,
  MenuItemRole,
} from '@ide-core';
import type { ResolvedMenuGroup, ResolvedMenuItem } from '@ide-core';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';

export interface AppMenuBarContext {
  openGroupId: Ref<string | null>;
  isMenuOpen: ComputedRef<boolean>;
  resolvedMenu: ComputedRef<ResolvedMenuGroup[]>;
  onTriggerClick: (groupId: string) => void;
  onTriggerHover: (groupId: string) => void;
  closeMenuBar: () => void;
  isItemEnabled: (item: ResolvedMenuItem) => boolean;
  activateItem: (item: ResolvedMenuItem) => void;
}

export const APP_MENU_BAR_KEY: InjectionKey<AppMenuBarContext> = Symbol('appMenuBar');

export function useAppMenuBar(): AppMenuBarContext {
  const hostPort = inject<HostPort>(HOST_PORT_KEY);
  const editor = useEditorStore();
  const project = useEditorSlice('project');

  const openGroupId = ref<string | null>(null);
  const isMenuOpen = computed(() => openGroupId.value !== null);

  const resolvedMenu = computed(() =>
    resolveMenuManifest(
      APP_MENU_MANIFEST,
      menuContextToKeys({ projectOpen: project.value.isProjectOpen })
    )
  );

  function onTriggerClick(groupId: string): void {
    openGroupId.value = groupId;
  }

  /** Quasar-style: once a menu is open, hovering another top-level item switches content. */
  function onTriggerHover(groupId: string): void {
    if (openGroupId.value !== null) {
      openGroupId.value = groupId;
    }
  }

  function closeMenuBar(): void {
    openGroupId.value = null;
  }

  function isItemEnabled(item: ResolvedMenuItem): boolean {
    return isMenuItemEnabled(item);
  }

  function runEditRole(role: MenuItemRole): void {
    switch (role) {
      case MenuItemRole.Copy:
        document.execCommand('copy');
        break;
      case MenuItemRole.Cut:
        document.execCommand('cut');
        break;
      case MenuItemRole.Paste:
        document.execCommand('paste');
        break;
      case MenuItemRole.SelectAll:
        document.execCommand('selectAll');
        break;
      case MenuItemRole.Quit:
      case MenuItemRole.Close:
        hostPort?.closeWindow?.();
        break;
    }
  }

  function activateItem(item: ResolvedMenuItem): void {
    activateMenuItem(item, {
      executeCommand: (commandId, payload) => editor.executeCommand(commandId, payload),
      closeWindow: () => hostPort?.closeWindow?.(),
      runEditRole,
    });
    closeMenuBar();
  }

  return {
    openGroupId,
    isMenuOpen,
    resolvedMenu,
    onTriggerClick,
    onTriggerHover,
    closeMenuBar,
    isItemEnabled,
    activateItem,
  };
}

export function provideAppMenuBar(): AppMenuBarContext {
  const ctx = useAppMenuBar();
  provide(APP_MENU_BAR_KEY, ctx);
  return ctx;
}

export function useAppMenuBarContext(): AppMenuBarContext {
  const ctx = inject(APP_MENU_BAR_KEY);
  if (!ctx) {
    throw new Error('useAppMenuBarContext must be used within AppMenuBar');
  }
  return ctx;
}

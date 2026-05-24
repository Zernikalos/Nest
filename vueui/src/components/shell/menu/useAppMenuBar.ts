import { computed, inject, provide, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue';
import type { MenuItemDescriptor } from '@ide-core';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';

export interface AppMenuBarContext {
  openGroupId: Ref<string | null>;
  isMenuOpen: ComputedRef<boolean>;
  onTriggerClick: (groupId: string) => void;
  onTriggerHover: (groupId: string) => void;
  closeMenuBar: () => void;
  isItemEnabled: (item: MenuItemDescriptor) => boolean;
  activateItem: (item: MenuItemDescriptor) => void;
}

export const APP_MENU_BAR_KEY: InjectionKey<AppMenuBarContext> = Symbol('appMenuBar');

export function useAppMenuBar(): AppMenuBarContext {
  const hostPort = inject<HostPort>(HOST_PORT_KEY);
  const editor = useEditorStore();
  useEditorSlice('project');

  const openGroupId = ref<string | null>(null);
  const isMenuOpen = computed(() => openGroupId.value !== null);

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

  function isItemEnabled(item: MenuItemDescriptor): boolean {
    if (item.type === 'separator') return false;
    if (!item.when) return true;
    return editor.evaluateContext(item.when);
  }

  function runEditRole(role: NonNullable<MenuItemDescriptor['role']>): void {
    switch (role) {
      case 'copy':
        document.execCommand('copy');
        break;
      case 'cut':
        document.execCommand('cut');
        break;
      case 'paste':
        document.execCommand('paste');
        break;
      case 'selectAll':
        document.execCommand('selectAll');
        break;
      case 'quit':
      case 'close':
        hostPort?.closeWindow?.();
        break;
    }
  }

  function activateItem(item: MenuItemDescriptor): void {
    if (item.type === 'separator' || !isItemEnabled(item)) return;

    if (
      item.role &&
      ['copy', 'cut', 'paste', 'selectAll', 'quit', 'close'].includes(item.role)
    ) {
      runEditRole(item.role);
      closeMenuBar();
      return;
    }

    if (!item.commandId) return;

    const payload = item.commandPayload ?? undefined;
    editor.executeCommand(item.commandId, payload);
    closeMenuBar();
  }

  return {
    openGroupId,
    isMenuOpen,
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

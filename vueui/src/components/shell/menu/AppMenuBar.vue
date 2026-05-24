<script setup lang="ts">
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { APP_MENU_MANIFEST } from '@ide-core';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
} from 'radix-vue';
import AppMenuItemNode from './AppMenuItemNode.vue';
import { provideAppMenuBar } from './useAppMenuBar';
import { useMenuAnchorPosition } from './useMenuAnchorPosition';
import { menuContentClass, menuTriggerClass } from './menuStyles';
import { cn } from '@/lib/utils';

defineOptions({ name: 'AppMenuBar' });

const { openGroupId, isMenuOpen, onTriggerClick, onTriggerHover, closeMenuBar } =
  provideAppMenuBar();

const menuBarRef = ref<HTMLElement | null>(null);
const menuPanelRef = ref<HTMLElement | null>(null);
const triggerRefs = ref(new Map<string, HTMLElement>());

function setTriggerRef(groupId: string, el: unknown): void {
  if (el instanceof HTMLElement) {
    triggerRefs.value.set(groupId, el);
  } else {
    triggerRefs.value.delete(groupId);
  }
}

const { anchorStyle, updateAnchorPosition } = useMenuAnchorPosition(openGroupId, triggerRefs);

const activeGroup = computed(() =>
  APP_MENU_MANIFEST.find((g) => g.id === openGroupId.value) ?? null
);

function onRootOpenChange(open: boolean): void {
  if (!open) closeMenuBar();
}

function onTriggerMouseEnter(groupId: string): void {
  onTriggerHover(groupId);
  if (openGroupId.value === groupId) {
    updateAnchorPosition();
  }
}

onClickOutside(
  menuBarRef,
  () => {
    if (isMenuOpen.value) closeMenuBar();
  },
  { ignore: [menuPanelRef] }
);
</script>

<template>
  <div ref="menuBarRef" class="app-menu-bar-root flex items-stretch">
    <nav class="app-menu-bar flex items-stretch" aria-label="Application menu">
      <button
        v-for="group in APP_MENU_MANIFEST"
        :key="group.id"
        :ref="(el) => setTriggerRef(group.id, el)"
        type="button"
        :class="
          cn(
            menuTriggerClass,
            openGroupId === group.id && 'bg-base-300'
          )
        "
        :aria-expanded="openGroupId === group.id"
        @click="onTriggerClick(group.id)"
        @mouseenter="onTriggerMouseEnter(group.id)"
      >
        {{ group.label }}
      </button>
    </nav>

    <!-- Single shared menu (Quasar QMenu pattern): one panel, anchor moves to active trigger -->
    <DropdownMenuRoot
      :open="isMenuOpen"
      :modal="false"
      @update:open="onRootOpenChange"
    >
      <DropdownMenuTrigger as-child>
        <div
          :style="anchorStyle"
          aria-hidden="true"
          tabindex="-1"
        />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          ref="menuPanelRef"
          :class="menuContentClass"
          :side-offset="4"
          @pointer-down-outside="closeMenuBar"
          @escape-key-down="closeMenuBar"
        >
          <template v-if="activeGroup">
            <AppMenuItemNode
              v-for="item in activeGroup.items"
              :key="item.id"
              :item="item"
            />
          </template>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>
</template>

<style scoped>
.app-menu-bar {
  -webkit-app-region: no-drag;
}
</style>

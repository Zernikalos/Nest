<script setup lang="ts">
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from 'radix-vue';
import type { ResolvedMenuItem } from '@ide-core';
import { hasMenuItemSubmenuChildren, isMenuItemSeparator } from '@ide-core';
import { useAppMenuBarContext } from './useAppMenuBar';
import {
  menuItemClass,
  menuSeparatorClass,
  menuSubContentClass,
  menuSubTriggerClass,
} from './menuStyles';

defineOptions({ name: 'AppMenuItemNode' });

defineProps<{
  item: ResolvedMenuItem;
}>();

const { isItemEnabled, activateItem } = useAppMenuBarContext();
</script>

<template>
  <DropdownMenuSeparator v-if="isMenuItemSeparator(item)" :class="menuSeparatorClass" />
  <DropdownMenuSub v-else-if="hasMenuItemSubmenuChildren(item)">
    <DropdownMenuSubTrigger
      :disabled="!isItemEnabled(item)"
      :class="menuSubTriggerClass"
    >
      {{ item.label }}
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent :class="menuSubContentClass" :side-offset="8">
        <AppMenuItemNode
          v-for="sub in item.children"
          :key="sub.id"
          :item="sub"
        />
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
  <DropdownMenuItem
    v-else
    :disabled="!isItemEnabled(item)"
    :class="menuItemClass"
    @select="activateItem(item)"
  >
    {{ item.label }}
  </DropdownMenuItem>
</template>

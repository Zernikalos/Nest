<script setup lang="ts">
defineOptions({ name: 'EditorTabBarActions' });
import { computed, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'radix-vue';
import {
  ChevronDown,
  MoreVertical,
  LayoutGrid,
  Code2,
  Eye,
} from '@lucide/vue';
import Tooltip from '@/components/ui/Tooltip.vue';
import ObjectTypeIcon from '@/components/editor/ObjectTypeIcon.vue';
import { useNestEditor } from '@/composables/useNestEditor';
import { cn } from '@/lib/utils';

const route = useRoute();
const editor = useNestEditor();

const openedNodes = computed(() => editor?.openedNodes?.value ?? []);
const activeNode = computed(() => editor?.activeNode?.value ?? null);

const activeView = computed(() => {
  const path = route.path;
  if (path.includes('/editor/code')) return 'code';
  if (path.includes('/editor/viewer')) return 'viewer';
  return 'form';
});

const editorsMenuOpen = ref(false);
const moreMenuOpen = ref(false);

const viewModes = [
  { id: 'form' as const, to: '/editor/form', label: 'Form', icon: LayoutGrid },
  { id: 'code' as const, to: '/editor/code', label: 'Code', icon: Code2 },
  { id: 'viewer' as const, to: '/editor/viewer', label: 'Viewer', icon: Eye },
];

function onSelectNode(nodeId: string) {
  editor?.handleTabChange(nodeId);
  editorsMenuOpen.value = false;
}

function iconTypeFor(node: { iconType?: string }): string {
  return node.iconType ?? '';
}
</script>

<template>
  <div
    class="editor-tab-bar-actions flex h-9 flex-shrink-0 items-center border-l border-base-300 bg-transparent px-0.5"
    aria-label="Editor tab bar actions"
  >
    <!-- Open editors dropdown -->
    <DropdownMenuRoot v-model:open="editorsMenuOpen">
      <DropdownMenuTrigger as-child>
        <button
          type="button"
          class="tab-bar-action-btn"
          :disabled="openedNodes.length === 0"
          :aria-label="openedNodes.length > 0 ? 'Show opened objects' : 'No opened objects'"
        >
          <ChevronDown :size="14" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          class="z-50 min-w-[180px] rounded-md border border-base-300 bg-base-100 p-1 shadow-lg"
          align="end"
          :side-offset="4"
        >
          <template v-if="openedNodes.length > 0">
            <DropdownMenuItem
              v-for="node in openedNodes"
              :key="node.id"
              class="flex items-center gap-2 rounded px-2 py-1.5 text-xs cursor-pointer outline-none hover:bg-base-200 focus:bg-base-200"
              :class="activeNode === node.id && 'bg-base-200 text-base-foreground'"
              @select="onSelectNode(node.id)"
            >
              <ObjectTypeIcon :type="iconTypeFor(node)" :size="14" />
              <span class="truncate">{{ node.label }}</span>
            </DropdownMenuItem>
          </template>
          <p v-else class="px-2 py-1.5 text-xs text-muted-foreground">No opened objects</p>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>

    <span class="mx-0.5 h-4 w-px bg-base-300 flex-shrink-0" aria-hidden />

    <!-- View mode toggles -->
    <Tooltip v-for="mode in viewModes" :key="mode.id" side="bottom">
      <template #trigger>
        <RouterLink
          :to="mode.to"
          :class="cn(
            'tab-bar-action-btn',
            activeView === mode.id && 'tab-bar-action-btn--active'
          )"
          :aria-label="mode.label"
          :aria-current="activeView === mode.id ? 'page' : undefined"
        >
          <component :is="mode.icon" :size="14" />
        </RouterLink>
      </template>
      <template #default>
        <p>{{ mode.label }}</p>
      </template>
    </Tooltip>

    <span class="mx-0.5 h-4 w-px bg-base-300 flex-shrink-0" aria-hidden />

    <!-- More actions -->
    <DropdownMenuRoot v-model:open="moreMenuOpen">
      <DropdownMenuTrigger as-child>
        <button type="button" class="tab-bar-action-btn" aria-label="More actions">
          <MoreVertical :size="14" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          class="z-50 min-w-[160px] rounded-md border border-base-300 bg-base-100 p-1 shadow-lg"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuItem
            class="rounded px-2 py-1.5 text-xs text-muted-foreground cursor-default outline-none"
            disabled
          >
            More actions coming soon
          </DropdownMenuItem>
          <DropdownMenuSeparator class="my-1 h-px bg-base-300" />
          <DropdownMenuItem
            v-for="mode in viewModes"
            :key="`more-${mode.id}`"
            class="rounded px-2 py-1.5 text-xs cursor-pointer outline-none hover:bg-base-200 focus:bg-base-200"
            @select="moreMenuOpen = false"
          >
            <RouterLink :to="mode.to" class="block w-full">
              {{ mode.label }}
            </RouterLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>
</template>

<style scoped>
.tab-bar-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.25rem;
  color: var(--muted-foreground, hsl(var(--muted-foreground)));
  transition: background-color 150ms, color 150ms;
}
.tab-bar-action-btn:hover:not(:disabled) {
  background: hsl(var(--base-300) / 0.6);
  color: hsl(var(--base-foreground));
}
.tab-bar-action-btn:disabled {
  opacity: 0.35;
  cursor: default;
}
.tab-bar-action-btn--active {
  background: hsl(var(--base-300) / 0.8);
  color: hsl(var(--base-foreground));
}
</style>

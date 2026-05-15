<script setup lang="ts">
defineOptions({ name: 'OpenNodesTabBar' });
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useIdeCore } from '@/composables/useIdeCore';
import ObjectTypeIcon from '@/components/editor/ObjectTypeIcon.vue';
import EditorTabBarActions from '@/components/editor/EditorTabBarActions.vue';
import { cn } from '@/lib/utils';
import {
  saveEditorTabBarScrollLeft,
  restoreEditorTabBarScroll,
} from '@/composables/useEditorTabBarScroll';

const { viewModel, handleTabChange, handleTabClose } = useIdeCore();

const tabsScrollEl = ref<HTMLElement | null>(null);
const thumbWidthPx = ref(0);
const thumbOffsetPx = ref(0);
const hasOverflow = ref(false);

let resizeObserver: ResizeObserver | null = null;

const openedNodes = computed(() => viewModel.value.openedNodes);
const activeNode = computed(() => viewModel.value.activeNode);

function syncThumb() {
  const el = tabsScrollEl.value;
  if (!el) return;

  const { scrollWidth, clientWidth, scrollLeft } = el;
  const overflow = scrollWidth > clientWidth + 1;
  hasOverflow.value = overflow;

  if (!overflow) {
    thumbWidthPx.value = 0;
    thumbOffsetPx.value = 0;
    return;
  }

  const trackWidth = clientWidth;
  thumbWidthPx.value = Math.max(16, (clientWidth / scrollWidth) * trackWidth);

  const maxScroll = scrollWidth - clientWidth;
  const maxThumbOffset = trackWidth - thumbWidthPx.value;
  thumbOffsetPx.value = maxScroll > 0 ? (scrollLeft / maxScroll) * maxThumbOffset : 0;
}

function persistScroll() {
  const el = tabsScrollEl.value;
  if (el) saveEditorTabBarScrollLeft(el.scrollLeft);
}

function onTabsScroll() {
  syncThumb();
  persistScroll();
}

const thumbStyle = computed(() => ({
  width: `${thumbWidthPx.value}px`,
  transform: `translateX(${thumbOffsetPx.value}px)`,
}));

/** Scroll tabs horizontally with the mouse wheel; TabBarActions stays fixed on the right. */
function onTabsWheel(e: WheelEvent) {
  const el = tabsScrollEl.value;
  if (!el || el.scrollWidth <= el.clientWidth) return;
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  el.scrollLeft += e.deltaY;
  persistScroll();
  syncThumb();
}

watch(openedNodes, () => nextTick(syncThumb), { deep: true });

onMounted(() => {
  nextTick(() => {
    restoreEditorTabBarScroll(tabsScrollEl.value);
    syncThumb();
    const el = tabsScrollEl.value;
    if (!el) return;

    resizeObserver = new ResizeObserver(() => syncThumb());
    resizeObserver.observe(el);
    const inner = el.firstElementChild;
    if (inner) resizeObserver.observe(inner);
  });
});

onBeforeUnmount(() => {
  persistScroll();
  resizeObserver?.disconnect();
  resizeObserver = null;
});

function onTabClick(nodeId: string) {
  handleTabChange(nodeId);
}

function onClose(e: Event, nodeId: string) {
  e.stopPropagation();
  handleTabClose(nodeId);
}

function iconTypeFor(node: { iconType?: string }): string {
  return node.iconType ?? '';
}
</script>

<template>
  <div
    class="open-nodes-tab-bar flex h-9 flex-shrink-0 border-b border-base-300 bg-base-200/80"
    role="tablist"
    aria-label="Open objects"
  >
    <div class="open-nodes-tab-bar__tabs-wrap min-w-0 flex-1">
      <div
        ref="tabsScrollEl"
        class="open-nodes-tab-bar__tabs h-9"
        @scroll="onTabsScroll"
        @wheel="onTabsWheel"
      >
        <div class="open-nodes-tab-bar__tabs-inner flex h-9 w-max min-w-full items-stretch">
          <div
            v-for="node in openedNodes"
            :key="node.id"
            role="tab"
            tabindex="0"
            :aria-selected="activeNode === node.id"
            :class="cn(
              'open-node-tab group relative inline-flex h-9 max-w-[180px] flex-shrink-0 cursor-pointer items-center gap-1.5 px-2.5 text-xs',
              'text-muted-foreground transition-colors duration-150 hover:text-base-foreground',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary',
              activeNode === node.id
                ? 'bg-base-100 text-base-foreground'
                : 'hover:bg-base-300/60'
            )"
            @click="onTabClick(node.id)"
            @keydown.enter.prevent="onTabClick(node.id)"
            @keydown.space.prevent="onTabClick(node.id)"
          >
            <span
              v-if="activeNode === node.id"
              class="absolute inset-x-0 top-0 h-px bg-primary"
              aria-hidden
            />
            <ObjectTypeIcon :type="iconTypeFor(node)" :size="14" />
            <span class="min-w-0 truncate">{{ node.label }}</span>
            <button
              type="button"
              :class="cn(
                'open-node-tab-close -mr-0.5 flex-shrink-0 rounded p-0.5',
                'hover:bg-base-300 focus-visible:outline-none focus-visible:ring-1',
                activeNode === node.id ? 'opacity-70 hover:opacity-100' : 'opacity-0 group-hover:opacity-70 group-hover:hover:opacity-100'
              )"
              :aria-label="`Close ${node.label}`"
              @click="onClose($event, node.id)"
            >
              <span class="block h-3 w-3 leading-none text-muted-foreground hover:text-base-foreground">×</span>
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="hasOverflow"
        class="open-nodes-tab-bar__scrollbar"
        aria-hidden="true"
      >
        <div class="open-nodes-tab-bar__scrollbar-thumb" :style="thumbStyle" />
      </div>
    </div>
    <EditorTabBarActions />
  </div>
</template>

<style scoped>
.open-nodes-tab-bar__tabs-wrap {
  position: relative;
}

/* Native scrollbar hidden (Windows arrow buttons cannot be removed reliably via CSS) */
.open-nodes-tab-bar__tabs {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.open-nodes-tab-bar__tabs::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* Custom 2px thumb — visible only when hovering the tab strip */
.open-nodes-tab-bar__scrollbar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.open-nodes-tab-bar__tabs-wrap:hover .open-nodes-tab-bar__scrollbar {
  opacity: 1;
}
.open-nodes-tab-bar__scrollbar-thumb {
  height: 100%;
  border-radius: 999px;
  background: color-mix(in srgb, var(--base-300) 85%, transparent);
}
</style>

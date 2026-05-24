import { nextTick, ref, watch, type CSSProperties, type Ref } from 'vue';
import { useEventListener } from '@vueuse/core';

export function useMenuAnchorPosition(
  openGroupId: Ref<string | null>,
  triggerRefs: Ref<Map<string, HTMLElement>>,
) {
  const anchorStyle = ref<CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    pointerEvents: 'none',
  });

  function updateAnchorPosition(): void {
    const id = openGroupId.value;
    if (!id) return;
    const el = triggerRefs.value.get(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    anchorStyle.value = {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      pointerEvents: 'none',
    };
  }

  watch(openGroupId, async (id) => {
    if (id) {
      await nextTick();
      updateAnchorPosition();
    }
  });

  useEventListener(window, 'resize', updateAnchorPosition);
  useEventListener(window, 'scroll', updateAnchorPosition, { capture: true });

  return { anchorStyle, updateAnchorPosition };
}

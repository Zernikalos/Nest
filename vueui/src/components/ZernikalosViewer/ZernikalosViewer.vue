<script setup lang="ts">
import { ref, computed, toRef } from 'vue';
import { useZernikalosViewer } from '@/composables/useZernikalosViewer';

const props = withDefaults(
  defineProps<{
    sceneData: Uint8Array | null;
    width?: string | number;
    height?: string | number;
    onError?: (error: Error) => void;
  }>(),
  { width: '100%', height: '100%' }
);

const emit = defineEmits<{ error: [error: Error] }>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

const { isInitialized, error } = useZernikalosViewer({
  sceneData: toRef(props, 'sceneData'),
  canvasRef: () => canvasRef.value,
  containerRef: () => containerRef.value,
  scaleModel: 0.1,
  logLevel: 'WARNING',
  onError: (e) => {
    props.onError?.(e);
    emit('error', e);
  },
});

const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));
</script>

<template>
  <div
    v-if="error"
    class="viewer-error"
    :style="containerStyle"
  >
    <div class="viewer-error__content">
      <p class="viewer-error__title">Viewer not available</p>
      <p class="viewer-error__message">{{ error.message }}</p>
    </div>
  </div>
  <div
    v-else-if="!sceneData"
    class="viewer-empty"
    :style="containerStyle"
  >
    <div class="viewer-empty__content">
      <p>No scene data provided</p>
      <p class="text-sm mt-1">Load a project to preview the 3D scene.</p>
    </div>
  </div>
  <div
    v-else
    ref="containerRef"
    class="viewer-container"
    :style="containerStyle"
  >
    <canvas
      ref="canvasRef"
      class="viewer-canvas"
    />
    <div
      v-if="!isInitialized"
      class="viewer-loading"
    >
      <p>Initializing viewer…</p>
    </div>
  </div>
</template>

<style scoped>
.viewer-error,
.viewer-empty,
.viewer-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
}
.viewer-error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.viewer-error__content,
.viewer-empty__content {
  text-align: center;
}
.viewer-error__title,
.viewer-empty__content p:first-child {
  font-weight: 600;
}
.viewer-error__message {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.viewer-empty {
  background: var(--color-base-200, #f3f4f6);
  color: #6b7280;
  border: 1px solid var(--color-base-300, #e5e7eb);
}
.viewer-container {
  position: relative;
}
.viewer-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.viewer-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(243, 244, 246, 0.75);
}
.viewer-loading p {
  color: var(--color-base-foreground, #111827);
}
</style>

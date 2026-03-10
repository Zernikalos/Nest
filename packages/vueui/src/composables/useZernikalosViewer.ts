import { ref, watch, onUnmounted, type Ref } from 'vue';

export interface UseZernikalosViewerOptions {
  sceneData: Ref<Uint8Array | null>;
  canvasRef: () => HTMLCanvasElement | null;
  containerRef: () => HTMLDivElement | null;
  scaleModel?: number;
  logLevel?: string;
  onError?: (error: Error) => void;
}

function areArraysEqual(a: Uint8Array | null, b: Uint8Array | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  if (a.length === 0) return true;
  const sample = Math.min(300, a.length);
  for (let i = 0; i < sample; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function useZernikalosViewer(options: UseZernikalosViewerOptions) {
  const {
    sceneData,
    canvasRef,
    containerRef,
    scaleModel = 0.1,
    logLevel = 'WARNING',
    onError,
  } = options;

  const isInitialized = ref(false);
  const error = ref<Error | null>(null);
  let instance: { dispose: () => void } | null = null;
  let previousData: Uint8Array | null = null;
  let initializing = false;

  async function runInit() {
    const canvas = canvasRef();
    const container = containerRef();
    const data = sceneData.value;

    if (!canvas || !container || container.clientWidth === 0 || container.clientHeight === 0) {
      return;
    }

    if (!data) {
      isInitialized.value = false;
      return;
    }

    if (initializing) return;
    const dataChanged = !areArraysEqual(data, previousData);
    if (!dataChanged && instance && isInitialized.value) return;

    previousData = new Uint8Array(data);
    initializing = true;
    error.value = null;

    try {
      if (instance && dataChanged) {
        try {
          instance.dispose();
        } catch {
          /* ignore */
        }
        instance = null;
      }

      const zernikalosModule = await import('@zernikalos/zernikalos').catch(() => null);
      const zernikalos =
        zernikalosModule?.zernikalos ?? (zernikalosModule as { default?: unknown })?.default;
      if (!zernikalos) {
        throw new Error('Viewer not available');
      }

      type Zk = {
        Zernikalos: new () => {
          dispose: () => void;
          settings: { logLevel: number };
          initializeWithCanvas: (c: HTMLCanvasElement, h: unknown) => void;
        };
        logger: { ZLogLevel: Record<string, number> };
        loader: { loadFromProto: (d: Int8Array) => Promise<{ root: unknown }> };
        objects: {
          ZScene: new () => { addChild: (c: unknown) => void };
          ZCamera: new () => {
            transform?: {
              rotate: (a: number, x: number, y: number, z: number) => void;
              translate: (x: number, y: number, z: number) => void;
            };
          };
        };
        search: {
          findFirstModel: (s: unknown) => { transform: { scaleByFactor: (n: number) => void } } | null;
        };
      };
      const zk = zernikalos as Zk;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      const zkInstance = new zk.Zernikalos();
      zkInstance.settings.logLevel = zk.logger.ZLogLevel[logLevel] ?? zk.logger.ZLogLevel.WARNING;
      instance = zkInstance;

      const int8SceneData = new Int8Array(data.buffer, data.byteOffset, data.byteLength);
      const zko = await zk.loader.loadFromProto(int8SceneData);

      const scene = new zk.objects.ZScene();
      const camera = new zk.objects.ZCamera();
      scene.addChild(zko.root);
      scene.addChild(camera);

      const cam = camera as {
        transform?: {
          rotate: (a: number, x: number, y: number, z: number) => void;
          translate: (x: number, y: number, z: number) => void;
        };
      };
      if (cam.transform) {
        cam.transform.rotate(180, 1, 0, 0);
        cam.transform.rotate(180, 0, 1, 0);
        cam.transform.translate(-1, -7, -40);
      }

      const mainObj = zk.search.findFirstModel(scene);
      if (mainObj) {
        mainObj.transform.scaleByFactor(scaleModel);
      }

      zkInstance.initializeWithCanvas(canvas, {
        onReady: (ctx: { activeCamera: unknown; scene: unknown }, done: () => void) => {
          ctx.activeCamera = camera;
          ctx.scene = scene;
          done();
        },
        onUpdate: (_ctx: unknown, done: () => void) => done(),
        onRender: (_ctx: unknown, done: () => void) => done(),
        onResize: (_ctx: unknown, _w: number, _h: number, done: () => void) => done(),
      });

      isInitialized.value = true;
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Initialization failed');
      error.value = e;
      onError?.(e);
      instance = null;
      isInitialized.value = false;
    } finally {
      initializing = false;
    }
  }

  watch(
    [sceneData, () => canvasRef(), () => containerRef()],
    () => runInit(),
    { immediate: true }
  );

  onUnmounted(() => {
    if (instance) {
      try {
        instance.dispose();
      } catch {
        /* ignore */
      }
      instance = null;
    }
    isInitialized.value = false;
  });

  return { isInitialized, error };
}

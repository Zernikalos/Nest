import { useLayoutEffect, useRef, useState } from 'react';
import { zernikalos } from '@/lib/zernikalos';

interface UseZernikalosViewerProps {
    sceneData: Uint8Array | null;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    scaleModel: number;
    playAnimation: boolean;
    animationIndex: number;
    logLevel: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
    onError?: (error: Error) => void;
}

// Helper function to compare if two Uint8Arrays have the same content
const areArraysEqual = (a: Uint8Array | null, b: Uint8Array | null): boolean => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    if (a.length === 0) return true;
    
    // For small arrays, do full comparison
    if (a.length <= 1000) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    
    // For large arrays, compare samples and hash
    // Check first 100, middle 100, and last 100 bytes
    const sampleSize = 100;
    for (let i = 0; i < sampleSize; i++) {
        if (a[i] !== b[i]) return false;
    }
    const midStart = Math.floor(a.length / 2) - sampleSize / 2;
    for (let i = 0; i < sampleSize; i++) {
        if (a[midStart + i] !== b[midStart + i]) return false;
    }
    const endStart = a.length - sampleSize;
    for (let i = 0; i < sampleSize; i++) {
        if (a[endStart + i] !== b[endStart + i]) return false;
    }
    
    return true;
};

export const useZernikalosViewer = ({
    sceneData,
    canvasRef,
    containerRef,
    scaleModel,
    playAnimation,
    animationIndex,
    logLevel,
    onError
}: UseZernikalosViewerProps) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const zernikalosRef = useRef<zernikalos.Zernikalos | null>(null);
    const onErrorRef = useRef(onError);
    const previousSceneDataRef = useRef<Uint8Array | null>(null);
    const isInitializingRef = useRef(false);

    useLayoutEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container || container.clientWidth === 0 || container.clientHeight === 0) {
            return;
        }

        // Check if sceneData actually changed (compare before updating)
        const sceneDataChanged = !areArraysEqual(sceneData, previousSceneDataRef.current);
        
        // If sceneData hasn't changed and we're already initialized, skip re-initialization
        if (!sceneDataChanged && zernikalosRef.current && isInitialized) {
            return;
        }

        // Prevent concurrent initializations
        if (isInitializingRef.current) {
            return;
        }

        // Update previous scene data reference after comparison
        previousSceneDataRef.current = sceneData ? new Uint8Array(sceneData) : null;

        const initialize = async () => {
            isInitializingRef.current = true;
            try {
                // Cleanup previous instance if sceneData changed
                if (zernikalosRef.current && sceneDataChanged) {
                    try {
                        zernikalosRef.current.dispose();
                    } catch (err) {
                        console.warn('Error during cleanup:', err);
                    }
                }

                // Setup canvas
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;

                // Create Zernikalos instance
                const zk = new zernikalos.Zernikalos();
                zk.settings.logLevel = zernikalos.logger.ZLogLevel[logLevel];
                zernikalosRef.current = zk;

                // Create action player
                const player = new zernikalos.action.ZActionPlayer();

                if (sceneData) {
                    // Load ZKO scene data
                    const int8SceneData = new Int8Array(
                        sceneData.buffer,
                        sceneData.byteOffset,
                        sceneData.byteLength
                    );
                    const zko = await zernikalos.loader.loadFromProto(int8SceneData);

                    // Setup scene
                    const scene = new zernikalos.objects.ZScene();
                    const camera = new zernikalos.objects.ZCamera();
                    scene.addChild(zko.root);
                    scene.addChild(camera);

                    // Configure default camera settings
                    camera.transform?.rotate(180, 1, 0, 0);  // Rotate 180° around X axis
                    camera.transform?.rotate(180, 0, 1, 0);  // Rotate 180° around Y axis
                    camera.transform?.translate(-1, -7, -40);

                    // Scale model
                    const mainObj = zernikalos.search.findFirstModel(scene);
                    if (mainObj) {
                        mainObj.transform.scaleByFactor(scaleModel);
                    }

                    // Setup animation
                    if (playAnimation && mainObj && zko.actions) {
                        // Convert Kotlin list to array for easier access
                        const actionsArray = Array.from(zko.actions as any) as zernikalos.action.ZSkeletalAction[];
                        if (actionsArray.length > 0) {
                            const actionIndex = Math.min(animationIndex, actionsArray.length - 1);
                            const action = actionsArray[actionIndex];
                            if (action) {
                                player.setAction(mainObj, action);
                                player.play(true);
                            }
                        }
                    }

                    // Initialize with scene handler
                    zk.initializeWithCanvas(canvas, {
                        onReady: (ctx: any, done: () => void) => {
                            ctx.activeCamera = camera;
                            ctx.scene = scene;
                            done();
                        },
                        onUpdate: (_ctx: any, done: () => void) => {
                            if (playAnimation && player) {
                                player.update();
                            }
                            done();
                        },
                        onRender: (_ctx: any, done: () => void) => {
                            done();
                        },
                        onResize: (_ctx: any, _width: number, _height: number, done: () => void) => {
                            done();
                        }
                    } as zernikalos.scenestatehandler.ZSceneStateHandler);
                }

                setIsInitialized(true);
                isInitializingRef.current = false;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Initialization failed');
                console.error('Zernikalos error:', error);
                setError(error);
                onErrorRef.current?.(error);
                isInitializingRef.current = false;
            }
        };

        initialize();

        return () => {
            // Only cleanup on unmount
            if (zernikalosRef.current) {
                try {
                    zernikalosRef.current.dispose();
                } catch (err) {
                    console.warn('Error during cleanup:', err);
                }
            }
        };
    }, [sceneData, logLevel, scaleModel, playAnimation, animationIndex]);

    return { isInitialized, error };
};

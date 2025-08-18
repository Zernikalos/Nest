import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { zernikalos } from '@/lib/zernikalos';

interface UseZernikalosInitializationProps {
    sceneData: Uint8Array | null;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    scaleModel: number;
    playAnimation: boolean;
    animationIndex: number;
    logLevel: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
    onError?: (error: Error) => void;
}

export const useZernikalosInitialization = ({
    sceneData,
    canvasRef,
    containerRef,
    scaleModel,
    playAnimation,
    animationIndex,
    logLevel,
    onError
}: UseZernikalosInitializationProps) => {
    const zernikalosRef = useRef<zernikalos.Zernikalos>(null);
    const playerRef = useRef<zernikalos.action.ZActionPlayer>(null);
    const cameraRef = useRef<zernikalos.objects.ZCamera | null>(null);
    const sceneRef = useRef<zernikalos.objects.ZScene | null>(null);
    const zkoRef = useRef<any>(null); // Reference to the loaded ZKO object
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const initializationAttemptedRef = useRef(false);

    const handleError = useCallback((error: Error) => {
        onError?.(error);
        setError(error.message);
    }, [onError]);

    // Function to load ZKO scene data
    const loadZkoScene = useCallback(async (sceneData: Uint8Array) => {
        try {
            // Convert Uint8Array to Int8Array properly
            const int8SceneData = new Int8Array(sceneData.buffer, sceneData.byteOffset, sceneData.byteLength);
            const zko = await zernikalos.loader.loadFromProto(int8SceneData);
            zkoRef.current = zko;
            return zko;
        } catch (err) {
            throw new Error(`Failed to load ZKO scene: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }, []);

    // Function to setup scene with loaded ZKO
    const setupScene = useCallback((zko: any, player: zernikalos.action.ZActionPlayer) => {
        // Create scene and camera
        const scene = new zernikalos.objects.ZScene();
        const camera = new zernikalos.objects.ZCamera();

        // Store references
        sceneRef.current = scene;
        cameraRef.current = camera;

        // Add objects to scene
        scene.addChild(zko.root);
        scene.addChild(camera);

        // Find main object and configure it
        const mainObj = zernikalos.search.findFirstModel(scene);
        if (mainObj) {
            mainObj.transform.scaleByFactor(scaleModel);
        }

        // Set up animation if available
        if (playAnimation && zko.actions && zko.actions.length > 0 && mainObj) {
            const actionIndex = Math.min(animationIndex, zko.actions.length - 1);
            const action = zko.actions[actionIndex];
            if (action) {
                player.setAction(mainObj, action);
                player.play(true);
            }
        }

        return { scene, camera, mainObj };
    }, [scaleModel, playAnimation, animationIndex]);

    // Getter functions for external access
    const getCurrentCamera = useCallback(() => cameraRef.current, []);
    const getCurrentScene = useCallback(() => sceneRef.current, []);
    const getCurrentPlayer = useCallback(() => playerRef.current, []);
    const getCurrentZko = useCallback(() => zkoRef.current, []);
    const getCurrentZernikalos = useCallback(() => zernikalosRef.current, []);

    useLayoutEffect(() => {
        if (initializationAttemptedRef.current) {
            console.log('⚠️ Initialization already attempted, skipping...');
            return;
        }

        // Check if refs are available (similar to Vue onMounted)
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) {
            console.log('⏳ Canvas or container not ready yet, waiting...');
            return; // Wait for refs to be available
        }

        // Additional check: ensure canvas has valid dimensions
        if (container.clientWidth === 0 || container.clientHeight === 0) {
            console.log('⏳ Container has no dimensions yet, waiting...');
            return; // Wait for container to have dimensions
        }

        console.log('🚀 Starting Zernikalos initialization and scene setup');
        initializationAttemptedRef.current = true;

        const initializeAndSetupScene = async () => {
            try {
                // Canvas and container are already verified above
                const canvas = canvasRef.current!;
                const container = containerRef.current!;

                // Set canvas size
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;

                // Create Zernikalos instance
                const zk = new zernikalos.Zernikalos();
                zk.settings.logLevel = zernikalos.logger.ZLogLevel[logLevel];
                zernikalosRef.current = zk;

                // Create action player
                const player = new zernikalos.action.ZActionPlayer();
                playerRef.current = player;

                console.log('✅ Zernikalos initialized');

                // Only setup scene if we have sceneData
                if (sceneData) {
                    console.log('🎬 Setting up scene with data');

                    zk.initializeWithCanvas(canvas, {
                        onReady(ctx: any, done: () => void) {
                            const loadScene = async () => {
                                try {
                                    // Load ZKO scene data
                                    const zko = await loadZkoScene(sceneData);
                                    
                                    // Setup scene with loaded ZKO
                                    const { scene, camera, mainObj } = setupScene(zko, player);
                                    
                                    // Set active camera and scene (no automatic configuration)
                                    ctx.activeCamera = camera;
                                    ctx.scene = scene;

                                    console.log('✅ Scene setup completed successfully');
                                    setIsInitialized(true);
                                    console.log('🎯 isInitialized set to true');
                                    done();
                                } catch (err) {
                                    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                                    console.error('❌ Scene setup error:', errorMessage);
                                    handleError(new Error(errorMessage));
                                }
                            };
                            loadScene();
                        },
                        onRender(_ctx: any, done: () => void) {
                            try {
                                if (playAnimation && player) {
                                    player.update();
                                }
                                done();
                            } catch (err) {
                                console.error('Render error:', err);
                                done();
                            }
                        },
                        onResize(_ctx: any, _width: number, _height: number, done: () => void) {
                            done();
                        }
                    } as zernikalos.scenestatehandler.ZSceneStateHandler);
                } else {
                    console.log('⏳ No scene data provided, initialization complete');
                    setIsInitialized(true);
                    console.log('🎯 isInitialized set to true (no scene data)');
                }

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                console.error('❌ Initialization error:', errorMessage);
                handleError(new Error(errorMessage));
                initializationAttemptedRef.current = false;
            }
        };

        initializeAndSetupScene();

        // Cleanup function
        return () => {
            console.log('🧹 Cleaning up Zernikalos component');
            if (zernikalosRef.current) {
                try {
                    zernikalosRef.current = null;
                } catch (err) {
                    console.warn('Error during Zernikalos cleanup:', err);
                }
            }
            if (playerRef.current) {
                try {
                    playerRef.current = null;
                } catch (err) {
                    console.warn('Error during player cleanup:', err);
                }
            }
            // Clear other references
            cameraRef.current = null;
            sceneRef.current = null;
            zkoRef.current = null;
        };
    }, [sceneData, logLevel]); // Run when props change, refs are checked inside

    return {
        isInitialized,
        error,
        // Getter functions for external access
        getCurrentCamera,
        getCurrentScene,
        getCurrentPlayer,
        getCurrentZko,
        getCurrentZernikalos,
        // Utility functions
        loadZkoScene,
        setupScene
    };
};

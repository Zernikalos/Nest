import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { zernikalos } from '@/lib/zernikalos';
import { loadZkoScene } from '../utils/zkoLoader';
import { setupScene } from '../utils/sceneManager';
import { setupAnimation, updateAnimation } from '../utils/animationController';
import { createZernikalosInstance, createSceneStateHandler, disposeZernikalosInstance } from '../utils/zernikalosCore';

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

interface ZernikalosRefs {
    zernikalos: zernikalos.Zernikalos | null;
    zko: any | null;
    scene: zernikalos.objects.ZScene | null;
    camera: zernikalos.objects.ZCamera | null;
    player: zernikalos.action.ZActionPlayer | null;
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
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    // Consolidated refs object
    const refs = useRef<ZernikalosRefs>({
        zernikalos: null,
        zko: null,
        scene: null,
        camera: null,
        player: null
    });

    // Handle errors
    const handleError = useCallback((err: Error) => {
        console.error('Zernikalos error:', err);
        setError(err);
        onError?.(err);
    }, [onError]);

    // Cleanup function
    const cleanup = useCallback(() => {
        console.log('🧹 Cleaning up Zernikalos resources');
        disposeZernikalosInstance(refs.current.zernikalos);
        refs.current = {
            zernikalos: null,
            zko: null,
            scene: null,
            camera: null,
            player: null
        };
        setIsInitialized(false);
        setError(null);
    }, []);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        // Wait for refs to be available
        if (!canvas || !container) {
            return;
        }

        // Wait for container to have dimensions
        if (container.clientWidth === 0 || container.clientHeight === 0) {
            return;
        }

        console.log('🚀 Initializing Zernikalos');

        const initialize = async () => {
            try {
                // Clean up any existing instance
                cleanup();

                // Set canvas size
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;

                // Create Zernikalos instance
                const zk = createZernikalosInstance(logLevel);
                refs.current.zernikalos = zk;

                // Create action player
                const player = new zernikalos.action.ZActionPlayer();
                refs.current.player = player;

                console.log('✅ Zernikalos instance created');

                // Setup scene if we have data
                if (sceneData) {
                    console.log('🎬 Loading scene data');

                    const sceneStateHandler = createSceneStateHandler(
                        async (ctx: any, done: () => void) => {
                            try {
                                // Load ZKO scene
                                const zko = await loadZkoScene(sceneData);
                                refs.current.zko = zko;

                                // Setup scene
                                const { scene, camera, mainObj } = setupScene(zko, scaleModel);
                                refs.current.scene = scene;
                                refs.current.camera = camera;

                                // Setup animation
                                setupAnimation(zko, mainObj, player, playAnimation, animationIndex);

                                // Set context
                                ctx.activeCamera = camera;
                                ctx.scene = scene;

                                console.log('✅ Scene setup completed');
                                setIsInitialized(true);
                                done();
                            } catch (err) {
                                const error = err instanceof Error ? err : new Error('Scene setup failed');
                                handleError(error);
                                done();
                            }
                        },
                        (_ctx: any, done: () => void) => {
                            try {
                                updateAnimation(player, playAnimation);
                                done();
                            } catch (err) {
                                console.warn('Animation update error:', err);
                                done();
                            }
                        }
                    );

                    zk.initializeWithCanvas(canvas, sceneStateHandler);
                } else {
                    console.log('⏳ No scene data, initialization complete');
                    setIsInitialized(true);
                }

            } catch (err) {
                const error = err instanceof Error ? err : new Error('Initialization failed');
                handleError(error);
            }
        };

        initialize();

        // Cleanup on unmount or dependency change
        return cleanup;
    }, [sceneData, logLevel, scaleModel, playAnimation, animationIndex, cleanup, handleError]);

    return {
        isInitialized,
        error,
        // Direct access to refs
        getCurrentCamera: () => refs.current.camera,
        getCurrentScene: () => refs.current.scene,
        getCurrentPlayer: () => refs.current.player,
        getCurrentZko: () => refs.current.zko,
        getCurrentZernikalos: () => refs.current.zernikalos,
        // Utility functions
        loadZkoScene,
        setupScene
    };
};

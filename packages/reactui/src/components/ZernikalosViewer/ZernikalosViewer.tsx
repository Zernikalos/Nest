import React, { useEffect, useRef, useState, useCallback } from 'react';
import { zernikalos } from '@/lib/zernikalos';

export interface ZernikalosViewerProps {
    sceneData: Uint8Array | null;
    width?: string | number;
    height?: string | number;
    className?: string;
    onReady?: () => void;
    onError?: (error: Error) => void;
    // Camera configuration
    cameraPosition?: { x: number; y: number; z: number };
    cameraRotation?: { x: number; y: number; z: number };
    // Scene configuration
    scaleModel?: number;
    playAnimation?: boolean;
    animationIndex?: number;
    logLevel?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
}

export const ZernikalosViewer: React.FC<ZernikalosViewerProps> = ({
    sceneData,
    width = '100%',
    height = '100%',
    className = '',
    onError,
    cameraPosition = { x: -1, y: -7, z: -40 },
    cameraRotation = { x: 0, y: -45, z: 0 },
    scaleModel = 0.1,
    playAnimation = true,
    animationIndex = 2,
    logLevel = 'DEBUG'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const zernikalosRef = useRef<zernikalos.Zernikalos>(null);
    const playerRef = useRef<zernikalos.action.ZActionPlayer>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const initializationAttemptedRef = useRef(false);

    // Memoize error handler to prevent unnecessary re-renders
    const handleError = useCallback((error: Error) => {
        onError?.(error);
    }, [onError]);

    // Single useEffect for initialization and scene setup - minimal dependencies
    useEffect(() => {
        // Prevent multiple initialization attempts
        if (initializationAttemptedRef.current) {
            console.log('⚠️ Initialization already attempted, skipping...');
            return;
        }

        console.log('🚀 Starting Zernikalos initialization and scene setup');
        initializationAttemptedRef.current = true;

        const initializeAndSetupScene = async () => {
            try {
                const canvas = canvasRef.current;
                const container = containerRef.current;

                if (!canvas || !container) {
                    throw new Error('Canvas or container not found');
                }

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
                                // Convert Uint8Array to Int8Array properly
                                const int8SceneData = new Int8Array(sceneData.buffer, sceneData.byteOffset, sceneData.byteLength);
                                const zko = await zernikalos.loader.loadFromProto(int8SceneData)

                                // Create scene and camera
                                const scene = new zernikalos.objects.ZScene();
                                const camera = new zernikalos.objects.ZCamera();

                                // Add objects to scene
                                scene.addChild(zko.root);
                                scene.addChild(camera);

                                // Set active camera
                                ctx.activeCamera = camera;

                                // Configure camera
                                camera?.transform?.rotate(180, 1, 0, 0);
                                camera?.transform?.rotate(180, 0, 1, 0);

                                // Find main object and configure it
                                const mainObj = zernikalos.search.findFirstModel(scene);
                                if (mainObj) {
                                    mainObj.transform.scaleByFactor(scaleModel);
                                }

                                // Position camera
                                ctx.activeCamera?.transform?.translate(
                                    cameraPosition.x,
                                    cameraPosition.y,
                                    cameraPosition.z
                                );
                                ctx.activeCamera?.transform?.rotate(cameraRotation.y, 0, 1, 0);
                                if (cameraRotation.x !== 0) {
                                    ctx.activeCamera?.transform?.rotate(cameraRotation.x, 1, 0, 0);
                                }
                                if (cameraRotation.z !== 0) {
                                    ctx.activeCamera?.transform?.rotate(cameraRotation.z, 0, 0, 1);
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

                                // Set scene
                                ctx.scene = scene;

                                console.log('✅ Scene setup completed successfully');
                                setIsInitialized(true);
                                done();
                            }
                            loadScene()

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
                }

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                console.error('❌ Initialization error:', errorMessage);
                setError(errorMessage);
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
        };
    }, []); // EMPTY DEPENDENCY ARRAY - only run once on mount

    // Handle container resize
    useEffect(() => {
        const container = containerRef.current;
        const zk = zernikalosRef.current;

        if (!container || !zk) return;

        // const resizeObserver = new ResizeObserver(() => {
        //     if (container && zk && zk.surfaceView?.eventHandler) {
        //         console.log("Resize detected", container.clientWidth, container.clientHeight);
        //         zk.surfaceView.eventHandler.onResize(container.clientWidth, container.clientHeight);
        //     }
        // });

        //resizeObserver.observe(container);

        return () => {
            if (container) {
                //resizeObserver.unobserve(container);
            }
        };
    }, [isInitialized]);

    if (error) {
        return (
            <div
                className={`flex items-center justify-center bg-red-50 text-red-600 border border-red-200 rounded ${className}`}
                style={{ width, height }}
            >
                <div className="text-center">
                    <p className="font-semibold">Error loading Zernikalos viewer</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!sceneData) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-50 text-gray-500 border border-gray-200 rounded ${className}`}
                style={{ width, height }}
            >
                <div className="text-center">
                    <p>No scene data provided</p>
                    <p className="text-sm mt-1">Please provide scene data to render</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            style={{ width, height }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: 'block' }}
            />
            {!isInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
                    <div className="text-center">
                        <p className="text-gray-600">Initializing Zernikalos...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZernikalosViewer;

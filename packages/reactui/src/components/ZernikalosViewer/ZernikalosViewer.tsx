import React, { useRef, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
import { useZernikalosInitialization, useZernikalosResize } from './hooks';
import { ErrorState, NoDataState, LoadingState } from './components';

export interface ZernikalosViewerProps {
    sceneData: Uint8Array | null;
    width?: string | number;
    height?: string | number;
    className?: string;
    onError?: (error: Error) => void;
    // Scene configuration
    scaleModel?: number;
    playAnimation?: boolean;
    animationIndex?: number;
    logLevel?: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
}

// Interface for the exposed methods and references
export interface ZernikalosViewerRef {
    // Getter functions for current objects
    getCurrentCamera: () => any | null;
    getCurrentScene: () => any | null;
    getCurrentPlayer: () => any | null;
    getCurrentZko: () => any | null;
    getCurrentZernikalos: () => any | null;
    
    // Utility functions
    loadZkoScene: (sceneData: Uint8Array) => Promise<any>;
    setupScene: (zko: any, player: any) => { scene: any; camera: any; mainObj: any };
    
    // State
    isInitialized: boolean;
}

export const ZernikalosViewer = forwardRef<ZernikalosViewerRef, ZernikalosViewerProps>(({
    sceneData,
    width = '100%',
    height = '100%',
    className = '',
    onError,
    scaleModel = 0.1,
    playAnimation = true,
    animationIndex = 2,
    logLevel = 'DEBUG'
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { 
        isInitialized, 
        error, 
        getCurrentCamera,
        getCurrentScene,
        getCurrentPlayer,
        getCurrentZko,
        getCurrentZernikalos,
        loadZkoScene,
        setupScene
    } = useZernikalosInitialization({
        sceneData,
        canvasRef,
        containerRef,
        scaleModel,
        playAnimation,
        animationIndex,
        logLevel,
        onError
    });

    // Create a stable reference for the resize hook
    const getZernikalosForResize = useCallback(() => getCurrentZernikalos(), [getCurrentZernikalos]);

    useZernikalosResize({
        containerRef,
        getZernikalos: getZernikalosForResize,
        isInitialized
    });

    // Configure default camera settings when initialized
    useEffect(() => {
        if (isInitialized) {
            const camera = getCurrentCamera();
            if (camera) {
                // Apply default camera configuration (180° rotations as before)
                camera.transform?.rotate(180, 1, 0, 0);  // Rotate 180° around X axis
                camera.transform?.rotate(180, 0, 1, 0);  // Rotate 180° around Y axis
                
                // Set default camera position
                camera.transform?.translate(-1, -7, -40);
                
                console.log('✅ Default camera configuration applied');
            }
        }
    }, [isInitialized, getCurrentCamera]);

    // Expose methods and references to parent component
    useImperativeHandle(ref, () => ({
        getCurrentCamera,
        getCurrentScene,
        getCurrentPlayer,
        getCurrentZko,
        getCurrentZernikalos,
        loadZkoScene,
        setupScene,
        isInitialized
    }), [
        getCurrentCamera,
        getCurrentScene,
        getCurrentPlayer,
        getCurrentZko,
        getCurrentZernikalos,
        loadZkoScene,
        setupScene,
        isInitialized
    ]);

    // Early returns for error states
    if (error) {
        return <ErrorState error={error} width={width} height={height} className={className} />;
    }

    if (!sceneData) {
        return <NoDataState width={width} height={height} className={className} />;
    }

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            style={{ width, height }}
            data-component="ZernikalosViewer"
            data-testid="zernikalos-viewer"
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: 'block' }}
                data-component="ZernikalosCanvas"
                data-testid="zernikalos-canvas"
            />
            {!isInitialized && <LoadingState />}
        </div>
    );
});

ZernikalosViewer.displayName = 'ZernikalosViewer';

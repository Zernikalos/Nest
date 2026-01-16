import { useRef } from 'react';
import { useZernikalosViewer } from './hooks/useZernikalosViewer';

export interface ZernikalosViewerProps {
    sceneData: Uint8Array | null;
    width?: string | number;
    height?: string | number;
    className?: string;
    onError?: (error: Error) => void;
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
    scaleModel = 0.1,
    playAnimation = true,
    animationIndex = 2,
    logLevel = 'DEBUG'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { isInitialized, error } = useZernikalosViewer({
        sceneData,
        canvasRef,
        containerRef,
        scaleModel,
        playAnimation,
        animationIndex,
        logLevel,
        onError
    });

    if (error) {
        return (
            <div
                className={`flex items-center justify-center bg-error/10 text-error border border-error/20 rounded ${className}`}
                style={{ width, height }}
                data-component="ZernikalosViewer"
                data-testid="zernikalos-viewer"
            >
                <div className="text-center">
                    <p className="font-semibold">Error loading Zernikalos viewer</p>
                    <p className="text-sm mt-1">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!sceneData) {
        return (
            <div
                className={`flex items-center justify-center bg-base-200 text-base-foreground border border-base-300 rounded ${className}`}
                style={{ width, height }}
                data-component="ZernikalosViewer"
                data-testid="zernikalos-viewer"
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
            {!isInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-200/75">
                    <div className="text-center">
                        <p className="text-base-foreground">Initializing Zernikalos...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

ZernikalosViewer.displayName = 'ZernikalosViewer';

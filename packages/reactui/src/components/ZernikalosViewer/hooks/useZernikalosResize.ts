import { useEffect } from 'react';
import { zernikalos } from '@/lib/zernikalos';

interface UseZernikalosResizeProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    getZernikalos: () => zernikalos.Zernikalos | null;
    isInitialized: boolean;
}

export const useZernikalosResize = ({
    containerRef,
    getZernikalos,
    isInitialized
}: UseZernikalosResizeProps) => {
    useEffect(() => {
        const container = containerRef.current;
        const zk = getZernikalos();

        if (!container || !zk) return;

        // ResizeObserver logic can be uncommented when needed
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
    }, [isInitialized, containerRef, getZernikalos]);
};

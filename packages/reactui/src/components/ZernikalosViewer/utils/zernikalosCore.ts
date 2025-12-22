import { zernikalos } from '@/lib/zernikalos';

/**
 * Creates and initializes a Zernikalos instance
 */
export const createZernikalosInstance = (
    logLevel: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR'
): zernikalos.Zernikalos => {
    const zk = new zernikalos.Zernikalos();
    zk.settings.logLevel = zernikalos.logger.ZLogLevel[logLevel];
    return zk;
};

/**
 * Creates a scene state handler for Zernikalos
 */
export const createSceneStateHandler = (
    onReady: (ctx: any, done: () => void) => void,
    onUpdate: (ctx: any, done: () => void) => void,
): zernikalos.scenestatehandler.ZSceneStateHandler => {
    return {
        onReady,
        onUpdate,
        onRender(_ctx: any, done: () => void) {
            done();
        },
        onResize(_ctx: any, _width: number, _height: number, done: () => void) {
            done();
        }
    } as zernikalos.scenestatehandler.ZSceneStateHandler;
};

/**
 * Disposes a Zernikalos instance safely
 */
export const disposeZernikalosInstance = (zk: zernikalos.Zernikalos | null): void => {
    if (zk) {
        try {
            zk.dispose();
        } catch (err) {
            console.warn('Error during Zernikalos cleanup:', err);
        }
    }
};

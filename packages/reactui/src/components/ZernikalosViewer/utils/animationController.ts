import { zernikalos } from '@/lib/zernikalos';

/**
 * Sets up animation on a main object using ZKO actions
 */
export const setupAnimation = (
    zko: any,
    mainObj: any,
    player: zernikalos.action.ZActionPlayer,
    playAnimation: boolean,
    animationIndex: number
): void => {
    if (!player || !mainObj) return;

    // Set up animation if available
    if (playAnimation && zko.actions && zko.actions.length > 0) {
        const actionIndex = Math.min(animationIndex, zko.actions.length - 1);
        const action = zko.actions[actionIndex];
        if (action) {
            player.setAction(mainObj, action);
            player.play(true);
        }
    }
};

/**
 * Updates animation player
 */
export const updateAnimation = (
    player: zernikalos.action.ZActionPlayer | null,
    playAnimation: boolean
): void => {
    if (playAnimation && player) {
        player.update();
    }
};

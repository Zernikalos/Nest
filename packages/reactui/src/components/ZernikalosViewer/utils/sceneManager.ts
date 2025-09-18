import { zernikalos } from '@/lib/zernikalos';

export interface SceneSetupResult {
    scene: zernikalos.objects.ZScene;
    camera: zernikalos.objects.ZCamera;
    mainObj: any;
}

/**
 * Sets up a scene with loaded ZKO data
 */
export const setupScene = (
    zko: any, 
    scaleModel: number
): SceneSetupResult => {
    // Create scene and camera
    const scene = new zernikalos.objects.ZScene();
    const camera = new zernikalos.objects.ZCamera();

    // Add objects to scene
    scene.addChild(zko.root);
    scene.addChild(camera);

    // Find main object and configure it
    const mainObj = zernikalos.search.findFirstModel(scene);
    if (mainObj) {
        mainObj.transform.scaleByFactor(scaleModel);
    }

    return { scene, camera, mainObj };
};

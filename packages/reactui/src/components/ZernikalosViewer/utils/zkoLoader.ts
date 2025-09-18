import { zernikalos } from '@/lib/zernikalos';

/**
 * Loads ZKO scene data from Uint8Array
 */
export const loadZkoScene = async (sceneData: Uint8Array): Promise<any> => {
    try {
        // Convert Uint8Array to Int8Array properly
        const int8SceneData = new Int8Array(sceneData.buffer, sceneData.byteOffset, sceneData.byteLength);
        const zko = await zernikalos.loader.loadFromProto(int8SceneData);
        return zko;
    } catch (err) {
        throw new Error(`Failed to load ZKO scene: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
};

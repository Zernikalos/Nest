/** Workbench panel area. Layout is defined by the runtime; the UI projects it. */
export enum WorkbenchArea {
    Left = 'left',
    Right = 'right',
    Bottom = 'bottom',
    Center = 'center',
}

/** Input asset format for project asset list (matches Nest API shape). */
export enum AssetFormat {
    Obj = 'obj',
    Gltf = 'gltf',
    Fbx = 'fbx',
    Collada = 'collada',
}

/** ZObject types used for scene tree node icons (matches iconType on TreeNode). */
export enum ZObjectType {
    Scene = 'SCENE',
    Model = 'MODEL',
    Group = 'GROUP',
    Camera = 'CAMERA',
    Skeleton = 'SKELETON',
    Light = 'LIGHT',
}

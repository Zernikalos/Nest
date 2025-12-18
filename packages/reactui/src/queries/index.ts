// Projects queries and mutations
export {
    projectKeys,
    useProjectQuery,
    useCreateProjectMutation,
    useAddAssetMutation,
} from './projects';

export type { ProjectMetadata, InputAsset } from '@/lib/projectApi';

// Settings queries and mutations
export {
    useSettingsQuery,
    useUpdateSettingsMutation,
    type AppSettings,
} from './settings';


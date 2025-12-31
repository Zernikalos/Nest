// Projects queries
export {
    projectKeys,
    useProjectQuery,
} from './projects';

export type { Project, InputAsset } from '@/core/Project';
// Legacy export for backward compatibility
export type { ProjectMetadata } from '@/lib/projectApi';

// Settings queries and mutations
export {
    useSettingsQuery,
    useUpdateSettingsMutation,
    type AppSettings,
} from './settings';


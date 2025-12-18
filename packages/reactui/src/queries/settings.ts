import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/httpClient';

export interface AppSettings {
    windowSize?: {
        width: number;
        height: number;
    };
    theme?: string;
    font?: string;
}

const SETTINGS_QUERY_KEY = ['settings'];

export function useSettingsQuery() {
    return useQuery<AppSettings>({
        queryKey: SETTINGS_QUERY_KEY,
        queryFn: async (): Promise<AppSettings> => {
            const response = await api.get<AppSettings>('/settings');
            return response.data;
        },
    });
}

export function useUpdateSettingsMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (partialSettings: Partial<AppSettings>): Promise<AppSettings> => {
            const response = await api.patch<AppSettings>('/settings', partialSettings);
            return response.data;
        },
        onMutate: async (newSettings) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });

            // Snapshot the previous value
            const previousSettings = queryClient.getQueryData<AppSettings>(SETTINGS_QUERY_KEY);

            // Optimistically update to the new value
            queryClient.setQueryData<AppSettings>(SETTINGS_QUERY_KEY, (old) => ({
                ...old,
                ...newSettings,
            }));

            return { previousSettings };
        },
        onError: (_err, _newSettings, context) => {
            // Rollback on error
            if (context?.previousSettings) {
                queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings);
            }
        },
        onSettled: () => {
            // Refetch after error or success to ensure consistency
            queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
        },
    });
}


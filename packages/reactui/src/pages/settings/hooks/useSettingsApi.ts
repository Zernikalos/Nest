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
    return useQuery({
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
        },
    });
}


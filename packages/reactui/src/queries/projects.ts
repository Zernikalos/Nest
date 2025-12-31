import { useQuery } from '@tanstack/react-query';
import { getProjectByPath } from '@/lib/projectApi';
import type { Project } from '@/core/Project';

// Query key factory
export const projectKeys = {
    all: ['projects'] as const,
    detail: (filePath: string) => [...projectKeys.all, filePath] as const,
};

// Query hook para obtener proyecto
export function useProjectQuery(filePath: string | null) {
    return useQuery<Project>({
        queryKey: projectKeys.detail(filePath!),
        queryFn: () => getProjectByPath(filePath!),
        enabled: !!filePath,
        staleTime: 30000, // 30 segundos
    });
}


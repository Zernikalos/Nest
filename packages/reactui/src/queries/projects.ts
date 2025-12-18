import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectByPath, createProject, addInputAsset } from '@/lib/projectApi';
import type { ProjectMetadata, InputAsset } from '@/lib/projectApi';

// Query key factory
export const projectKeys = {
    all: ['projects'] as const,
    detail: (filePath: string) => [...projectKeys.all, filePath] as const,
};

// Query hook para obtener proyecto
export function useProjectQuery(filePath: string | null) {
    return useQuery<ProjectMetadata>({
        queryKey: projectKeys.detail(filePath!),
        queryFn: () => getProjectByPath(filePath!),
        enabled: !!filePath,
        staleTime: 30000, // 30 segundos
    });
}

// Mutation para crear proyecto
export function useCreateProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, filePath }: { name: string; filePath: string }): Promise<ProjectMetadata> => {
            return createProject(name, filePath);
        },
        onSuccess: (data, variables) => {
            // Establecer datos en cache después de crear
            queryClient.setQueryData<ProjectMetadata>(projectKeys.detail(variables.filePath), data);
        },
    });
}

// Mutation para agregar asset al proyecto
export function useAddAssetMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ filePath, asset }: { filePath: string; asset: Omit<InputAsset, 'id' | 'importedAt'> }): Promise<ProjectMetadata> => {
            return addInputAsset(filePath, asset);
        },
        onSuccess: (data, variables) => {
            // Actualizar cache con el proyecto actualizado
            queryClient.setQueryData<ProjectMetadata>(projectKeys.detail(variables.filePath), data);
            // Invalidar para asegurar consistencia
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.filePath) });
        },
    });
}


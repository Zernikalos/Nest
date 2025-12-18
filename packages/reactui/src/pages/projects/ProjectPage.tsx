import React from 'react';
import { ProjectHeader } from './components/ProjectHeader';
import { ProjectTemplates } from './components/ProjectTemplates';
import { RecentProjects } from './components/RecentProjects';
import { ProjectEditView } from './components/ProjectEditView';
import { useProject } from '@/hooks/useProject';

export const ProjectPage: React.FC = () => {
    const { isProjectOpen } = useProject();

    // Si hay un proyecto abierto, mostrar la vista de edición
    if (isProjectOpen) {
        return <ProjectEditView />;
    }

    // Si no hay proyecto, mostrar la vista de selección/creación
    return (
        <div className="h-full overflow-auto bg-base-100">
            <div className="max-w-6xl mx-auto px-8 py-12">
                <ProjectHeader />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ProjectTemplates />
                    <RecentProjects />
                </div>
            </div>
        </div>
    );
};


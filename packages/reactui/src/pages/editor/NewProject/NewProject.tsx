import React from 'react';
import { NewProjectHeader } from './NewProjectHeader';
import { ProjectTemplates } from './ProjectTemplates';
import { RecentProjects } from './RecentProjects';

interface NewProjectProps {
    onNewProject: () => void;
}

export const NewProject: React.FC<NewProjectProps> = ({ onNewProject }) => {
    return (
        <div className="h-full overflow-auto bg-base-100">
            <div className="max-w-6xl mx-auto px-8 py-12">
                <NewProjectHeader onNewProject={onNewProject} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ProjectTemplates onNewProject={onNewProject} />
                    <RecentProjects />
                </div>
            </div>
        </div>
    );
};



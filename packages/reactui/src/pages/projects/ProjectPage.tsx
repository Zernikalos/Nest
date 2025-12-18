import React from 'react';
import { ProjectHeader } from './components/ProjectHeader';
import { ProjectTemplates } from './components/ProjectTemplates';
import { RecentProjects } from './components/RecentProjects';

export const ProjectPage: React.FC = () => {
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


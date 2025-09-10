import React from 'react';
import { IoDocumentText, IoColorPalette } from 'react-icons/io5';
import { TemplateCard } from './TemplateCard';

interface ProjectTemplatesProps {
    onNewProject: () => void;
}

export const ProjectTemplates: React.FC<ProjectTemplatesProps> = ({ onNewProject }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-6 text-foreground">
                Project Templates
            </h2>
            
            <div className="space-y-3">
                <TemplateCard
                    name="Empty Project"
                    description="Start with a blank canvas"
                    icon={IoDocumentText}
                    iconClassName="bg-primary"
                    onClick={onNewProject}
                />
                <TemplateCard
                    name="3D Scene"
                    description="Basic 3D scene template"
                    icon={IoColorPalette}
                    iconClassName="bg-accent"
                    onClick={onNewProject}
                />
            </div>
        </div>
    );
};

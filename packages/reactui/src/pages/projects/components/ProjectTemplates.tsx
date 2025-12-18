import React from 'react';
import { IoDocumentText, IoColorPalette } from 'react-icons/io5';
import { TemplateCard } from './TemplateCard';
import { useCreateProject } from '@/hooks/useCreateProject';

export const ProjectTemplates: React.FC = () => {
    const { setIsDialogOpen } = useCreateProject();

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6 text-base-foreground">
                Project Templates
            </h2>
            
            <div className="space-y-3">
                <TemplateCard
                    name="Empty Project"
                    description="Start with a blank canvas"
                    icon={IoDocumentText}
                    iconClassName="bg-primary"
                    onClick={() => setIsDialogOpen(true)}
                />
                <TemplateCard
                    name="3D Scene"
                    description="Basic 3D scene template"
                    icon={IoColorPalette}
                    iconClassName="bg-accent"
                    onClick={() => setIsDialogOpen(true)}
                />
            </div>
        </div>
    );
};


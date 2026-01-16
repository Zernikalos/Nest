import React from 'react';
import { IoDocumentText, IoColorPalette } from 'react-icons/io5';
import { TemplateCard } from './TemplateCard';
import { useProjectUIStore } from '@/stores/useProjectUIStore';

export const ProjectTemplates: React.FC = () => {
    const { setIsCreateDialogOpen } = useProjectUIStore();

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
                    onClick={() => setIsCreateDialogOpen(true)}
                />
                <TemplateCard
                    name="3D Scene"
                    description="Basic 3D scene template"
                    icon={IoColorPalette}
                    iconClassName="bg-accent"
                    onClick={() => setIsCreateDialogOpen(true)}
                />
            </div>
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProject } from '@/hooks/useProject';
import { ProjectAssetsList } from './ProjectAssetsList';

export const ProjectEditView: React.FC = () => {
    const { projectMetadata, projectFilePath, isLoading, error } = useProject();
    const [projectName, setProjectName] = useState(projectMetadata?.name || '');

    useEffect(() => {
        if (projectMetadata?.name) {
            setProjectName(projectMetadata.name);
        }
    }, [projectMetadata]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value);
        // TODO: Implementar guardado del nombre del proyecto
    };

    if (isLoading) {
        return (
            <div className="h-full overflow-auto bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading project...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full overflow-auto bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-error">Error loading project: {error instanceof Error ? error.message : 'Unknown error'}</p>
                </div>
            </div>
        );
    }

    if (!projectMetadata) {
        return null;
    }

    return (
        <div className="h-full overflow-auto bg-base-100">
            <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-base-foreground mb-2">
                        Project Settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Configure your project settings and manage assets
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Project Name Section */}
                    <Card className="bg-base-100 border-base-300">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                                General
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label 
                                    htmlFor="project-name"
                                    className="text-sm font-medium text-base-foreground"
                                >
                                    Project Name
                                </Label>
                                <Input
                                    id="project-name"
                                    value={projectName}
                                    onChange={handleNameChange}
                                    placeholder="Enter project name"
                                    className="max-w-md"
                                />
                            </div>
                            
                            {projectFilePath && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Project Path
                                    </Label>
                                    <div className="text-sm text-muted-foreground font-mono bg-base-200 px-3 py-2 rounded-md border border-base-300 max-w-md">
                                        {projectFilePath}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Assets Section */}
                    <Card className="bg-base-100 border-base-300">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                                Input Assets
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProjectAssetsList />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};


import React from 'react';
import { IoAdd, IoFolderOpen } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo/Logo';

interface NewProjectHeaderProps {
    onNewProject: () => void;
}

export const NewProjectHeader: React.FC<NewProjectHeaderProps> = ({ onNewProject }) => {
    return (
        <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
                <Logo />
                <h1 className="text-5xl font-bold text-primary">
                    Zernikalos Nest
                </h1>
            </div>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
                Create stunning 3D experiences with our powerful visual editor. 
                Build, animate, and deploy interactive content effortlessly.
            </p>
            
            <div className="flex gap-4 justify-center">
                <Button 
                    size="lg" 
                    onClick={onNewProject}
                    className="px-6 py-2 text-base font-medium"
                >
                    <IoAdd className="w-4 h-4 mr-2" />
                    New Project
                </Button>
                <Button 
                    size="lg" 
                    variant="outline"
                    className="px-6 py-2 text-base font-medium"
                >
                    <IoFolderOpen className="w-4 h-4 mr-2" />
                    Open Project
                </Button>
            </div>
        </div>
    );
};

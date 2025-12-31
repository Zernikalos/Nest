import React, { useCallback } from 'react';
import { IoAdd, IoFolderOpen } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo/Logo';
import { useProject } from '@/hooks/useProject';
import { useProjectUIStore } from '@/stores/useProjectUIStore';
import { useNavigate } from '@/keepaliverouter';
import { CreateProjectDialog } from './CreateProjectDialog';

export const ProjectHeader: React.FC = () => {
    const { createProjectWithDialog, openProject } = useProject();
    const { isCreateDialogOpen, isCreating, creationError, setIsCreateDialogOpen } = useProjectUIStore();
    const navigate = useNavigate();
    
    const handleOpen = useCallback(async () => {
        try {
            // Show Electron dialog
            const filePath = await window.NativeZernikalos?.showOpenProjectDialog();
            
            if (!filePath) {
                return;
            }
            
            // Open project (now uses ProjectManager internally)
            await openProject(filePath);
            
            // Navigate to projects page (which will show ProjectEditView if project is open)
            navigate("/projects");
        } catch (error) {
            console.error('Failed to open project:', error);
            // TODO: Show error notification
        }
    }, [openProject, navigate]);
    
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
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="px-6 py-2 text-base font-medium"
                >
                    <IoAdd className="w-4 h-4 mr-2" />
                    New Project
                </Button>
                <Button 
                    size="lg" 
                    variant="outline"
                    className="px-6 py-2 text-base font-medium"
                    onClick={handleOpen}
                >
                    <IoFolderOpen className="w-4 h-4 mr-2" />
                    Open Project
                </Button>
            </div>
            
            <CreateProjectDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onCreate={createProjectWithDialog}
                isCreating={isCreating}
                error={creationError}
            />
        </div>
    );
};


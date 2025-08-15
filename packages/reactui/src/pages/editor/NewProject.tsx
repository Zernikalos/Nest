import React from 'react';

import { Button } from '@/components/ui/button';

interface NewProjectProps {
    onNewProject: () => void;
}

export const NewProject: React.FC<NewProjectProps> = ({ onNewProject }) => {
    return (
        <div className="flex h-full justify-center items-center">
            <Button variant="default" onClick={onNewProject}>
                New Project
            </Button>
        </div>
    );
};



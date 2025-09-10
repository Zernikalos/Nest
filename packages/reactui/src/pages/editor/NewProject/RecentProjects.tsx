import React from 'react';
import { IoFolderOpen } from 'react-icons/io5';
import { Card, CardContent } from '@/components/ui/card';

export const RecentProjects: React.FC = () => {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-6 text-foreground">
                Recent Projects
            </h3>
            
            <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-muted">
                        <IoFolderOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        No recent projects found. Create a new project to get started.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

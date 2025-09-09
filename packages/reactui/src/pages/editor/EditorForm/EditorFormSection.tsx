import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditorFormSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    orientation?: 'rows' | 'columns';
}

export const EditorFormSection: React.FC<EditorFormSectionProps> = ({ 
    title, 
    children, 
    className = "w-full",
    orientation = 'rows',
}) => {
    const contentClassName = orientation === 'columns' 
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
        : 'space-y-4';

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className={contentClassName}>
                {children}
            </CardContent>
        </Card>
    );
};

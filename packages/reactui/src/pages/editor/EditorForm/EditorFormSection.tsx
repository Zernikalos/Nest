import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EditorFormSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    orientation?: 'rows' | 'columns';
    icon?: React.ReactNode;
    badge?: string;
}

export const EditorFormSection: React.FC<EditorFormSectionProps> = ({ 
    title, 
    children, 
    className = "w-full",
    orientation = 'rows',
    icon,
    badge
}) => {
    const contentClassName = orientation === 'columns' 
        ? 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4 items-start'
        : 'space-y-4';

    return (
        <Card className={`${className} border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:border-border`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {icon && (
                            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                {icon}
                            </div>
                        )}
                        <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
                    </div>
                    {badge && (
                        <Badge variant="secondary" className="text-xs font-medium">
                            {badge}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className={contentClassName}>
                {children}
            </CardContent>
        </Card>
    );
};

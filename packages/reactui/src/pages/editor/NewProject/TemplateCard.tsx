import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateCardProps {
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    iconClassName: string;
    onClick: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ 
    name, 
    description, 
    icon: IconComponent, 
    iconClassName, 
    onClick 
}) => {
    return (
        <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-base-100 border-base-300 hover:bg-base-200"
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClassName}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-base text-base-foreground">
                            {name}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            {description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
};

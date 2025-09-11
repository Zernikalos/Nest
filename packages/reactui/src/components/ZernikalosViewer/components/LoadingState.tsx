import React from 'react';

interface LoadingStateProps {
    className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className = '' }) => (
    <div className={`absolute inset-0 flex items-center justify-center bg-secondary bg-opacity-75 ${className}`}>
        <div className="text-center">
            <p className="text-secondary-foreground">Initializing Zernikalos...</p>
        </div>
    </div>
);

import React from 'react';

interface ErrorStateProps {
    error: string;
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    error,
    width = '100%',
    height = '100%',
    className = ''
}) => (
    <div
        className={`flex items-center justify-center bg-red-50 text-red-600 border border-red-200 rounded ${className}`}
        style={{ width, height }}
    >
        <div className="text-center">
            <p className="font-semibold">Error loading Zernikalos viewer</p>
            <p className="text-sm mt-1">{error}</p>
        </div>
    </div>
);

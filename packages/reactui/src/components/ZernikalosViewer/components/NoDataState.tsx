import React from 'react';

interface NoDataStateProps {
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const NoDataState: React.FC<NoDataStateProps> = ({
    width = '100%',
    height = '100%',
    className = ''
}) => (
    <div
        className={`flex items-center justify-center bg-gray-50 text-gray-500 border border-gray-200 rounded ${className}`}
        style={{ width, height }}
    >
        <div className="text-center">
            <p>No scene data provided</p>
            <p className="text-sm mt-1">Please provide scene data to render</p>
        </div>
    </div>
);

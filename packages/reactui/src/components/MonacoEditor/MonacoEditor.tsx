import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { type Theme } from '../../lib/themes';
import oceanicNextTheme from './themes/oceanic-next.json';

interface MonacoEditorProps {
    value: string;
    language?: string;
    theme?: Theme; // Our app theme name
    height?: string;
    readOnly?: boolean;
    onChange?: (value: string | undefined) => void;
    options?: any;
}

// Function to transform our themes to Monaco themes
const transformThemeToMonaco = (appTheme: Theme): string => {
    const themeMap: Record<Theme, string> = {
        'default': 'vs',           // Light theme
        'default-dark': 'vs-dark', // Dark theme
        'ocean': 'oceanic-next',   // Custom Ocean theme
        'forest': 'vs-dark',       // Forest is dark
        'sunset': 'vs-dark',       // Sunset is dark
        'purple': 'vs-dark',       // Purple is dark
        'rose': 'vs-dark'          // Rose is dark
    };
    
    return themeMap[appTheme] || 'vs-dark';
};

// Function to register custom themes with Monaco
const registerCustomThemes = (monaco: any) => {
    // Register the Oceanic Next theme
    monaco.editor.defineTheme('oceanic-next', oceanicNextTheme as any);
};

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
    value,
    language = 'json',
    theme = 'default-dark', // Default to dark theme
    height = '400px',
    readOnly = false,
    onChange,
    options = {}
}) => {
    // Transform our theme to Monaco theme
    const monacoTheme = transformThemeToMonaco(theme);
    
    const defaultOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        automaticLayout: true,
        readOnly,
        ...options
    };

    return (
        <Editor
            data-component="MonacoEditor"
            height={height}
            language={language}
            theme={monacoTheme}
            value={value}
            onChange={onChange}
            options={defaultOptions}
            beforeMount={registerCustomThemes}
        />
    );
};

import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
    value: string;
    language?: string;
    theme?: string;
    height?: string;
    readOnly?: boolean;
    onChange?: (value: string | undefined) => void;
    options?: any;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
    value,
    language = 'json',
    theme = 'vs-dark',
    height = '400px',
    readOnly = false,
    onChange,
    options = {}
}) => {
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
            height={height}
            language={language}
            theme={theme}
            value={value}
            onChange={onChange}
            options={defaultOptions}
        />
    );
};

export default MonacoEditor;

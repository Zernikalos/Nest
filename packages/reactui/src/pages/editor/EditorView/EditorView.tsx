import React from 'react';

import { NestEditorProvider } from '../providers/NestEditorProvider';
import { EditorViewLayout } from './EditorViewLayout';

export const EditorView: React.FC = () => {
    return (
        <NestEditorProvider>
            <EditorViewLayout />
        </NestEditorProvider>
    );
};

import React from 'react';

import { NestEditorProvider } from './providers/NestEditorProvider';
import { EditorLayout } from '@/pages/editor/layouts/EditorLayout';

export const EditorPage: React.FC = () => {
    return (
        <NestEditorProvider>
            <EditorLayout />
        </NestEditorProvider>
    );
};

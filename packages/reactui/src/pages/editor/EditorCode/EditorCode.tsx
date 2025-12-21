import React, { use } from 'react';
import { MonacoEditor } from '@/components/MonacoEditor';
import { NestEditorContext, type NestEditorContextType } from '../providers/NestEditorContext.tsx';
import { useAppTheme } from '@/providers/Theme';
import { sanitizeEditableObject } from './sanitizeEditableObject';
import { editorLogger } from '../editorLogger';

export const EditorCode: React.FC = () => {
    const editorContext = use(NestEditorContext) as NestEditorContextType;

    if (!editorContext) {
        return null;
    }

    const { zkResult, selectedZObject } = editorContext;

    const { theme: appTheme } = useAppTheme();

    const editableObject = sanitizeEditableObject(zkResult, selectedZObject);

    // Log object directly to console for inspection (passed as data, not context, to preserve expandability)
    if (editableObject) {
        editorLogger.debug('Editable object', undefined, editableObject);
    }

    if (!editableObject) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">
                    No data available to display
                </span>
            </div>
        );
    }

    return (
        <MonacoEditor
            value={JSON.stringify(editableObject, null, 2)}
            language="json"
            height="100%"
            readOnly={true}
            theme={appTheme}
        />
    );
};

import React from 'react';
import { MonacoEditor } from '@/components/MonacoEditor';
import { useNestEditorContext } from '../providers/NestEditorContext';
import { useAppTheme } from '@/providers/Theme';
import { sanitizeEditableObject } from './sanitizeEditableObject';

export const EditorCode: React.FC = () => {
    const { zkResult, selectedZObject } = useNestEditorContext();
    const { theme: appTheme } = useAppTheme();

    const editableObject = sanitizeEditableObject(zkResult, selectedZObject);

    console.log(editableObject);

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

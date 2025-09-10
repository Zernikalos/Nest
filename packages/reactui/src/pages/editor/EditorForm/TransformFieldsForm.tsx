import React from 'react';
import { EditorFormSection } from './EditorFormSection';
import { MathInputEditorItem } from './EditorFormItems';

export const TransformFieldsForm: React.FC = () => {
    return (
        <EditorFormSection title="Transform" orientation="columns">
            <MathInputEditorItem
                id="position"
                label="Position"
                type="vec3"
                namePrefix="transform.position"
                orientation="rows"
            />
            
            <MathInputEditorItem
                id="rotation"
                label="Rotation"
                type="quat"
                namePrefix="transform.rotation"
                orientation="rows"
            />
            
            <MathInputEditorItem
                id="scale"
                label="Scale"
                type="vec3"
                namePrefix="transform.scale"
                orientation="rows"
            />
        </EditorFormSection>
    );
};

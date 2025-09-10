import React from 'react';
import { EditorFormSection } from './EditorFormSection';
import { MathInputEditorItem } from './EditorFormItems';
import { Move3D, RotateCcw } from 'lucide-react';
import { MdOutlineExpand } from 'react-icons/md';

export const TransformFieldsForm: React.FC = () => {
    return (
        <EditorFormSection 
            title="Transform" 
            orientation="rows"
            icon={<Move3D className="w-4 h-4" />}
            badge="3D Transform"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 mb-3">
                        <Move3D className="w-4 h-4 text-muted-foreground" />
                        Position
                    </div>
                    <MathInputEditorItem
                        id="position"
                        label=""
                        type="vec3"
                        namePrefix="transform.position"
                        orientation="rows"
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 mb-3">
                        <RotateCcw className="w-4 h-4 text-muted-foreground" />
                        Rotation
                    </div>
                    <MathInputEditorItem
                        id="rotation"
                        label=""
                        type="quat"
                        namePrefix="transform.rotation"
                        orientation="rows"
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 mb-3">
                        <MdOutlineExpand className="w-4 h-4 text-muted-foreground" />
                        Scale
                    </div>
                    <MathInputEditorItem
                        id="scale"
                        label=""
                        type="vec3"
                        namePrefix="transform.scale"
                        orientation="rows"
                    />
                </div>
            </div>
        </EditorFormSection>
    );
};

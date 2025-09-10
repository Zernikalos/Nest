import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { zernikalos } from '@/lib/zernikalos';
import { EditorFormSection } from './EditorFormSection';
import { InputEditorItem } from './EditorFormItems';
import { Box } from 'lucide-react';

interface FormData {
    name: string;
    transform: {
        position: { x: number; y: number; z: number };
        rotation: { w: number; x: number; y: number; z: number };
        scale: { x: number; y: number; z: number };
    };
}

interface CommonFieldsFormProps {
    zObject: zernikalos.objects.ZObject;
    register: UseFormRegister<FormData>;
}

export const CommonFieldsForm: React.FC<CommonFieldsFormProps> = ({ zObject, register }) => {
    return (
        <EditorFormSection 
            title="ZObject Properties" 
            icon={<Box className="w-4 h-4" />}
            badge="3D Object"
        >
            <InputEditorItem
                id="refId"
                label="Reference ID"
                value={zObject.refId}
                readOnly
                disabled
            />
            
            <InputEditorItem
                id="name"
                label="Name"
                register={register('name')}
                placeholder="Enter object name"
            />
        </EditorFormSection>
    );
};

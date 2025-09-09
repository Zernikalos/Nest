import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { merge } from 'lodash';
import { zernikalos } from '@/lib/zernikalos';
import { useNestEditorContext } from '../providers/NestEditorContext';
import { EditorFormSection } from './EditorFormSection';
import { InputEditorItem } from './InputEditorItem';
import { MathInputEditorItem } from './MathInputEditorItem';

interface FormZObjectProps {
    zObject: zernikalos.objects.ZObject;
}

interface FormData {
    name: string;
    transform: {
        position: { x: number; y: number; z: number };
        rotation: { w: number; x: number; y: number; z: number };
        scale: { x: number; y: number; z: number };
    };
}

const buildDefaults = (zObj: zernikalos.objects.ZObject): FormData => ({
    name: zObj.name,
    transform: {
        position: {
            x: zObj.transform.position.x,
            y: zObj.transform.position.y,
            z: zObj.transform.position.z,
        },
        rotation: {
            w: zObj.transform.rotation.w,
            x: zObj.transform.rotation.x,
            y: zObj.transform.rotation.y,
            z: zObj.transform.rotation.z,
        },
        scale: {
            x: zObj.transform.scale.x,
            y: zObj.transform.scale.y,
            z: zObj.transform.scale.z,
        },
    },
});

export const FormZObject: React.FC<FormZObjectProps> = ({ zObject }) => {
    const { notifyChange } = useNestEditorContext();
    
    const methods = useForm<FormData>({
        defaultValues: buildDefaults(zObject),
    });

    const { register, watch, reset } = methods;

    // Reset form when selected object changes
    useEffect(() => {
        reset(buildDefaults(zObject));
    }, [zObject, reset]);

    // Subscribe to form changes to update the engine object and notify changes
    useEffect(() => {
        const subscription = watch((values) => {
            merge(zObject, {
                name: values.name,
                transform: values.transform,
            });
            notifyChange();
        });
        return () => subscription.unsubscribe();
    }, [watch, zObject, notifyChange]);

    return (
        <FormProvider {...methods}>
            <div className="space-y-4">
                <EditorFormSection title="ZObject Properties">
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
            </div>
        </FormProvider>
    );
}; 
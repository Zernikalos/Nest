import React, { use, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { merge } from 'lodash';
import { zernikalos } from '@/lib/zernikalos';
import { CommonFieldsForm } from './CommonFieldsForm';
import { TransformFieldsForm } from './TransformFieldsForm';
import { NestEditorContext, type NestEditorContextType } from '../providers/NestEditorContext.tsx';

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
    const { notifyChange } = use(NestEditorContext) as NestEditorContextType;
    
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
            <div className="space-y-6 p-1">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-base-foreground/90 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                        Object Inspector
                    </h3>
                    <p className="text-sm text-muted-foreground">Edit 3D object properties and transformations</p>
                </div>
                <div className="space-y-4">
                    <CommonFieldsForm zObject={zObject} register={register} />
                    <TransformFieldsForm />
                </div>
            </div>
        </FormProvider>
    );
}; 
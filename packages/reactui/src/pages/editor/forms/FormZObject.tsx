import React, { useState } from 'react';
import { zernikalos } from '@/lib/zernikalos';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNestEditorContext } from '../providers/NestEditorContext';

interface FormZObjectProps {
    zObject: zernikalos.objects.ZObject;
}

export const FormZObject: React.FC<FormZObjectProps> = ({ zObject }) => {
    const { notifyChange } = useNestEditorContext();
    const [localName, setLocalName] = useState(zObject.name);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        setLocalName(newName);
        zObject.name = newName;
        notifyChange(); // Notify change to regenerate the tree
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>ZObject Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="refId">Reference ID</Label>
                    <Input
                        id="refId"
                        value={zObject.refId}
                        readOnly
                        disabled
                        className="bg-muted"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={localName}
                        onChange={handleNameChange}
                        placeholder="Enter object name"
                    />
                </div>
            </CardContent>
        </Card>
    );
}; 
import React from 'react';
import { zernikalos } from '@zernikalos/zernikalos';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormZObjectProps {
    zObject: zernikalos.objects.ZObject;
    onNameChange?: (newName: string) => void;
}

const FormZObject: React.FC<FormZObjectProps> = ({ zObject, onNameChange }) => {
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        if (onNameChange) {
            onNameChange(newName);
        }
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
                        value={zObject.name}
                        onChange={handleNameChange}
                        placeholder="Enter object name"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default FormZObject; 
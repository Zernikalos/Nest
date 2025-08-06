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
    const [localName, setLocalName] = React.useState(zObject.name);

    // Update local name when zObject changes
    React.useEffect(() => {
        setLocalName(zObject.name);
    }, [zObject.name]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalName(event.target.value);
    };

    const handleNameBlur = () => {
        if (localName !== zObject.name && onNameChange) {
            onNameChange(localName);
        }
    };

    const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.currentTarget.blur();
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
                        value={localName}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        onKeyDown={handleNameKeyDown}
                        placeholder="Enter object name"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default FormZObject; 
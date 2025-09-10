import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type MathType = 'vec2' | 'vec3' | 'vec4' | 'quat' | 'euler' | 'rgba';

interface MathInputEditorItemProps {
    id: string;
    label: string;
    type: MathType;
    namePrefix: string;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
    orientation?: 'columns' | 'rows';
}

const getComponentLabels = (type: MathType): string[] => {
    switch (type) {
        case 'vec2':
            return ['X', 'Y'];
        case 'vec3':
            return ['X', 'Y', 'Z'];
        case 'vec4':
            return ['X', 'Y', 'Z', 'W'];
        case 'quat':
            return ['W', 'X', 'Y', 'Z'];
        case 'euler':
            return ['X', 'Y', 'Z'];
        case 'rgba':
            return ['R', 'G', 'B', 'A'];
        default:
            return [];
    }
};


const getComponentKeys = (type: MathType): string[] => {
    switch (type) {
        case 'vec2':
            return ['x', 'y'];
        case 'vec3':
            return ['x', 'y', 'z'];
        case 'vec4':
            return ['x', 'y', 'z', 'w'];
        case 'quat':
            return ['w', 'x', 'y', 'z'];
        case 'euler':
            return ['x', 'y', 'z'];
        case 'rgba':
            return ['r', 'g', 'b', 'a'];
        default:
            return [];
    }
};

export const MathInputEditorItem: React.FC<MathInputEditorItemProps> = ({
    id,
    label,
    type,
    namePrefix,
    readOnly = false,
    disabled = false,
    className,
    orientation = 'columns'
}) => {
    const { register } = useFormContext();

    const componentLabels = getComponentLabels(type);
    const componentKeys = getComponentKeys(type);

    // Automatically apply bg-muted when disabled or readOnly
    const inputClassName = disabled || readOnly
        ? `bg-muted ${className || ''}`.trim()
        : className;

    const containerClassName = orientation === 'columns' ? 'flex gap-3' : 'flex flex-col gap-2';
    const itemWrapperClassName = orientation === 'columns' ? 'flex-1 min-w-0' : 'w-full';

    return (
        <div className={orientation === 'rows' ? 'space-y-1' : 'space-y-3'}>
            {label && (
                <Label htmlFor={id} className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                    {label}
                </Label>
            )}
            <div className={containerClassName}>
                {componentKeys.map((key, index) => {
                    return (
                        <div key={key} className={itemWrapperClassName}>
                            <div className="flex items-stretch w-full group">
                                <span className="px-2 py-2 bg-muted text-muted-foreground border border-border rounded-l-md text-xs font-semibold select-none flex items-center justify-center w-8 transition-all duration-200 group-hover:shadow-sm">
                                    {componentLabels[index]}
                                </span>
                                <Input
                                    id={`${id}-${key}`}
                                    type="number"
                                    step="any"
                                    inputMode="decimal"
                                    { ...register(`${namePrefix}.${key}`, { valueAsNumber: true }) }
                                    readOnly={readOnly}
                                    disabled={disabled}
                                    className={`${inputClassName ? inputClassName + ' ' : ''}text-center rounded-l-none px-3 py-2 text-sm font-mono transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 hover:border-border/80 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

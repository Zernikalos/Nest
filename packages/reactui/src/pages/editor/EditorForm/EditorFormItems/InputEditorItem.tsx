import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputEditorItemProps {
    id: string;
    label: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    register?: UseFormRegisterReturn;
    placeholder?: string;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
}

export const InputEditorItem: React.FC<InputEditorItemProps> = ({
    id,
    label,
    value,
    onChange,
    register,
    placeholder,
    readOnly = false,
    disabled = false,
    className
}) => {
    // Automatically apply bg-muted when disabled or readOnly
    const inputClassName = disabled || readOnly 
        ? `bg-muted ${className || ''}`.trim()
        : className;

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                {...(register || {})}
                value={register ? undefined : value}
                onChange={register ? undefined : onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                className={inputClassName}
            />
        </div>
    );
};

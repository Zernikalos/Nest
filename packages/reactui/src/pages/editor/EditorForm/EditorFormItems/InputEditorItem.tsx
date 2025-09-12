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
    icon?: React.ReactNode;
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
    className,
    icon
}) => {
    // Automatically apply bg-muted when disabled or readOnly
    const inputClassName = disabled || readOnly 
        ? `bg-muted ${className || ''}`.trim()
        : className;

    return (
        <div className="space-y-3">
            <Label htmlFor={id} className="text-sm font-medium text-base-foreground/90 flex items-center gap-2">
                {icon ? (
                    <div className="flex items-center justify-center w-4 h-4">
                        {icon}
                    </div>
                ) : (
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                )}
                {label}
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    {...(register || {})}
                    value={register ? undefined : value}
                    onChange={register ? undefined : onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    disabled={disabled}
                    className={`${inputClassName || ''} transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 hover:border-base-300/80 font-mono text-sm`}
                />
                {readOnly && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

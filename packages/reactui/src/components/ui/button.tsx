import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px] aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
                destructive:
                    'bg-error text-error-foreground shadow-xs hover:bg-error/90 focus-visible:ring-error/20 dark:focus-visible:ring-error/40 dark:bg-error/60',
                outline:
                    'border border-base-300 bg-base-100 text-base-foreground shadow-xs hover:bg-base-200 hover:text-base-foreground hover:border-base-400 dark:bg-base-200 dark:border-base-300 dark:hover:bg-base-300',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
                ghost: 'text-base-foreground hover:bg-base-200 hover:text-base-foreground dark:hover:bg-base-300',
                link: 'text-primary underline-offset-4 hover:underline',
                success:
                    'bg-success text-success-foreground shadow-xs hover:bg-success/90',
                warning:
                    'bg-warning text-warning-foreground shadow-xs hover:bg-warning/90',
                info:
                    'bg-info text-info-foreground shadow-xs hover:bg-info/90',
                neutral:
                    'bg-neutral text-neutral-foreground shadow-xs hover:bg-neutral/90',
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
                lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
                icon: 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };

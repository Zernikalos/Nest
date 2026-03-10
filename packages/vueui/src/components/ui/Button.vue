<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 outline-none focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px] aria-invalid:ring-error/20 aria-invalid:border-error',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80 active:scale-95',
        destructive:
          'bg-error text-error-foreground shadow-xs hover:bg-error/90 active:bg-error/80 active:scale-95 focus-visible:ring-error/20',
        outline:
          'border border-base-300 bg-base-100 text-base-foreground shadow-xs hover:bg-base-200 hover:border-base-400 active:bg-base-300 active:scale-95',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70 active:scale-95',
        ghost:
          'text-base-foreground hover:bg-base-200 active:bg-base-300 active:scale-95',
        link: 'text-primary underline-offset-4 hover:underline active:text-primary/80',
        success:
          'bg-success text-success-foreground shadow-xs hover:bg-success/90 active:bg-success/80 active:scale-95',
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

const props = withDefaults(
  defineProps<{
    class?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }>(),
  { variant: 'default', size: 'default' }
);
</script>

<template>
  <button
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)"
    data-slot="button"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

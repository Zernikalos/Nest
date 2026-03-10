<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-error text-error-foreground',
        outline: 'text-base-foreground border-base-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

const props = withDefaults(
  defineProps<{ class?: string; variant?: BadgeVariants['variant'] }>(),
  { variant: 'default' }
);
</script>

<template>
  <span
    data-slot="badge"
    :class="cn(badgeVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </span>
</template>

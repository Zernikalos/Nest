<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Badge from '@/components/ui/Badge.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    className?: string;
    orientation?: 'rows' | 'columns';
    badge?: string;
  }>(),
  { className: 'w-full', orientation: 'rows' }
);

const cardClass = computed(() =>
  cn(
    props.className,
    'border-base-300/50 bg-base-200 transition-all duration-200 hover:shadow-lg hover:border-base-300'
  )
);
</script>

<template>
  <Card :class="cardClass">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            v-if="$slots.icon"
            class="p-1.5 rounded-md bg-primary/10 text-primary"
          >
            <slot name="icon" />
          </div>
          <CardTitle class="text-base font-semibold tracking-tight">
            {{ title }}
          </CardTitle>
        </div>
        <Badge v-if="badge" variant="secondary" class="text-xs font-medium">
          {{ badge }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent
      :class="
        props.orientation === 'columns'
          ? 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4 items-start'
          : 'space-y-4'
      "
    >
      <slot />
    </CardContent>
  </Card>
</template>

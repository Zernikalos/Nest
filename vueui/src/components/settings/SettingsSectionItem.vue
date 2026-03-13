<script setup lang="ts">
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardContent from '@/components/ui/CardContent.vue';
</script>

<template>
  <Card class="bg-base-200">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <slot name="icon" />
        {{ title }}
      </CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <slot />
    </CardContent>
  </Card>
</template>

<script lang="ts">
export default {
  name: 'SettingsSectionItem',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
};
</script>

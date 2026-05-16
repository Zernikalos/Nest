<script setup lang="ts">
import { computed } from 'vue';
import { getWidgetComponent } from '@/editor/widgetRegistry';

const props = defineProps<{
  widgetId: string;
}>();

const component = computed(() => getWidgetComponent(props.widgetId));
</script>

<template>
  <component :is="component" v-if="component" />
</template>

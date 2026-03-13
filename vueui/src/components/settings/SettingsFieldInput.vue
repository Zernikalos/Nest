<script setup lang="ts">
import Input from '@/components/ui/Input.vue';
import SettingsFieldBase from './SettingsFieldBase.vue';
</script>

<template>
  <SettingsFieldBase
    :title="title"
    :description="description"
    :layout="layout"
  >
    <div class="flex items-center gap-3">
      <Input
        :type="type"
        :min="min"
        :max="max"
        :value="String(value)"
        :placeholder="placeholder"
        :class="inputClass"
        @input="(e: Event) => $emit('update:value', (e.target as HTMLInputElement).value)"
      />
      <span v-if="suffix" class="text-sm text-muted-foreground">{{ suffix }}</span>
    </div>
  </SettingsFieldBase>
</template>

<script lang="ts">
export default {
  name: 'SettingsFieldInput',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    placeholder: { type: String, default: '' },
    inputClass: { type: String, default: '' },
    suffix: { type: String, default: '' },
    layout: { type: String as () => 'horizontal' | 'vertical', default: 'vertical' },
  },
  emits: ['update:value'],
};
</script>

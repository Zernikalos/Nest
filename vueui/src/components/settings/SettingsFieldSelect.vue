<script setup lang="ts">
import Select from '@/components/ui/Select.vue';
import SelectItem from '@/components/ui/SelectItem.vue';
import SettingsFieldBase from './SettingsFieldBase.vue';

defineProps<{
  title: string;
  description: string;
  modelValue: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  selectClass?: string;
  layout?: 'horizontal' | 'vertical';
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <SettingsFieldBase
    :title="title"
    :description="description"
    :layout="layout ?? 'vertical'"
  >
    <Select
      :model-value="modelValue"
      :placeholder="placeholder ?? 'Select option'"
      :class="selectClass ?? 'w-[300px]'"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <SelectItem
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </SelectItem>
    </Select>
  </SettingsFieldBase>
</template>

<script setup lang="ts">
import Switch from '@/components/ui/Switch.vue';
import SettingsFieldBase from './SettingsFieldBase.vue';
</script>

<template>
  <SettingsFieldBase :title="title" :description="description">
    <Switch
      :checked="checked"
      @update:checked="$emit('update:checked', $event)"
    />
  </SettingsFieldBase>
</template>

<script lang="ts">
export default {
  name: 'SettingsFieldSwitch',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    checked: { type: Boolean, default: false },
  },
  emits: ['update:checked'],
};
</script>

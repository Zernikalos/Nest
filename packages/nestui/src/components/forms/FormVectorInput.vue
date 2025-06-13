<template>
  <div class="join w-full">
    <template v-for="key in keys" :key="key">
      <span class="join-item font-mono btn btn-ghost pointer-events-none border bg-base-300" :class="`btn-${props.size}`">
        {{ key.toUpperCase() }}
      </span>
      <input
        v-model.number="data[key]"
        type="number"
        class="input w-full join-item text-center font-mono"
        :class="inputSize"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: object
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  type: "vec2" | "vec3" | "vec4" | "quat"
}>(), {
    size: "sm"
})

const emit = defineEmits(["update:modelValue"])
const data = useVModel(props, "modelValue", emit)
const inputSize = computed(() => `input-${props.size}`)

const keys = computed(() => {
    const val = props.modelValue;
    if (typeof val !== 'object' || val === null) return [];

    // Order for Quaternions
    if (props.type == "quat") {
        return ['w', 'x', 'y', 'z']
    }
    // Order for Vector4
    if (props.type == "vec4") {
        return ['x', 'y', 'z', 'w']
    }
    // Order for Vector3
    if (props.type == "vec3") {
        return ['x', 'y', 'z'];
    }
    // Order for Vector2
    if (props.type == "vec2") {
        return ['x', 'y'];
    }
    
    return [];
});
</script>

<style scoped>
@reference "@nestui/assets/main.css";

.input-sm {
    @apply input-sm;
}
.input-md {
    @apply input-md;
}
.input-lg {
    @apply input-lg;
}
.input-xl {
    @apply input-xl;
}

</style>
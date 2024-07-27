<template>
    <div class="join join-horizontal py-0.5">
        <span class="join-item text-style bg-base-300">
            {{label}}
        </span>
        <input type="number" lang="en" id="vector" v-model="data"  class="join-item bg-base-200 coordinate-input text-style input-borders">
    </div>
</template>

<script setup lang="ts">

import {useVModel} from "@vueuse/core";

const props = defineProps<{
    label: string,
    size: number,
    modelValue: number
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

</script>

<style scoped>
.text-style {
    @apply font-mono text-sm p-2 items-center text-center text-base-content;
}

.borders {
    @apply border border-e-0 rounded-s-md;
}

.coordinate-input {
    @apply cursor-ns-resize;
}

.input-borders {
    @apply rounded-e-md focus:ring-blue-500 focus:border-blue-500;
}

</style>
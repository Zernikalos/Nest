<template>
    <div class="join join-horizontal">
        <span class="join-item text-style borders">
            {{label}}
        </span>
        <input type="number" lang="en" id="vector" v-model="data"  class="join-item coordinate-input text-style input-borders">
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
    @apply font-mono text-sm p-2 items-center text-center;
}

.borders {
    @apply border border-e-0 rounded-s-md;
}

.coordinate-input {
    @apply cursor-ns-resize;
}

.input-borders {
    @apply rounded-e-md border focus:ring-blue-500 focus:border-blue-500;
}

</style>
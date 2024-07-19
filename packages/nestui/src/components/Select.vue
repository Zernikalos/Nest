<template>
    <label class="form-control w-full">
        <div class="label">
            <span class="label-text">{{label}}</span>
        </div>
        <select class="selector" v-model="data">
            <option :value="option" v-for="option in props.options">
                {{option}}
            </option>
        </select>
    </label>

</template>

<script setup lang="ts">

import {useVModel} from "@vueuse/core";

const props = defineProps<{
    label?: string,
    options: string[],
    modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, "modelValue", emit)

</script>

<style scoped>
.selector {
    @apply select select-bordered rounded
}
</style>

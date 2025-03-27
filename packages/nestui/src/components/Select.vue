<template>
    <label class="form-control w-full">
        <div class="label">
            <span class="label-text">{{ label }}</span>
        </div>
        <select
            v-model="data"
            class="selector"
        >
            <option
                v-for="(option, index) in props.options"
                :key="index"
                :value="option"
            >
                {{ option }}
            </option>
        </select>
    </label>
</template>

<script setup lang="ts">

import {useVModel} from "@vueuse/core"

const props = defineProps<{
    label?: string,
    options: string[],
    modelValue: string
}>()

const emit = defineEmits(["update:modelValue"])
const data = useVModel(props, "modelValue", emit)

</script>

<style scoped>
@reference "@nestui/assets/main.css";

.selector {
    @apply select rounded
}
</style>

<template>
    <label class="form-control w-full">
        <div class="label">
            <span class="label-text">{{ label }}</span>
        </div>
        <select
            v-model="data"
            class="selector"
            :class="selectorSize"
        >
            <option
                v-for="(option, index) in props.options"
                :key="index"
                :value="typeof option === 'string' ? option : option.value"
            >
                {{ typeof option === 'string' ? option : option.name }}
            </option>
        </select>
    </label>
</template>

<script setup lang="ts">

import {useVModel} from "@vueuse/core"
import {computed} from "vue"

const props = defineProps<{
    label?: string,
    options: Array<{ name: string, value: string } | string>,
    modelValue: string,
    size?: "xs" | "sm" | "md" | "lg"
}>()

const emit = defineEmits(["update:modelValue"])
const data = useVModel(props, "modelValue", emit)

const selectorSize = computed(() => {
    if (props.size === "md") return ""
    return `select-${props.size}`
})

</script>

<style scoped>
@reference "@nestui/assets/main.css";

.selector {
    @apply select w-full
}

.select-xs {
    @apply select-xs;
}
.select-sm {
    @apply select-sm;
}
.select-md {
    @apply select-md;
}
.select-lg {
    @apply select-lg;
}

</style>

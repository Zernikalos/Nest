<template>
    <label class="form-control w-full">
        <div class="label">
            <span class="label-text">{{label}}</span>
        </div>
        <input v-model="data" type="text" placeholder="" class="input input-bordered rounded w-full" :disabled="disabled" />
    </label>
</template>

<script setup lang="ts">

import {useVModel} from "@vueuse/core";

const props = withDefaults(defineProps<{
    modelValue: string,
    label?: string,
    placeholder?: string,
    disabled?: boolean
}>(),
{
    label: "",
    placeholder: "",
    disabled: false
}
)

const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

</script>

<style scoped>

</style>
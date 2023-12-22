<template>
    <div class="join rounded-none">
        <button
            class="studio-view-selector-btn bi-ui-checks"
            :class="{'!bg-base-200-focus': data =='form'}"
            :disabled="data == 'form'"
            @click="() => data = 'form'"></button>
        <button
            class="studio-view-selector-btn bi-code-square"
            :class="{'!bg-base-200-focus': data =='code'}"
            :disabled="data == 'code'"
            @click="() => data = 'code'"
        ></button>
    </div>
</template>

<script setup lang="ts">
import {useVModel} from "@vueuse/core";

const props = defineProps<{
    modelValue: 'code' | 'form'
}>()
const emit = defineEmits(['update:modelValue'])

const data = useVModel(props, 'modelValue', emit)
</script>

<style scoped>
.studio-view-selector-btn {
    @apply join-item btn btn-xs bg-primary-content
}
</style>
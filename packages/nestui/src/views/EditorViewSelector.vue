<template>
    <div class="join rounded-none">
        <button
            class="view-selector-btn bi-ui-checks"
            :class="{'!bg-base-200-focus': data =='form'}"
            :disabled="data == 'form'"
            @click="() => data = 'form'"
        />
        <button
            class="view-selector-btn bi-code-square"
            :class="{'!bg-base-200-focus': data =='code'}"
            :disabled="data == 'code'"
            @click="() => data = 'code'"
        />
    </div>
</template>

<script setup lang="ts">
import {useVModel} from "@vueuse/core"

const props = defineProps<{
    modelValue: "code" | "form"
}>()
const emit = defineEmits(["update:modelValue"])

const data = useVModel(props, "modelValue", emit)
</script>

<style scoped>
@reference "../assets/main.css";

.view-selector-btn {
    @apply join-item btn btn-xs bg-base-300
}
</style>
<template>
    <div class="toggle-wrapper">
        <label
            for="toogle"
            class="dual-toggle"
        >
            <!-- label -->
            <div
                v-show="props.leftLabel !== undefined"
                class="label-text mr-4"
            >
                {{ props.leftLabel }}
            </div>
            <!-- toggle -->
            <div class="relative">
                <!-- input -->
                <input
                    id="toogle"
                    v-model="toggleValue"
                    type="checkbox"
                    class="sr-only"
                >
                <!-- line -->
                <div class="line" />
                <!-- dot -->
                <div class="dot" />
            </div>
            <!-- label -->
            <div
                v-show="props.rightLabel !== undefined"
                class="label-text"
            >
                {{ props.rightLabel }}
            </div>
        </label>
    </div>
</template>

<script setup lang="ts">

import {ref, watch} from "vue"

const props = defineProps<{
    leftLabel?: string
    leftValue: unknown
    rightLabel?: string
    rightValue: unknown
    selected: any
}>()

const emit = defineEmits(["update:selected"])

const toggleValue = ref(props.selected === props.rightValue)

watch(toggleValue, (newValue) => {
    if (newValue) {
        emit("update:selected", props.rightValue)
    } else {
        emit("update:selected", props.leftValue)
    }
})

</script>

<style scoped>
.toggle-wrapper {
    @apply flex items-center justify-center w-full
}
.dual-toggle {
    @apply flex items-center cursor-pointer
}
.line {
    @apply w-10 h-4 bg-gray-400 rounded-full shadow-inner
}
.dot {
    @apply absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition
}
.label-text {
    @apply ml-3 font-medium
}
input:checked ~ .dot {
    transform: translateX(100%);
    @apply bg-purple-600
}

</style>

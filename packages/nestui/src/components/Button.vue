<template>
    <button class="btn rounded" :class="[btnColor, glassy]" @click="emit('click')">
        <slot></slot>
    </button>
</template>

<script lang="ts" setup>
import {computed, reactive} from "vue";

const props = withDefaults(defineProps<{
    color?: 'primary' | 'info'
    glass?: boolean
}>(), {
    color: "primary",
    glass: false
})

const emit = defineEmits(['click'])
const btnColor = computed(() => {
    switch (props.color) {
        case "primary":
            return "btn-primary"
        case "info":
            return "btn-info"
    }
})
const glassy = computed(() => props.glass ? 'glass' : '')

</script>

<style scoped>

</style>

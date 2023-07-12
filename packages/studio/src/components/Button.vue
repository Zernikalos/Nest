<template>
    <button class="btn btn-blue" @click="$emit('click')">
        <slot></slot>
    </button>
</template>

<script setup>
const emit = defineEmits(['click'])

</script>

<style scoped>
.btn {
    @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
    @apply bg-blue-500 text-white;
}
.btn-blue:hover {
    @apply bg-blue-700;
}
</style>

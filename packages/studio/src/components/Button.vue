<template>
    <button class="btn btn-primary" @click="emit('click')">
        <slot></slot>
    </button>
</template>

<script setup>
const emit = defineEmits(['click'])

</script>

<style scoped>

</style>

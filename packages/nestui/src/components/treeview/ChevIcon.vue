<script setup lang="ts">

const props = defineProps<{
    isOpen: boolean,
    hasChildren: boolean
}>()
</script>

<template>
    <span :class="{
        'bi-chevron-right': !isOpen,
        'bi-chevron-down': isOpen,
        invisible: !hasChildren
    }"></span>
</template>

<style scoped>

</style>
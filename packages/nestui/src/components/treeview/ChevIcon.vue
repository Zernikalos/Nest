<script setup lang="ts">

const props = defineProps<{
    isOpen: boolean,
    hasChildren: boolean
}>()
</script>

<template>
    <span
        class="mr-0.5"
        :class="{
        'bi-chevron-right': !isOpen,
        'bi-chevron-down': isOpen,
        invisible: !hasChildren
    }"></span>
</template>

<style scoped>

</style>
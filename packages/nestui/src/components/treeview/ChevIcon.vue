<template>
    <span
        class="mr-0.5"
        :class="{
            'bi-chevron-right': !isOpen,
            'bi-chevron-down': isOpen,
            invisible: !hasChildren
        }"
    />
</template>

<script setup lang="ts">

defineProps<{
    isOpen: boolean,
    hasChildren: boolean
}>()
</script>

<style scoped>

</style>
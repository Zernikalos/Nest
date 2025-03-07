<template>
    <i :class="`bi bi-${props.icon}`" />
</template>

<script setup lang="ts">

const props = defineProps<{
    icon: string
}>()

</script>

<style scoped>

</style>
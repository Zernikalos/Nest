<template>
    <div class="collapse collapse-arrow rounded-none">
        <input type="checkbox" />
        <div class="collapse-title py-4 px-0 text-xl font-medium">
            {{props.title}}
        </div>
        <div class="collapse-content">
            <slot></slot>
        </div>
    </div>

</template>

<script setup lang="ts">

const props = defineProps<{
    title: string
}>()

</script>

<style scoped>

</style>
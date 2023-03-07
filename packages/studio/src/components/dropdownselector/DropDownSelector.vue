<template>
    <select class="selector" @change="(ev) => emit('update:selected', ev.target.value)">
        <option :selected="props.selected === option" :value="option" v-for="option in props.options">
            {{option}}
        </option>
    </select>
</template>

<script setup lang="ts">

const props = defineProps<{
    options: string[],
    selected?: string
}>()

const emit = defineEmits(['update:selected'])

</script>

<style scoped>
.selector {
    @apply bg-gray-700 border border-gray-600
}
</style>

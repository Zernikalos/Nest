<template>
    <div>
        <select class="selector" @change="(ev) => emit('update:selected', ev.target.value)">
            <option :value="option" v-for="option in props.options">
                {{option}}
            </option>
        </select>
    </div>

</template>

<script setup lang="ts">

const props = defineProps<{
    options: string[],
    selected?: string
}>()

const log = console.log

const emit = defineEmits(['update:selected'])

</script>

<style scoped>
.selector {
    @apply bg-gray-900
}
</style>

<template>
    <div role="tab" class="tab tab-component" :class="{'active': props.isActive}" @click="emit('select')">
        {{props.title}}
        <button class="close-btn" @click="emit('close')">
            <span class="bi-x"></span>
        </button>
    </div>
</template>

<script setup lang="ts">
import {TabModel} from "./TabModel"

const props = withDefaults(defineProps<TabModel>(), {
    isActive: false
})

const emit = defineEmits(['close', 'select'])

</script>

<style scoped lang="postcss">
.tab-component {
    @apply whitespace-nowrap inline-block
}

.tab-component:hover .close-btn {
    @apply visible
}

.close-btn {
    @apply badge badge-neutral badge-sm pl-0 pr-0 ml-1 invisible
}

.close-btn:hover {
    @apply bg-base-300 border-base-300
}

.active {
    @apply tab-active [--tab-border-color:oklch(var(--n))] [--tab-bg:oklch(var(--b3))]
}

.active::before {
    @apply w-0 !important
}

</style>
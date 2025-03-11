<template>
    <div
        role="tab"
        class="tab tab-component"
        :class="{'active': props.isActive}"
        @click="emit('select')"
    >
        {{ props.title }}
        <CloseButton class="close-btn" @click="emit('close')" />
    </div>
</template>

<script setup lang="ts">
import {TabModel} from "./TabModel"
import CloseButton from "@nestui/components/CloseButton.vue"

const props = withDefaults(defineProps<TabModel>(), {
    isActive: false
})

const emit = defineEmits(["close", "select"])

</script>

<style scoped lang="postcss">
.tab-component {
    @apply whitespace-nowrap inline-block
}

.tab-component:hover .close-btn {
    @apply visible
}

.close-btn {
    @apply invisible
}

.close-btn:hover {
    @apply visible
}

.active {
    @apply tab-active [--tab-border-color:oklch(var(--n))] [--tab-bg:oklch(var(--b3))]
}

.active::before {
    @apply w-0 !important
}

</style>
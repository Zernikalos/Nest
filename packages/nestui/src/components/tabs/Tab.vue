<template>
    <div
        role="tab"
        class="tab tab-component"
        :class="{'active': props.isActive}"
        @click="emit('select')"
        :aria-selected="props.isActive.toString()"
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

<style scoped>
@reference "@nestui/assets/main.css";

.tab-component {
    @apply whitespace-nowrap inline-block;
    height: calc(var(--size-field, 0.25rem)* 8);
}

.tab-component:hover .close-btn {
    @apply visible;
}

.close-btn {
    @apply invisible
}

.close-btn:hover {
    @apply visible
}

.active {
    @apply [--tab-bg:var(--color-base-300)] [--tab-border-colors:var(--color-neutral)];
}

.active::before {
    @apply w-0!;
}

</style>
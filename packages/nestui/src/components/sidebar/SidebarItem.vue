<template>
    <li
        :class="`sidebar-border tooltip tooltip-right z-30 ${props.selected ? 'sidebar-item-selected' : ''}`"
        :data-tip="props.name"
        @click="select"
    >
        <RouterLink
            :class="`sidebar-item`"
            :to="props.path"
        >
            <Icon :icon="props.icon" />
        </RouterLink>
    </li>
</template>

<script setup lang="ts">
    import {defineEmits} from "vue"
    import Icon from "@nestui/components/Icon.vue";

    const emit = defineEmits(["item-selected"])

    const props = defineProps<{
        id: number,
        name: string,
        selected?: boolean
        path: string,
        icon: string
    }>()

    function select() {
        emit("item-selected", props.id)
    }

</script>

<style scoped lang="postcss">
.sidebar-item {
    @apply flex items-center text-4xl py-4 px-2 h-12 overflow-hidden text-ellipsis whitespace-nowrap hover:rounded-r hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out
}
.sidebar-border {
    @apply border-l-2 border-l-transparent
}
.sidebar-item-selected {
    @apply border-opacity-80 border-l-primary
}
</style>

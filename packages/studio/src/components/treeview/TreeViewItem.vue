<template>
    <li class="item">
        <div
                draggable="true"
                :class="{bold : hasChildren, 'item-text': true}"
                @click="toggle"
        >
            <span :class="{'bi-chevron-right': !isOpen, 'bi-chevron-down': isOpen, invisible: !hasChildren}"></span>
            <span :class="props.item.icon" v-if="props.item.icon"></span>
            <span>
                 {{props.item.name}}
            </span>
        </div>
        <ul>
            <TreeViewItem
                    v-show="isOpen"
                    v-if="hasChildren"
                    v-for="item in props.item.children"
                    :item="item"
            ></TreeViewItem>
        </ul>
    </li>

</template>

<script setup lang="ts">
import {TreeData} from "./TreeData"
import {computed, ref} from "vue";

const props = defineProps<{item: TreeData}>()
const isOpen = ref(true)

const hasChildren = computed(() => {
    const childCount = props.item.children?.length
    return childCount ? childCount > 0 : false
})

function toggle() {
    isOpen.value = !isOpen.value
}

</script>

<style scoped>
.item-text {
    @apply font-mono select-none whitespace-nowrap
}
.item {
    @apply ml-5 cursor-default
}
.bold {
    @apply font-bold
}

</style>

<template>
    <li class="item rounded-l rounded-r">
        <div
            ref="viewitem"
            draggable="true"
            class="item-text px-2 rounded-l rounded-r"
            :style="{'padding-left': `${props.level * 1.25}rem`}"
            :class="{'selected': isSelected}"
            :tabindex="-1"
            @dblclick="onDbClick"
            @click="onClick"
            @keydown.down="onKeyDown"
            @keydown.up="onKeyUp"
            @keydown.right="onKeyRight"
            @keydown.left="onKeyLeft"
        >
            <ChevIcon
                :direction="isOpen ? 'down' : 'right'"
                :visible="hasChildren"
            />
            <span
                v-if="props.icon"
                class="mr-1.5"
                :class="props.icon"
            />
            <span>
                {{ props.label }}
            </span>
        </div>
        <ul v-if="hasChildren">
            <TreeViewItem
                v-for="(child, index) in props.children"
                v-show="isOpen"
                :key="index"
                v-bind="child"
            />
        </ul>
    </li>
</template>

<script setup lang="ts">
import {computed, ref, Ref} from "vue"
import ChevIcon from "@nestui/components/ChevIcon.vue"
import {TreeNodeView, useTreeViewStore} from "./TreeViewStore"

const treeViewStore = useTreeViewStore()

const props = defineProps<TreeNodeView>()
const isOpen = ref(false)
const viewitem: Ref<HTMLDivElement | null> = ref(null)

const hasChildren = computed(() => {
    const childCount = props.children?.length
    return childCount ? childCount > 0 : false
})

const isSelected = computed(() => {
    const result = props.isSelected
    if (result) {
        viewitem.value?.focus()
    }
    return result
})

function onClick() {
    treeViewStore.select(props)
}

function onDbClick() {
    toggle()
}

function onKeyDown() {
    treeViewStore.selectNextVisible(props)
}

function onKeyUp() {
    treeViewStore.selectPrevVisible(props)
}

function onKeyRight() {
    openNode()
}

function onKeyLeft() {
    closeNode()
}

function toggle() {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        openNode()
    } else {
        closeNode()
    }
}

function openNode() {
    isOpen.value = true
    treeViewStore.open(props)
}

function closeNode() {
    isOpen.value = false
    treeViewStore.close(props)
}

</script>

<style scoped>
@reference "@nestui/assets/main.css";

.item-text {
    @apply font-mono select-none whitespace-nowrap
}
.item-text:focus-visible {
    outline: none;
}
.item {
    @apply cursor-default select-none
}
.selected {
    @apply bg-primary text-primary-content
}

</style>

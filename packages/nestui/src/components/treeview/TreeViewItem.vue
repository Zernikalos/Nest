<template>
    <li class="item rounded-l rounded-r">
        <div
            ref="viewitem"
            draggable="true"
            class="item-text px-2 rounded-l rounded-r"
            :style="{'padding-left': `${props.level * 1.25}rem`}"
            :class="{'selected': props.isSelected}"
            :tabindex="-1"
            @dblclick="onDbClick"
            @click="onClick"
            @keydown.down="onKeyDown"
            @keydown.up="onKeyUp"
            @keydown.right="onKeyRight"
            @keydown.left="onKeyLeft"
        >
            <ChevIcon
                :direction="props.isOpen ? 'down' : 'right'"
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
                v-show="props.isOpen" 
                :key="index"
                v-bind="child"
            />
        </ul>
    </li>
</template>

<script setup lang="ts">
import {computed, ref, Ref, watch} from "vue"
import ChevIcon from "@nestui/components/ChevIcon.vue"
import {TreeNodeView, useTreeViewStore} from "./TreeViewStore"

const treeViewStore = useTreeViewStore()

const props = defineProps<TreeNodeView>()
const viewitem: Ref<HTMLDivElement | null> = ref(null)

const hasChildren = computed(() => {
    const childCount = props.children?.length
    return childCount ? childCount > 0 : false
})

// Watch for selection changes to focus the item
watch(() => props.isSelected, (newValue) => {
    if (newValue) {
        viewitem.value?.focus()
    }
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
    if (hasChildren.value && !props.isOpen) {
        openNode()
    }
}

function onKeyLeft() {
    if (hasChildren.value && props.isOpen) {
        closeNode()
    } else if (props.parent) {
        // Optionally, move selection to parent if node is closed or has no children
        treeViewStore.select(props.parent)
    }
}

function toggle() {
    if (props.isOpen) {
        closeNode()
    } else {
        openNode()
    }
}

function openNode() {
    if (hasChildren.value) {
      treeViewStore.open(props)
    }
}

function closeNode() {
    if (hasChildren.value) {
      treeViewStore.close(props)
    }
}

</script>

<style scoped>
@reference "@nestui/assets/main.css";

.item-text {
    @apply font-mono select-none whitespace-nowrap;
    /* Ensure it can receive focus for the outline to appear */
    outline: none; 
}
.item-text:focus-visible {
    /* Using a common focus ring style, adjust color/size as needed */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
    /* Alternatively, for DaisyUI consistency if preferred later:
    outline: 2px solid oklch(var(--p)); 
    outline-offset: 1px; 
    */
}
.item {
    @apply cursor-default select-none;
}
.selected {
    /* Styles for selected item, ensure it's distinct from focus or combine them */
    @apply bg-primary text-primary-content;
}

</style>

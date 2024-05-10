<template>
    <li class="item">
        <div
            ref="viewitem"
            draggable="true"
            class="item-text"
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
            <ChevIcon :is-open="isOpen" :has-children="hasChildren"></ChevIcon>
            <span class="mr-1.5" :class="props.icon" v-if="props.icon"></span>
            <span>
                 {{props.label}}
            </span>
        </div>
        <ul>
            <TreeViewItem
                v-show="isOpen"
                v-if="hasChildren"
                v-for="child in props.children"
                v-bind="child"
                @node:select="(e) => forwardUpEvent('select', e)"
                @node:open="(e) => forwardUpEvent('open', e)"
                @node:close="(e) => forwardUpEvent('close', e)"
                @node:select-prev="(e) => forwardUpEvent('select-prev', e)"
                @node:select-next="(e) => forwardUpEvent('select-next', e)"
            >
            </TreeViewItem>
        </ul>
    </li>

</template>

<script setup lang="ts">
import {computed, ref, watch, Ref} from "vue";
import ChevIcon from "./ChevIcon.vue";
import {TreeNodeView} from "./TreeViewStore";

const props = defineProps<TreeNodeView>()
const emit = defineEmits<{
    'node:select': [value: TreeNodeView],
    'node:open': [value: TreeNodeView],
    'node:close': [value: TreeNodeView],
    'node:select-prev': [value: TreeNodeView],
    'node:select-next': [value: TreeNodeView]
}>()
const isOpen = ref(false)
const viewitem: Ref<HTMLDivElement | null> = ref(null)

const hasChildren = computed(() => {
    const childCount = props.children?.length
    return childCount ? childCount > 0 : false
})

watch(() => props.isSelected, (newValue) => {
    if (newValue) {
        viewitem.value?.focus()
    }
})

function onClick() {
    emit('node:select', props)
}

function onDbClick() {
    toggle()
}

function onKeyDown() {
    emit('node:select-next', props)
}

function onKeyUp() {
    emit('node:select-prev', props)
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
    emit('node:open', props)
}

function closeNode() {
    isOpen.value = false
    emit('node:close', props)
}

function forwardUpEvent(event: string, treeView: TreeNodeView) {
    switch (event) {
        case 'select':
            emit('node:select', treeView)
            break
        case 'open':
            emit('node:open', treeView)
            break
        case 'close':
            emit('node:close', treeView)
            break
        case 'select-next':
            emit('node:select-next', treeView)
            break
        case 'select-prev':
            emit('node:select-prev', treeView)
            break
    }
}

</script>

<style scoped>
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
    @apply bg-base-300 inline-block
}

</style>

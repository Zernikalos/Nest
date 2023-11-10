<template>
    <ul v-if="hasItems">
        <TreeViewItem
            v-bind="treeViewState.root.value"
            @node:select="handleNodeSelect"
            @node:open="handleNodeOpen"
            @node:close="handleNodeClose"
            @node:select-prev="handleSelectPrev"
            @node:select-next="handleSelectNext"
        />
    </ul>
    <span v-if="!hasItems">
      <h1>No elements</h1>
    </span>
</template>

<script setup lang="ts">
import TreeViewItem from "./TreeViewItem.vue"
import {computed, watch} from "vue"
import {TreeNode, TreeNodeView, useTreeViewState} from "./TreeNode";
import {isNil} from "lodash";

const props = defineProps<{
    items: TreeNode[]
}>()

const emit = defineEmits<{
    'selected': TreeNode[]
}>()

const hasItems = computed(() => props.items.length > 0)

const treeViewState = useTreeViewState()

watch(props.items, () => {
    const root = props.items.length > 0 ? props.items[0] : undefined
    treeViewState.convertRootToTreeView(root)
})

const root = props.items.length > 0 ? props.items[0] : undefined
treeViewState.convertRootToTreeView(root)

function handleNodeSelect(ev: TreeNodeView) {
    const treeNode = treeViewState.findByLabel(ev.label)
    if (isNil(treeNode)) {
        return
    }
    treeViewState.select(treeNode)
}

function handleSelectPrev(ev: TreeNodeView) {
    treeViewState.selectPrevVisible(ev)
}

function handleSelectNext(ev: TreeNodeView) {
    treeViewState.selectNextVisible(ev)
}

function handleNodeOpen(ev: TreeNodeView) {
    treeViewState.open(ev)
}

function handleNodeClose(ev: TreeNodeView) {
    treeViewState.close(ev)
}

watch(treeViewState.lastSelected, () => {
    if (isNil(treeViewState.lastSelected.value)) {
        return
    }
    emit('selected', treeViewState.lastSelected.value)
})

</script>

<style scoped>

</style>

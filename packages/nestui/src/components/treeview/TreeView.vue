<template>
    <ul v-if="hasItems">
        <TreeViewItem
            v-bind="treeViewStore.root.value"
            @node:select="handleNodeSelect"
            @node:open="handleNodeOpen"
            @node:close="handleNodeClose"
            @node:select-prev="handleSelectPrev"
            @node:select-next="handleSelectNext"
        />
    </ul>
    <span v-if="!hasItems">
        <h1 class="mt-1.5 ml-1.5">No elements</h1>
    </span>
</template>

<script setup lang="ts">
import TreeViewItem from "./TreeViewItem.vue"
import {computed, watch} from "vue"
import {TreeNode, TreeNodeView, useTreeViewStore} from "./TreeViewStore"
import {isNil} from "lodash"

const props = defineProps<{
    items: TreeNode[]
}>()

const emit = defineEmits<{
    "select": TreeNode[]
}>()

const hasItems = computed(() => props.items.length > 0)

const treeViewStore = useTreeViewStore()

watch(props.items, () => {
    const root = props.items.length > 0 ? props.items[0] : undefined
    treeViewStore.convertRootToTreeView(root)
})

const root = props.items.length > 0 ? props.items[0] : undefined
treeViewStore.convertRootToTreeView(root)

function handleNodeSelect(ev: TreeNodeView) {
    const treeNode = treeViewStore.findById(ev.id)
    if (isNil(treeNode)) {
        return
    }
    treeViewStore.select(treeNode)
}

function handleSelectPrev(ev: TreeNodeView) {
    treeViewStore.selectPrevVisible(ev)
}

function handleSelectNext(ev: TreeNodeView) {
    treeViewStore.selectNextVisible(ev)
}

function handleNodeOpen(ev: TreeNodeView) {
    treeViewStore.open(ev)
}

function handleNodeClose(ev: TreeNodeView) {
    treeViewStore.close(ev)
}

watch(treeViewStore.lastSelected, () => {
    if (isNil(treeViewStore.lastSelected.value)) {
        return
    }
    emit("select", treeViewStore.lastSelected.value)
})

</script>

<style scoped>
@reference "@nestui/assets/main.css";

</style>

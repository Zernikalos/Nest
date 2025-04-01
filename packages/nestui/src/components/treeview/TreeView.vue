<template>
    <ul v-if="hasItems">
        <TreeViewItem
            v-bind="treeViewStore.root"
        />
    </ul>
    <span v-if="!hasItems">
        <h1 class="mt-1.5 ml-1.5">No elements</h1>
    </span>
</template>

<script setup lang="ts">
import TreeViewItem from "./TreeViewItem.vue"
import {computed, watch} from "vue"
import {TreeNode, useTreeViewStore} from "./TreeViewStore"
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

watch(() => treeViewStore.lastSelected, () => {
    if (isNil(treeViewStore.lastSelected)) {
        return
    }
    emit("select", treeViewStore.lastSelected)
})

</script>

<style scoped>
@reference "@nestui/assets/main.css";

</style>

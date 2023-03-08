<template>
    <ResizablePanel>
        <template v-slot:panel1>

            <TreeView :items="treeViewItems"></TreeView>

        </template>
        <template v-slot:panel2>

        </template>
    </ResizablePanel>
</template>

<script setup>
import ResizablePanel from "@studio/components/resizablepanel/ResizablePanel.vue"
import TreeView from "@studio/components/treeview/TreeView.vue"
import {useMrrLoaderStore} from "@mrrobotto/store/src";
import {MrObject} from "@mrrobotto/exporter";

const mrrStore = useMrrLoaderStore()

function convertToHierarchy(obj) {
    if (!obj) {
        return []
    }
    const result = {
        name: `[${obj.type}] ${obj.name}`,
        icon: obj.children.length > 0 ? "bi-folder" : undefined
    }
    result.children = obj.children.map((c) => convertToHierarchy(c))
    return result
}

const treeViewItems = [convertToHierarchy(mrrStore.root)]


</script>

<style scoped>

</style>

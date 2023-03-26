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
import {useZkoLoaderStore} from "@zernikalos/store/src";
import {ZObject} from "@zernikalos/exporter";
import {onMounted, ref} from "vue";

const mrrStore = useZkoLoaderStore()
const treeViewItems = ref([])

function convertToHierarchy(obj) {
    if (!obj) {
        return []
    }
    const result = {
        name: ` ${obj.name}`,
        icon: typesIcons[obj.type]
    }
    result.children = obj.children.map((c) => convertToHierarchy(c))
    return result
}

const typesIcons = {
    "Scene": "bi-map", //bi-aspect-ratio
    "Group": "bi-layout-wtf",
    "Model": "bi-box"
}

onMounted(() => {
    treeViewItems.value.splice(0)
    treeViewItems.value.push(convertToHierarchy(mrrStore.root))

})

</script>

<style scoped>

</style>

<template>
    <ResizablePanel>
        <template v-slot:panel1>
            <div class="h-full bg-neutral">
                <TreeView :items="treeViewItems2" ></TreeView>
            </div>
        </template>
        <template v-slot:panel2>
            <MonacoEditor class="h-full max-w-full overflow-x-scroll" model-value="hola amigo"></MonacoEditor>
        </template>
    </ResizablePanel>
</template>

<script setup>
import ResizablePanel from "@studio/components/resizablepanel/ResizablePanel.vue"
import TreeView from "@studio/components/treeview/TreeView.vue"
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useStudioStore} from "@zernikalos/store";
import MonacoEditor from "@studio/components/monacoeditor/MonacoEditor.vue";

const studioStore = useStudioStore()
const treeViewItems = reactive([])

function convertToHierarchy(obj) {
    if (!obj) {
        return []
    }
    const convertToHierarchyRecursive = (obj) => {
        const res = {
            id: obj.id,
            label: ` ${obj.name}`,
            icon: typesIcons[obj.type]
        }
        res.children = obj.children.map((c) => convertToHierarchyRecursive(c))
        return res
    }
    const result = convertToHierarchyRecursive(obj)
    return [result]
}

const typesIcons = {
    "Scene": "bi-map", //bi-aspect-ratio
    "Group": "bi-layout-wtf",
    "Model": "bi-box"
}

function updateTreeViewItems() {
    treeViewItems.splice(0)
    const converted = convertToHierarchy(studioStore.root)

    if (converted.length) {
        treeViewItems.push(...converted)
    }
}

const treeViewItems2 = computed(() => {
    return convertToHierarchy(studioStore.root)
})

watch(() => studioStore.root, () => {
    updateTreeViewItems()
})

onMounted(() => {
    updateTreeViewItems()
})

</script>

<style scoped>

</style>

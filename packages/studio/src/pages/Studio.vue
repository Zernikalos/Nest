<template>
    <ResizablePanel>
        <template v-slot:panel1>
            <div class="bg-base-100 common-panel">
                <TreeView :items="treeViewItems" @selected="handleSelected"></TreeView>
            </div>
        </template>
        <template v-slot:panel2>
            <div class="flex flex-col common-panel">
                <div class="absolute z-10 right-0">
                    <StudioViewSelector v-model="mode"></StudioViewSelector>
                </div>
                <div class="h-full" >
                    <MonacoEditor v-model="editorText" @update:modelValue="handleEditorUpdate" theme="dark" language="json" v-if="mode==='code'"></MonacoEditor>
                    <FormZObject v-else-if="mode==='form'"></FormZObject>
                </div>
            </div>
        </template>
    </ResizablePanel>
</template>

<script setup>
import ResizablePanel from "@studio/components/resizablepanel/ResizablePanel.vue"
import TreeView from "@studio/components/treeview/TreeView.vue"
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useStudioStore} from "@zernikalos/store";
import MonacoEditor from "@studio/components/monacoeditor/MonacoEditor.vue";
import StudioViewSelector from "@studio/views/StudioViewSelector.vue";
import FormZObject from "@studio/views/forms/FormZObject.vue";

const studioStore = useStudioStore()
const mode = ref('code')

function convertToHierarchy(obj) {
    if (!obj) {
        return []
    }
    const convertToHierarchyRecursive = (obj) => {
        const res = {
            id: obj.id,
            label: obj.name,
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

const treeViewItems = computed(() => {
    return convertToHierarchy(studioStore.root)
})


const editorText = ref("")

async function handleSelected(treeNode) {
    studioStore.selectById(treeNode.id)

    editorText.value = await studioStore.exportSelectedAsJsonString()
}

function handleEditorUpdate(newTextData) {
    // console.log(newTextData)
    studioStore.updateSelected(newTextData)
}

</script>

<style scoped>
.common-panel {
    @apply overflow-x-auto overflow-y-auto h-full
}

</style>

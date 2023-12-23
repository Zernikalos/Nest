<template>
    <ResizablePanel>
        <template v-slot:panel1>
            <div class="bg-base-100 common-panel">
                <TreeView :items="explorerStore.explorerItems" @selected="handleSelected"></TreeView>
            </div>
        </template>
        <template v-slot:panel2>
            <div class="flex flex-col common-panel">
                <div class="absolute z-10 right-0">
                    <EditorViewSelector v-model="mode"></EditorViewSelector>
                </div>
                <div class="h-full" >
                    <MonacoEditor v-model="editorText" @update:modelValue="handleEditorUpdate" theme="dark" language="json" v-if="mode==='code'"></MonacoEditor>
                    <FormZObject v-else-if="mode==='form'"></FormZObject>
                </div>
            </div>
        </template>
    </ResizablePanel>
</template>

<script setup lang="ts">
import {onActivated, ref, watch} from "vue";
import {useNestStore} from "@zernikalos/store";
import MonacoEditor from "@nestui/components/monacoeditor/MonacoEditor.vue"
import {storeToRefs} from "pinia";
import {useExplorerStore} from "@zernikalos/store/src/explorerStore";
import ResizablePanel from "@nestui/components/resizablepanel/ResizablePanel.vue"
import TreeView from "@nestui/components/treeview/TreeView.vue"
import EditorViewSelector from "@nestui/views/EditorViewSelector.vue"
import FormZObject from "@nestui/views/forms/FormZObject.vue"
import {TreeNode} from "@nestui/components/treeview/TreeNode";

const nestStore = useNestStore()
const explorerStore = useExplorerStore()
const mode = ref('code')

onActivated(() => {
    updateTreeView()
})

const { root } = storeToRefs(nestStore)

watch(root, () => {
    updateTreeView()
})

function updateTreeView() {
    explorerStore.load()
}

const editorText = ref("")

async function handleSelected(treeNode: TreeNode) {
    explorerStore.selectById(treeNode.id)

    editorText.value = await nestStore.exportObjectAsJsonString(explorerStore.selected)
}

function handleEditorUpdate(newTextData: string) {
    explorerStore.updateSelected(newTextData)
}

</script>

<style scoped>
.common-panel {
    @apply overflow-x-auto overflow-y-auto h-full
}

</style>

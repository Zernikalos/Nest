<template>
    <ResizablePanel orientation="horizontal">
        <template v-slot:panel1>
            <div class="panel1">
                <TreeView :items="explorerStore.explorerItems" @select="handleSelectTree"></TreeView>
            </div>
        </template>
        <template v-slot:panel2>
            <div class="panel2 flex flex-col h-full" v-if="tabs.length > 0">
                <TabList class="pt-0.5" :selected="explorerStore.selected?.id" :tabs="tabs" @select="handleSelectTab"></TabList>
                <div class="absolute z-10 right-0">
                    <EditorViewSelector v-model="mode"></EditorViewSelector>
                </div>
                <MonacoEditor class="flex-1" v-model="editorText" @update:modelValue="handleEditorUpdate" theme="dark" language="json" v-if="mode==='code'"></MonacoEditor>
                <FormZObject :obj="explorerStore.selected" v-else-if="mode==='form'"></FormZObject>
            </div>
        </template>
    </ResizablePanel>
</template>

<script setup lang="ts">
import TabList from "@nestui/components/tabs/TabList.vue";
import FormZObject from "@nestui/views/forms/FormZObject.vue";
import ResizablePanel from "@nestui/components/ResizablePanel.vue";
import MonacoEditor from "@nestui/components/monacoeditor/MonacoEditor.vue";
import TreeView from "@nestui/components/treeview/TreeView.vue";
import EditorViewSelector from "@nestui/views/EditorViewSelector.vue";
import {onActivated, reactive, ref, watch} from "vue";
import {TabModel} from "@nestui/components/tabs/TabModel";
import {storeToRefs} from "pinia";
import {TreeNode} from "@nestui/components/treeview/TreeViewModel";
import {useNestStore, useExplorerStore} from "@zernikalos/store"

const nestStore = useNestStore()
const explorerStore = useExplorerStore()
const mode = ref('code')

const tabs = reactive<TabModel[]>([])

const editorText = ref("")

async function handleSelectTree(treeNode: TreeNode) {
    await handleSelected(treeNode.id)
}

async function handleSelectTab(tab: TabModel) {
    await handleSelected(tab.id)
}

async function handleSelected(nodeId: string) {
    explorerStore.selectById(nodeId)
    const tab = {title: explorerStore.selected?.name!, id: explorerStore.selected?.id!}
    tabs.push(tab)

    editorText.value = await nestStore.exportObjectAsJsonString(explorerStore.selected)
}

function handleEditorUpdate(newTextData: string) {
    explorerStore.updateSelected(newTextData)
}
</script>

<style scoped>
.panel1 {
    @apply overflow-x-auto overflow-y-auto h-full
}

.panel2 {
    @apply overflow-x-auto overflow-y-auto
}
</style>
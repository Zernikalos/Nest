<template>
    <div v-if="!explorerStore.hasItems">
        <NewProject></NewProject>
    </div>
    <ResizablePanel v-else>
        <template v-slot:panel1>
            <div class="bg-base-100 common-panel">
                <TreeView :items="explorerStore.explorerItems" @select="handleSelectTree"></TreeView>
            </div>
        </template>
        <template v-slot:panel2>
            <div class="flex flex-col h-full" v-if="tabs.length > 0">
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
import {onActivated, reactive, ref, watch} from "vue";
import {useNestStore} from "@zernikalos/store";
import MonacoEditor from "@nestui/components/monacoeditor/MonacoEditor.vue"
import {storeToRefs} from "pinia";
import {useExplorerStore} from "@zernikalos/store/src/explorerStore";
import ResizablePanel from "@nestui/components/resizablepanel/ResizablePanel.vue"
import TreeView from "@nestui/components/treeview/TreeView.vue"
import EditorViewSelector from "@nestui/views/EditorViewSelector.vue"
import FormZObject from "@nestui/views/forms/FormZObject.vue"
import {TreeNode} from "@nestui/components/treeview/TreeNode";
import TabList from "@nestui/components/tabs/TabList.vue";
import {TabModel} from "@nestui/components/tabs/TabModel";
import NewProject from "@nestui/views/NewProject.vue";

const nestStore = useNestStore()
const explorerStore = useExplorerStore()
const mode = ref('code')

const tabs = reactive<TabModel[]>([])

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
.common-panel {
    @apply overflow-x-auto overflow-y-auto h-full
}

</style>

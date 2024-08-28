<template>
    <ResizablePanel orientation="horizontal">
        <template #panel1>
            <div class="panel1">
                <TreeView
                    :items="explorerStore.explorerItems"
                    @select="handleSelectTree"
                />
            </div>
        </template>
        <template #panel2>
            <div
                v-if="tabs.length > 0"
                class="panel2 flex flex-col h-full"
            >
                <TabList
                    class="pt-0.5"
                    :selected="explorerStore.selected?.id"
                    :tabs="tabs"
                    @select="handleSelectTab"
                />
                <div class="absolute z-10 right-0">
                    <EditorViewSelector v-model="mode" />
                </div>
                <MonacoEditor
                    v-if="mode==='code'"
                    v-model="editorText"
                    class="flex-1"
                    :theme="editorTheme"
                    language="json"
                    @update:model-value="handleEditorUpdate"
                />
                <FormZObject
                    v-else-if="mode==='form'"
                    :obj="explorerStore.selected"
                />
            </div>
        </template>
    </ResizablePanel>
</template>

<script setup lang="ts">
import TabList from "@nestui/components/tabs/TabList.vue"
import FormZObject from "@nestui/views/forms/FormZObject.vue"
import ResizablePanel from "@nestui/components/ResizablePanel.vue"
import MonacoEditor from "@nestui/components/monacoeditor/MonacoEditor.vue"
import TreeView from "@nestui/components/treeview/TreeView.vue"
import EditorViewSelector from "@nestui/views/EditorViewSelector.vue"
import {computed, reactive, ref} from "vue"
import {TabModel} from "@nestui/components/tabs/TabModel"
import {TreeNode} from "@nestui/components/treeview/TreeViewModel"
import {useNestStore, useExplorerStore, useUserSettingsStore} from "@zernikalos/store"
import _ from "lodash"

const nestStore = useNestStore()
const explorerStore = useExplorerStore()
const themeStore = useUserSettingsStore()
const mode = ref("code")

const tabs = reactive<TabModel[]>([])

const editorText = ref("")

const editorTheme = computed(() => themeStore.isDarkTheme ? "dark" : "light")

async function handleSelectTree(treeNode: TreeNode) {
    await handleSelected(treeNode.id)
}

async function handleSelectTab(tab: TabModel) {
    await handleSelected(tab.id)
}

async function handleSelected(nodeId: string) {
    explorerStore.selectById(nodeId)
    if (_.isNil(explorerStore.selected)) {
        return
    }
    const {name, id} = explorerStore.selected
    const tab = {title: name, id}
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
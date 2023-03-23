<template>
    <div class="flex flex-col">
<!--        <div class="flex">-->
<!--            <FileSelector class="w-1/2" v-model:file-selected="inputFile"></FileSelector>-->
<!--            <DropDownSelector v-model:selected="selectedInputFormat" :options="inputFormats"></DropDownSelector>-->

<!--        </div>-->
        <div class="flex">
            <FileSelectorFormat :formats="inputFormats" v-model:format-selected="selectedInputFormat" @update:file-selected="handleUpdateFileSelected"></FileSelectorFormat>

            <Toggle
                left-label="PROTO" left-value="proto"
                right-label="JSON" right-value="json"
                v-model:selected="selectedOutputFormat"
                @update:selected="updateFormat"
            ></Toggle>
        </div>

        <Button @click="exportToZko">Export</Button>

        <div class="flex h-full space-x-5">
            <MonacoEditor class="grow" v-model:editor-text="editorText" :language="selectedOutputFormat === 'proto' ? 'text' : 'json'" format="json"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue"

import MonacoEditor from "@studio/components/monacoeditor/MonacoEditor.vue"
import Toggle from "@studio/components/toggle/Toggle.vue"
import Button from "@studio/components/Button.vue"
import FileSelectorFormat from "@studio/components/fileselector/FileSelectorFormat.vue"

import * as fileApi from "@studio/hooks/useFileApi"
import {useZkoLoaderStore} from "@zernikalos/store/src";

const inputFile = ref()
const editorText = ref()
/**
 * @type {Ref<UnwrapRef<'json'|'proto'>>}
 */
const selectedOutputFormat = ref('json')
/**
 * @type {Ref<UnwrapRef<'obj'|'gltf'>>}
 */
const selectedInputFormat = ref('obj')

const inputFormats = [{label: 'obj', extensions: ['obj']}, {label: 'gltf', extensions: ['gltf', 'glb']}]

const zko = ref()

const zkoStore = useZkoLoaderStore()

onMounted(() => {
    updateEditor()
})

function handleUpdateFileSelected(ev) {
    inputFile.value = ev
    editorText.value = ""
}

function updateFormat() {
    if (!zkoStore.root) {
        return
    }
    updateEditor()
}

async function updateEditor() {
    editorText.value = await zkoStore.exportAs({format: selectedOutputFormat.value, beauty: true, stringify: true})
}

async function exportToZko() {
    if (!inputFile.value) {
        return ""
    }
    const {path, name} = inputFile.value
    const fileUrl = await fileApi.getUrlForFile(path, name)

    await zkoStore.loadFromFile({filePath: fileUrl, format: selectedInputFormat.value})
    updateEditor()
}


</script>

<style scoped>
</style>

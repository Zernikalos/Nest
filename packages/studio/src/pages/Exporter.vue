<template>
    <div class="flex flex-col grow">
        <div class="flex">
            <FileSelectorFormat :formats="inputFormats" v-model:format-selected="selectedInputFormat" @update:file-selected="handleUpdateFileSelected"></FileSelectorFormat>

            <Toggle
                left-label="PROTO" left-value="proto"
                right-label="JSON" right-value="json"
                v-model:selected="selectedOutputFormat"
                @update:selected="updateEditor"
            ></Toggle>
        </div>

        <Button @click="handleBundleClick">Export</Button>

        <div class="flex h-full space-x-5">
            <MonacoEditor class="grow" v-model="editorText" :language="selectedOutputFormat === 'proto' ? 'text' : 'json'" format="json"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue"
import _ from "lodash"

import MonacoEditor from "@studio/components/monacoeditor/MonacoEditor.vue"
import Toggle from "@studio/components/toggle/Toggle.vue"
import Button from "@studio/components/Button.vue"
import FileSelectorFormat from "@studio/components/fileselector/FileSelectorFormat.vue"

import {useFileApiStore, useStudioStore} from "@zernikalos/store";

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

const inputFormats = [
    {label: 'obj', extensions: ['obj']},
    {label: 'gltf', extensions: ['gltf', 'glb']},
    {label: 'fbx', extensions: ['fbx']}
]

const zko = ref()

const studioStore = useStudioStore()
const fileApiStore = useFileApiStore()

onMounted(() => {
    updateEditor()
})

function handleUpdateFileSelected(ev) {
    inputFile.value = ev
    editorText.value = ""
}

async function updateEditor() {
    if (selectedOutputFormat.value === 'json') {
        editorText.value = await studioStore.exportRootAsJsonString()
    } else {
        editorText.value = await studioStore.exportRootAsProtoString()
    }
}

async function handleBundleClick() {
  if (selectedOutputFormat.value === "proto") {
    //editorText.value = await studioStore.exportRootAsProtoString()
    const url = await fileApiStore.getUrlForFile(inputFile.value.path, inputFile.value.name)
    await studioStore.parseFile({filePath: url, format: selectedInputFormat.valuet})
    editorText.value = await studioStore.exportRootAsJsonString()
  } else {
    //editorText.value = await studioStore.exportRootAsJsonString()
    const url = await fileApiStore.getUrlForFile(inputFile.value.path, inputFile.value.name)
    await studioStore.parseFile({filePath: url, format: selectedInputFormat.value})
    editorText.value = await studioStore.exportRootAsJsonString()
  }
}

</script>

<style scoped>
</style>

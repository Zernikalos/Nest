<template>
    <div class="flex flex-col grow h-full">
        <div class="flex">
            <Toggle
                left-label="PROTO" left-value="proto"
                right-label="JSON" right-value="json"
                v-model:selected="selectedOutputFormat"
                @update:selected="updateEditor"
            ></Toggle>
        </div>

        <div class="flex flex-1 space-x-5">
            <MonacoEditor class="grow" v-model="editorText" :language="selectedOutputFormat === 'proto' ? 'text' : 'json'" format="json"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue"

import MonacoEditor from "@studio/components/monacoeditor/MonacoEditor.vue"
import Toggle from "@studio/components/toggle/Toggle.vue"

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
        editorText.value = await studioStore.exportRootAsJsonStringFull()
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

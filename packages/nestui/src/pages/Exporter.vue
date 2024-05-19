<template>
    <div class="flex flex-col grow h-full">
        <div class="flex">
            <Toggle
                left-label="PROTO" left-value="proto"
                right-label="JSON" right-value="json"
                v-model:selected="selectedOutputFormat"
                @update:selected="updateEditor"
            ></Toggle>
            <Button @click="handleDownload">Download</Button>
        </div>

        <div class="flex flex-1 space-x-5">
            <MonacoEditor class="grow" v-model="editorText" :language="selectedOutputFormat === 'proto' ? 'text' : 'json'" format="json"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue"

import MonacoEditor from "@nestui/components/monacoeditor/MonacoEditor.vue"
import Toggle from "@nestui/components/toggle/Toggle.vue"

import {useFileApiStore, useNestStore, useNativeNest, useNestApiStore} from "@zernikalos/store";
import Button from "@nestui/components/Button.vue";
import useWriteToFile from "@nestui/hooks/useWriteToFile";

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

const nestStore = useNestStore()
const fileApiStore = useFileApiStore()
const nativeStore = useNativeNest()
const nestApiStore = useNestApiStore()

onMounted(() => {
    updateEditor()
})

function handleUpdateFileSelected(ev) {
    inputFile.value = ev
    editorText.value = ""
}

async function updateEditor() {
    if (selectedOutputFormat.value === 'json') {
        editorText.value = await nestStore.exportRootAsJsonStringFull()
    } else {
        editorText.value = await nestStore.exportRootAsProtoString()
    }
}

async function handleBundleClick() {
  if (selectedOutputFormat.value === "proto") {
    const url = await fileApiStore.getUrlForFile(inputFile.value.path, inputFile.value.name)
    await nestStore.parseFile({filePath: url, format: selectedInputFormat.value})
    editorText.value = await nestStore.exportRootAsJsonString()
  } else {
    const url = await fileApiStore.getUrlForFile(inputFile.value.path, inputFile.value.name)
    await nestStore.parseFile({filePath: url, format: selectedInputFormat.value})
    editorText.value = await nestStore.exportRootAsJsonString()
  }
}

async function handleDownload() {
    // const content = await nestStore.exportRootAsProtoBuffer()
    //
    // const {fileUri, name} = useWriteToFile("sample.zko", content)
    // function saveBlob(uri, fileName) {
    //     var a = document.createElement("a");
    //     document.body.appendChild(a);
    //     a.style = "display: none";
    //
    //     // var url = window.URL.createObjectURL(blob);
    //     a.href = uri;
    //     a.download = fileName;
    //     a.click();
    //     window.URL.revokeObjectURL(uri);
    // }
    //
    // saveBlob(fileUri, name)
    const content = await nestStore.exportRootAsProtoBuffer()
    nestApiStore.sendData(content.buffer)
}

</script>

<style scoped>
</style>

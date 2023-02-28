<template>
    <div class="flex flex-col">
        <div class="flex">
            <FileSelector class="w-1/2" v-model:file-selected="inputFile"></FileSelector>
            <OutputFormatSelector class="w-1/2" :selected="selectedFormat" @update:selected="updateFormat"></OutputFormatSelector>
        </div>
        <div class="flex h-full space-x-5">
            <MonacoEditor class="grow" v-model:editor-text="editorText" format="json"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import MonacoEditor from "@studio/components/MonacoEditor.vue"
import {exportAs, parseMrr} from "@studio/hooks/useParseToMrr"
import {ref, watch} from "vue"
import OutputFormatSelector from "@studio/components/OutputFormatSelector.vue";
import FileSelector from "@studio/components/FileSelector.vue"
import * as fileApi from "@studio/hooks/useFileApi"

const inputFile = ref()
const editorText = ref()
const selectedFormat = ref('json')

const exported = ref()

watch(inputFile, async () => {
    if (!inputFile.value) {
        return ""
    }
    const {path, name} = inputFile.value
    const fileUrl = await fileApi.getUrlForFile(path, name)
    exported.value = await parseMrr(fileUrl)
    editorText.value = exportAs(exported.value, {format: selectedFormat.value, beauty: true})
})

function updateFormat(format) {
    selectedFormat.value = format
    if (!exported.value) {
        return
    }
    editorText.value = exportAs(exported.value, {format: selectedFormat.value, beauty: true})
}

</script>

<style scoped>
</style>

<template>
    <div class="flex flex-col">
        <div class="flex">
            <FileSelector class="w-1/2" v-model:file-selected="inputFile"></FileSelector>
            <OutputFormatSelector class="w-1/2"></OutputFormatSelector>
        </div>
        <div class="flex h-full space-x-5">
            <MonacoEditor class="grow" v-model:editor-text="editorText" format="json"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import MonacoEditor from "@studio/components/MonacoEditor.vue"
import useParseToMrr from "@studio/hooks/useParseToMrr"
import {ref, watch} from "vue"
import OutputFormatSelector from "@studio/components/OutputFormatSelector.vue";
import FileSelector from "@studio/components/FileSelector.vue"
import * as fileApi from "@studio/hooks/useFileApi"

const inputFile = ref()
const editorText = ref()

watch(inputFile, async () => {
    if (!inputFile.value) {
        return ""
    }
    const {path, name} = inputFile.value
    const exposeId = await fileApi.expose(path)
    const fileUrl = fileApi.buildFilePath(exposeId, name)
    editorText.value = await useParseToMrr(fileUrl)
})

</script>

<style scoped>
</style>

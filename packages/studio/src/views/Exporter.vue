<template>
    <div class="flex flex-col">
        <div class="flex">
            <FileSelector class="w-1/2" v-model:file-selected="inputFile"></FileSelector>
            <DropDownSelector v-model:selected="selectedInputFormat" :options="inputFormats"></DropDownSelector>
            <Toggle
                    left-label="PROTO" left-value="proto"
                    right-label="JSON" right-value="json"
                    v-model:selected="selectedOutputFormat"
                    @update:selected="updateFormat"
            ></Toggle>
        </div>

        <div class="flex h-full space-x-5">
            <MonacoEditor class="grow" v-model:editor-text="editorText" :language="selectedOutputFormat === 'proto' ? 'text' : 'json'" format="json"></MonacoEditor>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from "vue"
import MonacoEditor from "@studio/components/monacoeditor/MonacoEditor.vue"
import {exportAs, parseMrr} from "@studio/hooks/useParseToMrr"
import FileSelector from "@studio/components/FileSelector.vue"
import * as fileApi from "@studio/hooks/useFileApi"
import Toggle from "@studio/components/toggle/Toggle.vue";
import DropDownSelector from "@studio/components/dropdownselector/DropDownSelector.vue";

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

const inputFormats = ['obj', 'gltf']

const mrr = ref()

watch(inputFile, async () => {
    if (!inputFile.value) {
        return ""
    }
    const {path, name} = inputFile.value
    const fileUrl = await fileApi.getUrlForFile(path, name)
    mrr.value = await parseMrr(fileUrl, {format: selectedInputFormat.value})
    updateEditor()
})

function updateFormat() {
    if (!mrr.value) {
        return
    }
    updateEditor()
}

function updateEditor() {
    editorText.value = exportAs(mrr.value, {format: selectedOutputFormat.value, beauty: true, stringify: true})
}

</script>

<style scoped>
</style>

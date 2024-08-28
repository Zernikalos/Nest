<template>
    <div class="flex flex-col grow h-full">
        <div class="flex">
            <Toggle
                v-model:selected="selectedOutputFormat"
                left-label="PROTO"
                left-value="proto"
                right-label="JSON"
                right-value="json"
                @update:selected="updateEditor"
            />
            <Button @click="handleDownload">
                Download
            </Button>
        </div>

        <div class="flex flex-1 space-x-5">
            <MonacoEditor
                v-model="editorText"
                class="grow"
                :language="selectedOutputFormat === 'proto' ? 'text' : 'json'"
                format="json"
            />
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue"

import MonacoEditor from "@nestui/components/monacoeditor/MonacoEditor.vue"
import Toggle from "@nestui/components/toggle/Toggle.vue"

import {useNestStore, useNestApiStore} from "@zernikalos/store"
import Button from "@nestui/components/Button.vue"

const editorText = ref()
/**
 * @type {Ref<UnwrapRef<'json'|'proto'>>}
 */
const selectedOutputFormat = ref("json")

const nestStore = useNestStore()
const nestApiStore = useNestApiStore()

onMounted(() => {
    updateEditor()
})

async function updateEditor() {
    if (selectedOutputFormat.value === "json") {
        editorText.value = await nestStore.exportRootAsJsonStringFull()
    } else {
        editorText.value = await nestStore.exportRootAsProtoString()
    }
}

async function handleDownload() {
    const content = await nestStore.exportRootAsProtoBuffer()
    nestApiStore.sendData(content.buffer)
}

</script>

<style scoped>
</style>

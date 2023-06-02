<template>
  <q-page class="column">
    <div class="q-pa-md">
      <FileWithExtensionUpload v-model="file" @click-import="handleImportRequest" class="col-7"></FileWithExtensionUpload>
    </div>

    <div class="row col">
      <MonacoEditor language="json" v-model="editorText" class="col-grow"></MonacoEditor>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {FormatFile} from "components/fileselector/models"
import {useFileApiStore} from "stores/fileapi-store"
import {useStudioStore} from "stores/studio-store"
import MonacoEditor from "components/monacoeditor/MonacoEditor.vue"
import FileWithExtensionUpload from "components/fileselector/FileWithExtensionUpload.vue"

const fileApiStore = useFileApiStore()
const studioStore = useStudioStore()

const editorText = ref("")

const file = ref<FormatFile>(null)

async function handleImportRequest() {
    const url = await fileApiStore.getUrlForFile(file.value.path, file.value.name)
    await studioStore.parseFile({filePath: url, format: file.value.format})
    editorText.value = await studioStore.exportRootAsJsonString()
}

</script>

<style scoped>

</style>

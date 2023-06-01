<template>
  <div class="column">
    <div class="text-h5">
      {{ $t('fileToLoad') }}
    </div>

    <FileSelectWithExtension v-model="fileSelected" :options="inputFormats"></FileSelectWithExtension>

    <div>
      <q-btn color="primary" :disable="fileSelected == null" @click="handleImportClick">
        Import from file
      </q-btn>
    </div>

  </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import FileSelectWithExtension from "components/fileselector/FileSelectWithExtension.vue"
import {FileFormats, FormatFile} from "components/fileselector/models"

const inputFormats: FileFormats[] = [{label: "OBJ", value: "obj", extensions: ["obj"]}, {label: "GLTF", value: "gltf", extensions: ["gltf", "glb"]}]

const props = defineProps<{
    modelValue: FormatFile | null
}>()

const fileSelected = ref<FormatFile>(props.modelValue)

const emit = defineEmits<{
    (e: "update:modelValue", f: FormatFile): void
    (e: "clickImport"): void
}>()

function handleImportClick() {
    emit("update:modelValue", fileSelected.value)
    emit("clickImport")
}

</script>

<style scoped>

</style>

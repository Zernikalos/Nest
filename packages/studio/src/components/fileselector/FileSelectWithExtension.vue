<template>
  <div class="row">
    <div class="col-7">
      <q-file square filled v-model="fileSelected" @update:modelValue="handleUpdate">
        <template v-slot:prepend>
          <q-icon name="cloud_upload" @click.stop.prevent />
        </template>
      </q-file>
    </div>
    <div class="col-3">
      <q-select square filled v-model="inputFormat" :options="props.options" label="File formats" stack-label :dense="false" :options-dense="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import _ from "lodash"
import {FileFormats, FormatFile} from "components/fileselector/models"

const props = defineProps<{
  modelValue: FormatFile | null,
  options: FileFormats[]
}>()

const inputFormat = ref<FileFormats | null>(null)

const fileSelected = ref<File | null>(null)

const emit = defineEmits<{
  (e: "update:modelValue", f: FormatFile): void
}>()

function handleUpdate() {
    if (_.isNil(fileSelected.value)) {
        return
    }
    const name = fileSelected.value.name
    let path = fileSelected.value.path
    path = path.replace(name, "")
    const formatIdx = getSuggestedFileFormat(name, props.options)
    inputFormat.value = props.options[formatIdx]

    emit("update:modelValue", {path, name, format: inputFormat.value.value})
}

function getSuggestedFileFormat(fileName: string, formats: FileFormats[]): number {
    const extension = getExtension(fileName)
    for (let i = 0; i < formats.length; i++) {
        if (formats[i].extensions.indexOf(extension) >= 0) {
            return i
        }
    }
    return -1
}

function getExtension(filename: string): string {
    return filename.split(".").pop() ?? ""
}

</script>

<style scoped>

</style>

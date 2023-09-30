<template>
    <div class="flex flex-col grow gap-y-2">
        <FileSelectorFormat
            :formats="inputFormats"
            v-model:format-selected="selectedInputFormat"
            @update:file-selected="handleUpdateFileSelected"
        ></FileSelectorFormat>
        <button v-if="!loading" class="btn btn-info" @click="handleExportClick">Export</button>
        <span v-else class="loading loading-spinner loading-lg self-center"></span>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import Button from "@studio/components/Button.vue"
import FileSelectorFormat from "@studio/components/fileselector/FileSelectorFormat.vue"

import {useFileApiStore, useStudioStore} from "@zernikalos/store";

const inputFile = ref()

/**
 * @type {Ref<UnwrapRef<'obj'|'gltf'|'fbx'>>}
 */
const selectedInputFormat = ref('obj')

const inputFormats = [
    {label: 'obj', extensions: ['obj']},
    {label: 'gltf', extensions: ['gltf', 'glb']},
    {label: 'fbx', extensions: ['fbx']}
]

const loading = ref(false)

const emit = defineEmits(['finish'])

const studioStore = useStudioStore()
const fileApiStore = useFileApiStore()

function handleUpdateFileSelected(ev) {
    inputFile.value = ev
}

async function handleExportClick() {
    loading.value = true
    const url = await fileApiStore.getUrlForFile(inputFile.value.path, inputFile.value.name)
    await studioStore.parseFile({filePath: url, format: selectedInputFormat.value})
    loading.value = false
    emit('finish')
}
</script>

<style scoped>

</style>
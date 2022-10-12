<template>
    <input type="file" id="file" @change="handleUploadFile" />
    <a
        v-if="mrrFile.name"
        :href="`${mrrFile.url}`"
        :download="mrrFile.name">
        DOWNLOAD {{ mrrFile.name }}
    </a>


    <div class=" justify-center items-center w-1/3">
    <label for="dropzone-file" class="flex flex-col justify-center items-center w-full h-64 rounded-lg border-2  border-dashed cursor-pointer hover:bg-bray-800 bg-gray-700 hover:bg-gray-10 border-gray-600 hover:border-gray-500 hover:bg-gray-600">
        <div class="flex flex-col justify-center items-center pt-5 pb-6">
            <svg aria-hidden="true" class="mb-3 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
        </div>
        <input id="dropzone-file" type="file" class="hidden" />
    </label>
    </div>
</template>

<script setup>
import {reactive} from "vue"
import {merge} from "lodash";
import useMrrExporter from "../hooks/useMrrExporter"

const mrrFile = reactive({
    url: undefined,
    name: undefined,
    blob: undefined
})

async function handleUploadFile(ev) {
    ev.preventDefault()
    const file = ev.target?.files.length > 0 ? ev.target?.files[0] : undefined
    if (file === undefined) {
        return
    }
    merge(mrrFile, await useMrrExporter(file))
}

</script>

<style scoped>

</style>
